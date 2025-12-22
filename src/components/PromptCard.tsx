import { Link } from "react-router-dom";
import { Calendar, User, Bookmark, Clock, Tag } from "lucide-react";
import { Prompt } from "@/hooks/usePrompts";
import { useSavedPrompts } from "@/hooks/useSavedPrompts";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ProtectedImage } from "@/components/ProtectedImage";
interface PromptCardProps {
  prompt: Prompt & { is_approved?: boolean };
  index: number;
  showStatus?: boolean;
}

const getOptimizedImageUrl = (url: string, width: number) => {
  if (!url) return "";
  if (url.includes("supabase.co/storage")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}width=${width}&quality=75`;
  }
  return url;
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60";

export function PromptCard({ prompt, index, showStatus }: PromptCardProps) {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedPrompts();
  const { toast } = useToast();
  
  const imageUrl = prompt.image_url || DEFAULT_IMAGE;
  const saved = isSaved(prompt.id);
  
  const srcSet = prompt.image_url 
    ? `${getOptimizedImageUrl(imageUrl, 400)} 400w, ${getOptimizedImageUrl(imageUrl, 600)} 600w, ${getOptimizedImageUrl(imageUrl, 800)} 800w`
    : undefined;

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save prompts",
        variant: "destructive",
      });
      return;
    }

    const { error } = await toggleSave(prompt.id);
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

  const isPending = prompt.is_approved === false;

  return (
    <Link
      to={`/prompt/${prompt.id}`}
      className="prompt-card group block animate-fade-up glow-border opacity-0 relative"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Save button */}
      <button
        onClick={handleSaveClick}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
          saved 
            ? "bg-primary text-primary-foreground" 
            : "bg-background/60 text-foreground hover:bg-background/80"
        }`}
      >
        <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
      </button>

      {/* Status badges */}
      {showStatus && isPending && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-xs font-medium backdrop-blur-sm">
          <Clock className="w-3 h-3" />
          Pending
        </div>
      )}

      <div className="overflow-hidden relative bg-secondary/30 aspect-[4/5]">
        <ProtectedImage
          src={getOptimizedImageUrl(imageUrl, 600)}
          srcSet={srcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          alt={prompt.title}
          width={400}
          height={500}
          loading={index < 2 ? "eager" : "lazy"}
          decoding={index < 2 ? "sync" : "async"}
          fetchPriority={index === 0 ? "high" : undefined}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-4 md:p-5">
        <h3 className="font-semibold text-base md:text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {prompt.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed">
          {prompt.description || prompt.title}
        </p>
        {/* Categories */}
        {prompt.category && prompt.category.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {prompt.category.slice(0, 2).map((cat, index) => (
              <span 
                key={index} 
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground"
              >
                <Tag className="w-2.5 h-2.5" />
                {cat}
              </span>
            ))}
            {prompt.category.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{prompt.category.length - 2}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full transition-colors group-hover:bg-primary/10 group-hover:text-primary">
            <User className="w-3 h-3" />
            {prompt.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {new Date(prompt.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
