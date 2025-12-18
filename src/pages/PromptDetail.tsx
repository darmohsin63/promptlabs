import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Copy, ExternalLink, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { usePrompts, Prompt } from "@/hooks/usePrompts";
import { toast } from "@/hooks/use-toast";

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPromptById } = usePrompts();
  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
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

      <main className="container py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden mb-8 animate-scale-in">
            <img
              src={prompt.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"}
              alt={prompt.title}
              className="w-full aspect-video object-cover"
            />
          </div>

          {/* Content */}
          <div className="animate-fade-up">
            {/* Title & Meta */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {prompt.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {prompt.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(prompt.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              {prompt.description}
            </p>

            {/* Prompt Box */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Prompt
                </h2>
              </div>
              <div className="prompt-box">
                <p className="text-foreground whitespace-pre-wrap">{prompt.content}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button onClick={handleCopy} className="btn-primary flex items-center gap-2">
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
              <button onClick={handleTry} className="btn-secondary flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Try This Prompt
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PromptDetail;
