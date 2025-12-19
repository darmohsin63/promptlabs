import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Copy, ExternalLink, Check, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { usePrompts, Prompt } from "@/hooks/usePrompts";
import { useAuth } from "@/hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPromptById } = usePrompts();
  const { isAdmin, user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;
      setLoading(true);
      const { data } = await getPromptById(id);
      setPrompt(data);
      setLoading(false);
    };
    fetchPrompt();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container pt-24 pb-12 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container pt-24 pb-12 px-4 text-center">
          <div className="glass-panel max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-4">Prompt not found</h1>
            <p className="text-muted-foreground mb-8">
              The prompt you're looking for doesn't exist.
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleTry = () => {
    toast({
      title: "Opening AI Tool",
      description: "Redirecting to try this prompt...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container pt-20 pb-12 px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 animate-fade-up"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Image */}
          <div className="glass-card overflow-hidden mb-8 animate-scale-in flex justify-center">
            <img
              src={prompt.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"}
              alt={prompt.title}
              className="max-w-full h-auto max-h-[70vh] object-contain"
            />
          </div>

          {/* Content */}
          <div className="animate-fade-up stagger-1">
            {/* Title & Meta */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {prompt.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5 glass-card !rounded-full px-3 py-1.5 !bg-secondary/50">
                <User className="w-3.5 h-3.5" />
                {prompt.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(prompt.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {prompt.description && (
              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
                {prompt.description}
              </p>
            )}

            {/* Prompt Box */}
            <div className="mb-8 animate-fade-up stagger-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Prompt
                </h2>
              </div>
              {user ? (
                <div className="glass-panel !p-5 md:!p-6">
                  <p className="text-foreground whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {prompt.content}
                  </p>
                </div>
              ) : (
                <div className="glass-panel !p-8 text-center">
                  <p className="text-muted-foreground mb-4">Sign in to view this prompt</p>
                  <RouterLink 
                    to="/auth" 
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Sign In to View
                  </RouterLink>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {user ? (
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-up stagger-3">
                <button onClick={handleCopy} className="btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </>
                  )}
                </button>
                <button onClick={handleTry} className="btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none">
                  <ExternalLink className="w-4 h-4" />
                  Try This Prompt
                </button>
                {isAdmin && (
                  <Link 
                    to={`/upload?edit=${prompt.id}`} 
                    className="btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Prompt
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PromptDetail;
