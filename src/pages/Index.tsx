import { Search, Sparkles, Cpu, Zap, Brain } from "lucide-react";
import { useState, Suspense } from "react";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { usePrompts } from "@/hooks/usePrompts";
import { HeroScene3D } from "@/components/HeroScene3D";

const Index = () => {
  const { prompts, loading } = usePrompts();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prompt.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <Suspense fallback={null}>
          <HeroScene3D />
        </Suspense>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 z-[1]" />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 z-[1] opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
        </div>
        
        <div className="container relative z-10 text-center pt-16">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-3 glass-card !rounded-full px-5 py-2.5 mb-8 animate-fade-up border border-primary/30">
            <div className="relative">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/30 blur-md animate-pulse" />
            </div>
            <span className="text-sm font-semibold text-foreground tracking-wide">AI-Powered Prompt Discovery</span>
            <Zap className="w-4 h-4 text-accent" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 md:mb-8 animate-fade-up stagger-1 leading-tight tracking-tight">
            <span className="block mb-2">Unleash Your</span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                Creative AI
              </span>
              <Cpu className="inline-block w-8 h-8 md:w-12 md:h-12 ml-3 text-primary animate-pulse" />
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 md:mb-12 animate-fade-up stagger-2 leading-relaxed px-4">
            Explore a universe of curated prompts. Craft stunning visuals, 
            generate brilliant code, and unlock infinite possibilities.
          </p>

          {/* Search Bar with glow effect */}
          <div className="max-w-2xl mx-auto relative animate-fade-up stagger-3 px-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-cyan-500/40 to-accent/40 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search the prompt universe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl pl-14 pr-6 py-5 text-base md:text-lg bg-background/80 backdrop-blur-xl border border-primary/20 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_30px_hsl(var(--primary)/0.2)]"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-12 mt-12 animate-fade-up stagger-4">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground">{prompts.length}+</p>
              <p className="text-sm text-muted-foreground">Prompts</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">AI</p>
              <p className="text-sm text-muted-foreground">Powered</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-accent">∞</p>
              <p className="text-sm text-muted-foreground">Possibilities</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-8 md:py-16 relative">
        <div className="container">
          <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {searchQuery ? "Search Results" : "Latest Prompts"}
            </h2>
            <span className="text-sm text-muted-foreground glass-card !rounded-full px-3 py-1">
              {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-muted rounded-lg w-3/4" />
                    <div className="h-4 bg-muted rounded-lg w-full" />
                    <div className="h-4 bg-muted rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredPrompts.map((prompt, index) => (
                <PromptCard key={prompt.id} prompt={prompt} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-panel">
              <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No prompts found. Try a different search term.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
