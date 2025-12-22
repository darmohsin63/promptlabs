import { useState } from "react";

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  showWatermark?: boolean;
}

export function ProtectedImage({
  src,
  alt,
  className,
  srcSet,
  sizes,
  width,
  height,
  loading,
  decoding,
  fetchPriority,
  showWatermark = true,
}: ProtectedImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="relative select-none overflow-hidden">
      <img
        src={imageError ? "/placeholder.svg" : src}
        srcSet={imageError ? undefined : srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={className}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onError={() => setImageError(true)}
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
      
      {/* Watermark overlay */}
      {showWatermark && (
        <div 
          className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
          style={{ 
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        >
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-8 -rotate-12 scale-150 opacity-[0.08]">
            {Array.from({ length: 20 }).map((_, i) => (
              <span 
                key={i} 
                className="text-foreground font-bold text-lg md:text-2xl whitespace-nowrap tracking-widest"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                prompthub
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Invisible overlay to prevent direct interaction */}
      <div 
        className="absolute inset-0 z-[2]" 
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{ 
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}
