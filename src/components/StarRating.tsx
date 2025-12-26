import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  maxStars: number;
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  totalRatings?: number;
}

export function StarRating({
  maxStars,
  rating,
  onRate,
  readonly = false,
  size = "md",
  showValue = false,
  totalRatings,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const gapClasses = {
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1.5",
  };

  const handleClick = (starIndex: number) => {
    if (!readonly && onRate) {
      onRate(starIndex);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className={cn("flex items-center", gapClasses[size])}>
        {Array.from({ length: maxStars }, (_, i) => {
          const starIndex = i + 1;
          const isFilled = starIndex <= displayRating;
          const isHalf = !isFilled && starIndex - 0.5 <= displayRating;

          return (
            <button
              key={i}
              type="button"
              disabled={readonly}
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() => !readonly && setHoverRating(starIndex)}
              onMouseLeave={() => !readonly && setHoverRating(0)}
              className={cn(
                "transition-all duration-150",
                readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
                !readonly && "active:scale-95"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors duration-150",
                  isFilled || isHalf
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-muted-foreground/40"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground">
          {rating > 0 ? rating.toFixed(1) : "0"}/{maxStars}
          {totalRatings !== undefined && (
            <span className="ml-1">({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})</span>
          )}
        </span>
      )}
    </div>
  );
}
