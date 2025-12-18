import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { usePrompts } from "@/hooks/usePrompts";
import { HeroSection } from "@/components/HeroSection";

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

      {/* Hero Section - Premium Minimalist */}
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        promptCount={prompts.length}
      />

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