import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="glass-table overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-border/50 p-4 gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton 
            key={`header-${i}`} 
            className="h-4 flex-1 bg-muted/50" 
            style={{ maxWidth: i === 0 ? '200px' : i === columns - 1 ? '100px' : '150px' }}
          />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex}
          className="flex items-center border-b border-border/30 p-4 gap-4 animate-pulse"
          style={{ animationDelay: `${rowIndex * 100}ms` }}
        >
          {/* Avatar + Name column */}
          <div className="flex items-center gap-3 flex-1" style={{ maxWidth: '200px' }}>
            <Skeleton className="w-9 h-9 rounded-full bg-muted/60" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-24 bg-muted/50" />
              <Skeleton className="h-3 w-32 bg-muted/30" />
            </div>
          </div>
          
          {/* Other columns */}
          {Array.from({ length: columns - 2 }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 flex-1 bg-muted/40" 
              style={{ maxWidth: '150px' }}
            />
          ))}
          
          {/* Actions column */}
          <div className="flex gap-2" style={{ width: '100px' }}>
            <Skeleton className="w-8 h-8 rounded-lg bg-muted/30" />
            <Skeleton className="w-8 h-8 rounded-lg bg-muted/30" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-panel flex items-center gap-4 animate-pulse">
      <Skeleton className="w-12 h-12 rounded-2xl bg-muted/50" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-12 bg-muted/60" />
        <Skeleton className="h-4 w-20 bg-muted/40" />
      </div>
    </div>
  );
}
