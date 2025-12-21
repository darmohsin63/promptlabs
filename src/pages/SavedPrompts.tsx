import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Bookmark, ArrowLeft } from "lucide-react";
import { PromptCard } from "@/components/PromptCard";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { Prompt } from "@/hooks/usePrompts";

export default function SavedPrompts() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSavedPrompts();
    }
  }, [user]);

  const fetchSavedPrompts = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("saved_prompts")
      .select("prompt_id, prompts(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const prompts = data
        .map(s => s.prompts as unknown as Prompt)
        .filter((p): p is Prompt => p !== null);
      setSavedPrompts(prompts);
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <PromptCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center mb-8 animate-fade-up">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Saved Prompts
            </h1>
            <p className="text-muted-foreground mt-2">
              Your bookmarked prompts collection
            </p>
          </div>

          <div className="animate-fade-up stagger-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <PromptCardSkeleton key={i} />
                ))}
              </div>
            ) : savedPrompts.length === 0 ? (
              <div className="text-center py-16 glass-panel">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No saved prompts yet</h3>
                <p className="text-muted-foreground">
                  Click the bookmark icon on any prompt to save it here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPrompts.map((prompt, index) => (
                  <PromptCard key={prompt.id} prompt={prompt} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
