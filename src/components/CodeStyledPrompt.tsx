import logo from "@/assets/logo.png";

interface CodeStyledPromptProps {
  content: string;
  className?: string;
}

export function CodeStyledPrompt({ content, className = "" }: CodeStyledPromptProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border shadow-lg ${className}`}>
      {/* Title bar with logo */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/80 dark:bg-[#2D2D2D] border-b border-border">
        <img src={logo} alt="PromptHub" className="w-5 h-5 rounded object-contain" />
        <span className="text-xs text-muted-foreground ml-1 font-mono">darmohsin63.txt</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground/50 font-mono">Prompt</span>
        </div>
      </div>
      
      {/* Content - show ~10-12 lines with vertical scroll */}
      <div 
        className="bg-background dark:bg-[#1E1E1E] p-5 max-h-[20rem] overflow-y-auto overflow-x-hidden select-none"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <p 
          className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words animate-gradient-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text"
          style={{
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            animation: 'gradient-shift 4s ease-in-out infinite',
          }}
        >
          {content}
        </p>
      </div>

      {/* Subtle border glow */}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-border/50" />

      {/* CSS animation keyframes */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        .animate-gradient-text {
          animation: gradient-shift 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
