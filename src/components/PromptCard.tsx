import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { Prompt } from "@/hooks/usePrompts";

interface PromptCardProps {
  prompt: Prompt;
  index: number;
}

export function PromptCard({ prompt, index }: PromptCardProps) {
  return (
    <Link
      to={`/prompt/${prompt.id}`}
      className="prompt-card group block animate-fade-up glow-border"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="overflow-hidden relative">
        <img
          src={prompt.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60"}
          alt={prompt.title}
          className="w-full h-auto max-h-64 object-contain transition-all duration-700 group-hover:scale-105"
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
