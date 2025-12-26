import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/TableSkeleton";
import { StarRating } from "@/components/StarRating";
import { useMaxStars } from "@/hooks/useRatings";
import { ArrowLeft, Trash2, Search, Eye, Pencil, Check, Clock, Sparkles, Star, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Prompt {
  id: string;
  title: string;
  author: string;
  created_at: string;
  scheduled_at: string | null;
  is_approved: boolean | null;
  category: string[] | null;
  admin_rating: number | null;
  admin_rating_count: number | null;
}

export default function AdminPrompts() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter"); // "pending" or "scheduled"
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [categorizing, setCategorizing] = useState(false);
  const { maxStars } = useMaxStars();
  
  // Rating dialog state
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editRatingCount, setEditRatingCount] = useState("");
  const [savingRating, setSavingRating] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchPrompts();
  }, [isAdmin]);

  const fetchPrompts = async () => {
    setDataLoading(true);
    const { data } = await supabase
      .from("prompts")
      .select("id, title, author, created_at, scheduled_at, is_approved, category, admin_rating, admin_rating_count")
      .order("created_at", { ascending: false });
    if (data) setPrompts(data);
    setDataLoading(false);
  };

  const batchCategorize = async () => {
    setCategorizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('batch-categorize');
      if (error) throw error;
      toast({ 
        title: "Categorization Complete", 
        description: `Processed ${data.processed} prompts` 
      });
      fetchPrompts();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to categorize prompts", 
        variant: "destructive" 
      });
    } finally {
      setCategorizing(false);
    }
  };

  const uncategorizedCount = prompts.filter(p => !p.category || p.category.length === 0).length;

  const approvePrompt = async (id: string) => {
    const { error } = await supabase
      .from("prompts")
      .update({ is_approved: true, approved_at: new Date().toISOString(), approved_by: user?.id })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Approved", description: "Prompt is now visible." });
      setPrompts(prompts.map(p => p.id === id ? { ...p, is_approved: true } : p));
    }
  };

  const deletePrompt = async (id: string) => {
    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Prompt removed." });
      setPrompts(prompts.filter(p => p.id !== id));
    }
  };

  const openRatingDialog = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setEditRating(prompt.admin_rating || 0);
    setEditRatingCount(prompt.admin_rating_count?.toString() || "");
    setRatingDialogOpen(true);
  };

  const saveRating = async () => {
    if (!selectedPrompt) return;
    
    setSavingRating(true);
    const { error } = await supabase
      .from("prompts")
      .update({ 
        admin_rating: editRating || null, 
        admin_rating_count: editRatingCount ? parseInt(editRatingCount) : null 
      })
      .eq("id", selectedPrompt.id);
    
    setSavingRating(false);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Rating updated successfully." });
      setPrompts(prompts.map(p => 
        p.id === selectedPrompt.id 
          ? { ...p, admin_rating: editRating || null, admin_rating_count: editRatingCount ? parseInt(editRatingCount) : null } 
          : p
      ));
      setRatingDialogOpen(false);
    }
  };

  const clearRating = async () => {
    if (!selectedPrompt) return;
    
    setSavingRating(true);
    const { error } = await supabase
      .from("prompts")
      .update({ admin_rating: null, admin_rating_count: null })
      .eq("id", selectedPrompt.id);
    
    setSavingRating(false);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Cleared", description: "Admin rating removed." });
      setPrompts(prompts.map(p => 
        p.id === selectedPrompt.id 
          ? { ...p, admin_rating: null, admin_rating_count: null } 
          : p
      ));
      setRatingDialogOpen(false);
    }
  };

  let filteredPrompts = prompts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filter === "pending") {
    filteredPrompts = filteredPrompts.filter(p => p.is_approved === false);
  } else if (filter === "scheduled") {
    filteredPrompts = filteredPrompts.filter(p => p.scheduled_at && new Date(p.scheduled_at) > new Date());
  }

  const getTitle = () => {
    if (filter === "pending") return "Pending Prompts";
    if (filter === "scheduled") return "Scheduled Prompts";
    return "All Prompts";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container pt-20 pb-12 px-4">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{getTitle()}</h1>
          {uncategorizedCount > 0 && (
            <Button
              onClick={batchCategorize}
              disabled={categorizing}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Sparkles className={`w-4 h-4 ${categorizing ? 'animate-spin' : ''}`} />
              {categorizing ? 'Categorizing...' : `Categorize ${uncategorizedCount} prompts`}
            </Button>
          )}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        {dataLoading ? (
          <TableSkeleton />
        ) : (
          <div className="glass-table overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Title</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Author</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm hidden md:table-cell">Date</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Rating</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Status</th>
                  <th className="text-right p-4 font-semibold text-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrompts.map((p) => {
                  const isPending = p.is_approved === false;
                  const isScheduled = p.scheduled_at && new Date(p.scheduled_at) > new Date();
                  const hasAdminRating = p.admin_rating !== null;
                  return (
                    <tr key={p.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{p.title}</p>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{p.author}</td>
                      <td className="p-4 text-muted-foreground text-sm hidden md:table-cell">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => openRatingDialog(p)}
                          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          {hasAdminRating ? (
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium">{p.admin_rating?.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">({p.admin_rating_count})</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Set rating</span>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {isPending && (
                            <span className="px-2 py-1 bg-amber-500/15 text-amber-500 text-xs rounded-full">Pending</span>
                          )}
                          {isScheduled && (
                            <span className="px-2 py-1 bg-accent/15 text-accent text-xs rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Scheduled
                            </span>
                          )}
                          {!isPending && !isScheduled && (
                            <span className="px-2 py-1 bg-primary/15 text-primary text-xs rounded-full">Published</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/prompt/${p.id}`)}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/upload?edit=${p.id}`)}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4 text-primary" />
                          </Button>
                          {isPending && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => approvePrompt(p.id)}
                              className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                              title="Approve"
                            >
                              <Check className="w-4 h-4 text-primary" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePrompt(p.id)}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredPrompts.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">No prompts found</div>
            )}
          </div>
        )}
      </main>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Admin Rating</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Prompt</p>
              <p className="font-medium">{selectedPrompt?.title}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-3">Rating (out of {maxStars})</p>
              <StarRating
                maxStars={maxStars}
                rating={editRating}
                onRate={setEditRating}
                size="lg"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Number of ratings to display</p>
              <Input
                type="number"
                placeholder="e.g. 150"
                value={editRatingCount}
                onChange={(e) => setEditRatingCount(e.target.value)}
                min="0"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={saveRating}
                disabled={savingRating || editRating === 0}
                className="flex-1"
              >
                {savingRating ? "Saving..." : "Save Rating"}
              </Button>
              {selectedPrompt?.admin_rating !== null && (
                <Button
                  variant="outline"
                  onClick={clearRating}
                  disabled={savingRating}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}