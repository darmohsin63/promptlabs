import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { Prompt } from "@/types/prompt";

interface PromptCardProps {
  prompt: Prompt;
  index: number;
}

export function PromptCard({ prompt, index }: PromptCardProps) {
  return (
    <Link
      to={`/prompt/${prompt.id}`}
      className="prompt-card group block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={prompt.imageUrl}
          alt={prompt.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {prompt.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {prompt.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {prompt.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(prompt.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
