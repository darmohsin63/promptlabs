import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Copy, Check, Pencil, Tag, Bookmark, Sparkles, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { usePrompts, Prompt } from "@/hooks/usePrompts";
import { useAuth } from "@/hooks/useAuth";
import { useSavedPrompts } from "@/hooks/useSavedPrompts";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ProtectedImage } from "@/components/ProtectedImage";
import { CodeStyledPrompt } from "@/components/CodeStyledPrompt";
import { StarRating } from "@/components/StarRating";
import { useRatings, useMaxStars } from "@/hooks/useRatings";

const PromptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPromptById } = usePrompts();
  const { isAdmin, user } = useAuth();
  const { isSaved, toggleSave } = useSavedPrompts();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const { stats, ratePrompt } = useRatings(id);
  const { maxStars } = useMaxStars();

  const saved = id ? isSaved(id) : false;

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
      
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
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

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    const { error } = await toggleSave(id);
    setSaving(false);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: saved ? "Removed from saved" : "Saved!",
        description: saved ? "Prompt removed from your collection" : "Prompt added to your collection",
      });
    }
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
            <ProtectedImage
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
              {prompt.category && prompt.category.length > 0 && prompt.category.map((cat, index) => (
                <span key={index} className="flex items-center gap-1.5 glass-card !rounded-full px-3 py-1.5 !bg-accent/20 text-accent-foreground">
                  <Tag className="w-3.5 h-3.5" />
                  {cat}
                </span>
              ))}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(prompt.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {prompt.is_approved && prompt.approver_name && (
                <span className="flex items-center gap-1.5 glass-card !rounded-full px-3 py-1.5 !bg-green-500/20 text-green-600 dark:text-green-400">
                  <Check className="w-3.5 h-3.5" />
                  Approved by {prompt.approver_name}
                </span>
              )}

              {/* Rating Section */}
              <div className="glass-card !rounded-full px-4 py-2 flex items-center gap-2">
                <StarRating
                  maxStars={maxStars}
                  rating={stats.averageRating}
                  readonly
                  size="sm"
                  showValue
                  totalRatings={stats.totalRatings}
                />
              </div>
            </div>

            {prompt.description && (
              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
                {prompt.description}
              </p>
            )}

            {/* AI Model Disclaimer */}
            <div className="mb-8 animate-fade-up stagger-2">
              <div className="relative overflow-hidden rounded-xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 p-4 md:p-5">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/10 to-amber-500/5 animate-pulse" />
                
                {/* Content */}
                <div className="relative flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                        Important Disclaimer
                      </span>
                    </div>
                    <p className="text-sm md:text-base font-medium text-foreground leading-relaxed">
                      This prompt has been <span className="font-bold text-amber-600 dark:text-amber-400">exclusively handcrafted</span> for the{" "}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 font-bold text-amber-700 dark:text-amber-300">
                        Google Nano Banana Pro
                      </span>{" "}
                      edition. We <span className="font-semibold underline decoration-amber-500 decoration-2 underline-offset-2">strongly recommend</span> using this model to achieve the intended results.
                    </p>
                  </div>
                </div>
                
                {/* Decorative corner sparkles */}
                <div className="absolute top-1 right-1 opacity-40">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="absolute bottom-1 left-1 opacity-30">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Prompt Box */}
            <div className="mb-8 animate-fade-up stagger-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Prompt
                </h2>
              </div>
              <CodeStyledPrompt content={prompt.content} />
              {!user && (
                <div className="mt-4 p-4 glass-panel text-center">
                  <p className="text-muted-foreground text-sm mb-3">Sign in to copy this prompt</p>
                  <RouterLink 
                    to="/auth" 
                    className="btn-primary inline-flex items-center gap-2 text-sm"
                  >
                    Sign In to Copy
                  </RouterLink>
                </div>
              )}
            </div>

            {/* User Rating Section */}
            {user && (
              <div className="mb-8 animate-fade-up stagger-3">
                <div className="glass-panel">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Rate this prompt</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.userRating 
                          ? `You rated this ${stats.userRating}/${maxStars} stars` 
                          : "Click the stars to rate"}
                      </p>
                    </div>
                    <StarRating
                      maxStars={maxStars}
                      rating={stats.userRating || 0}
                      onRate={async (rating) => {
                        const { error } = await ratePrompt(rating);
                        if (error) {
                          toast({
                            title: "Error",
                            description: "Failed to submit rating",
                            variant: "destructive",
                          });
                        } else {
                          toast({
                            title: "Thanks!",
                            description: `You rated this prompt ${rating}/${maxStars} stars`,
                          });
                        }
                      }}
                      size="lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {user ? (
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-up stagger-4">
                <button 
                  onClick={handleCopy} 
                  className={`btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none transition-all duration-200 ${copied ? 'bg-green-600 hover:bg-green-600' : ''}`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 animate-scale-in" />
                      <span className="animate-fade-in">Copied ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
                      Copy Prompt
                    </>
                  )}
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className={`btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none transition-all duration-200 ${saved ? 'bg-green-600 hover:bg-green-600 text-white border-green-600' : ''}`}
                >
                  {saved ? (
                    <>
                      <Bookmark className="w-4 h-4 fill-current animate-scale-in" />
                      <span className="animate-fade-in">Saved ✓</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
                      {saving ? 'Saving...' : 'Save Prompt'}
                    </>
                  )}
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
