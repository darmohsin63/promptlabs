import { Skeleton } from "@/components/ui/skeleton";

interface PromptCardSkeletonProps {
  count?: number;
}

export function PromptCardSkeleton({ count = 6 }: PromptCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="prompt-card overflow-hidden animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Image skeleton with shimmer */}
          <div className="relative aspect-[4/5] bg-gradient-to-br from-muted via-muted/70 to-muted overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {/* Robot head silhouette */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg width="80" height="80" viewBox="0 0 80 80" className="text-muted-foreground">
                <circle cx="40" cy="30" r="20" fill="currentColor" />
                <rect x="25" y="50" width="30" height="25" rx="5" fill="currentColor" />
                <circle cx="32" cy="28" r="4" fill="hsl(var(--background))" />
                <circle cx="48" cy="28" r="4" fill="hsl(var(--background))" />
                <rect x="35" y="10" width="10" height="8" rx="2" fill="currentColor" />
              </svg>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="p-4 md:p-5 space-y-3">
            <Skeleton className="h-5 w-3/4 bg-muted" />
            <Skeleton className="h-4 w-full bg-muted/70" />
            <Skeleton className="h-4 w-2/3 bg-muted/50" />
            
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-20 rounded-full bg-muted/60" />
              <Skeleton className="h-4 w-16 bg-muted/40" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
