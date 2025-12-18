import { Search, Instagram, Facebook } from "lucide-react";

const FACEBOOK_URL = "https://facebook.com/darmohasin13";
const INSTAGRAM_URL = "https://instagram.com/darmohsin63";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  promptCount: number;
}

export function HeroSection({ searchQuery, setSearchQuery, promptCount }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,25%,10%)] via-[hsl(170,30%,12%)] to-[hsl(160,25%,8%)]" />
      
      {/* Subtle ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10 text-center px-6 py-16">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 md:mb-8 leading-tight tracking-tight">
          <span className="block">Create with</span>
          <span className="bg-gradient-to-r from-primary via-teal-400 to-accent bg-clip-text text-transparent">
            Amazing Prompts
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
          Browse, copy, and use curated prompts for your creative projects.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-sm opacity-50" />
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl pl-14 pr-6 py-4 text-base bg-background/60 backdrop-blur-sm border border-border/50 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:border-primary/50 focus:bg-background/80"
            />
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30 hover:border-primary/50 hover:bg-background/50 transition-all duration-300"
            aria-label="Follow on Instagram"
          >
            <Instagram className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30 hover:border-primary/50 hover:bg-background/50 transition-all duration-300"
            aria-label="Follow on Facebook"
          >
            <Facebook className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <span>{promptCount}+ Prompts</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span>Free to Use</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <span>Updated Daily</span>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}