import { Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { usePrompts } from "@/hooks/usePrompts";

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
      <section className="hero-gradient pt-20 md:pt-28 pb-12 md:pb-20 relative overflow-hidden">
        {/* Floating orbs */}
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        
        <div className="container text-center relative z-10 perspective-container">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 glass-card !rounded-full px-4 py-2 mb-6 animate-fade-up glow-border">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Discover AI Prompts</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 animate-fade-up stagger-1 leading-tight">
            Create with
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer"> Amazing Prompts</span>
          </h1>
          <p
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10 animate-fade-up stagger-2 leading-relaxed px-4"
          >
            Browse, copy, and use curated prompts for your creative projects.
            Share your own with the community.
          </p>

          {/* Search Bar */}
          <div
            className="max-w-xl mx-auto relative animate-fade-up stagger-3 px-4"
          >
            <Search className="absolute left-7 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 md:pl-14 pr-4 py-4 text-base"
            />
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
