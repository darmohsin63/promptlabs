import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/TableSkeleton";
import { ArrowLeft, Trash2, Search, Mail, Check } from "lucide-react";

interface Feedback {
  id: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function AdminFeedback() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchFeedback();
  }, [isAdmin]);

  const fetchFeedback = async () => {
    setDataLoading(true);
    const { data } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
    if (data) setFeedback(data);
    setDataLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("feedback").update({ is_read: true }).eq("id", id);
    if (!error) {
      setFeedback(feedback.map(f => f.id === id ? { ...f, is_read: true } : f));
    }
  };

  const deleteFeedback = async (id: string) => {
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      setFeedback(feedback.filter(f => f.id !== id));
    }
  };

  const filteredFeedback = feedback.filter(f =>
    f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <h1 className="text-2xl font-bold text-foreground mb-6">Feedback</h1>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search feedback..."
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
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Email</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm">Message</th>
                  <th className="text-left p-4 font-semibold text-foreground text-sm hidden sm:table-cell">Date</th>
                  <th className="text-right p-4 font-semibold text-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((f) => (
                  <tr key={f.id} className={`border-b border-border/30 hover:bg-primary/5 transition-colors ${!f.is_read ? "bg-primary/5" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground text-sm">{f.email}</span>
                        {!f.is_read && <span className="px-2 py-0.5 bg-primary/15 text-primary text-xs rounded-full">New</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-muted-foreground text-sm line-clamp-2 max-w-md">{f.message}</p>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">
                      {new Date(f.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!f.is_read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(f.id)} className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10" title="Mark as read">
                            <Check className="w-4 h-4 text-primary" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => deleteFeedback(f.id)} className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredFeedback.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">No feedback found</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}