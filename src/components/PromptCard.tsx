import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { Prompt } from "@/hooks/usePrompts";

interface PromptCardProps {
  prompt: Prompt;
  index: number;
}

const getOptimizedImageUrl = (url: string, width: number) => {
  if (!url) return "";
  // For Supabase storage images, add width parameter for optimization
  if (url.includes("supabase.co/storage")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}width=${width}&quality=75`;
  }
  return url;
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60";

export function PromptCard({ prompt, index }: PromptCardProps) {
  const imageUrl = prompt.image_url || DEFAULT_IMAGE;
  
  // Generate srcset for responsive images
  const srcSet = prompt.image_url 
    ? `${getOptimizedImageUrl(imageUrl, 400)} 400w, ${getOptimizedImageUrl(imageUrl, 600)} 600w, ${getOptimizedImageUrl(imageUrl, 800)} 800w`
    : undefined;

  return (
    <Link
      to={`/prompt/${prompt.id}`}
      className="prompt-card group block animate-fade-up glow-border opacity-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="overflow-hidden relative bg-secondary/30 aspect-[4/5]">
        <img
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
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {prompt.description || prompt.title}
        </p>
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
