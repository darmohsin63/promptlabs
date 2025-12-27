import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Save, Search, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMaxStars } from "@/hooks/useRatings";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { StarRating } from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { TableSkeleton } from "@/components/TableSkeleton";
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
  admin_rating: number | null;
  admin_rating_count: number | null;
}

export default function AdminRatings() {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { maxStars, loading, updateMaxStars } = useMaxStars();
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Prompts rating management
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editRatingCount, setEditRatingCount] = useState("");
  const [savingRating, setSavingRating] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [authLoading, isAdmin, navigate]);

  // Fetch prompts
  useEffect(() => {
    if (isAdmin) fetchPrompts();
  }, [isAdmin]);

  const fetchPrompts = async () => {
    setDataLoading(true);
    const { data } = await supabase
      .from("prompts")
      .select("id, title, author, admin_rating, admin_rating_count")
      .order("created_at", { ascending: false });
    if (data) setPrompts(data);
    setDataLoading(false);
  };

  const currentValue = selectedStars ?? maxStars;

  const handleSave = async () => {
    if (selectedStars === null || selectedStars === maxStars) return;
    
    setSaving(true);
    const { error } = await updateMaxStars(selectedStars);
    setSaving(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update max stars setting",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved!",
        description: `Rating system now uses ${selectedStars} stars`,
      });
      setSelectedStars(null);
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

  const filteredPrompts = prompts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container pt-24 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container pt-20 pb-12 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-up">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="glass-card !rounded-full p-2 hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Rating Settings</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Max Stars Setting */}
          <div className="glass-panel animate-fade-up">
            <h2 className="text-lg font-semibold mb-4">Maximum Rating Stars</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Configure how many stars are displayed in the rating system. Users will be able to rate prompts from 1 to this number.
            </p>

            <div className="space-y-6">
              {/* Star options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[3, 5, 7, 10].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setSelectedStars(stars)}
                    className={`glass-card !rounded-xl p-4 text-center transition-all duration-200 ${
                      currentValue === stars
                        ? "ring-2 ring-primary bg-primary/10"
                        : "hover:bg-secondary/80"
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{stars}</div>
                    <div className="text-xs text-muted-foreground">stars</div>
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="p-4 bg-secondary/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-3">Preview:</p>
                <StarRating maxStars={currentValue} rating={Math.ceil(currentValue / 2)} readonly size="lg" showValue />
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving || selectedStars === null || selectedStars === maxStars}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>

          {/* Prompt Ratings Management */}
          <div className="glass-panel animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-lg font-semibold mb-4">Prompt Ratings</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Set custom admin ratings for any prompt. These will override user ratings in display.
            </p>

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
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 font-semibold text-foreground text-sm">Title</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm">Author</th>
                      <th className="text-left p-4 font-semibold text-foreground text-sm">Rating</th>
                      <th className="text-right p-4 font-semibold text-foreground text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrompts.map((p) => {
                      const hasAdminRating = p.admin_rating !== null;
                      return (
                        <tr key={p.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                          <td className="p-4">
                            <p className="font-medium text-foreground">{p.title}</p>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">{p.author}</td>
                          <td className="p-4">
                            {hasAdminRating ? (
                              <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium">{p.admin_rating?.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({p.admin_rating_count})</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Not set</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openRatingDialog(p)}
                            >
                              {hasAdminRating ? "Edit" : "Set Rating"}
                            </Button>
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
          </div>
        </div>
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
