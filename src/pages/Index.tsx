import { Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { usePrompts } from "@/hooks/usePrompts";
import { useFeaturedPrompts } from "@/hooks/useFeaturedPrompts";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GridToggle } from "@/components/GridToggle";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [gridSize, setGridSize] = useState<"normal" | "compact">("normal");
  const { prompts, loading } = usePrompts();
  const { promptOfDay, trending, creatorsChoice, loading: featuredLoading } = useFeaturedPrompts();

  // Filter prompts - only show non-scheduled or past-scheduled prompts
  const filteredPrompts = prompts.filter((prompt) => {
    // Check if scheduled for future
    const scheduledAt = (prompt as unknown as { scheduled_at?: string }).scheduled_at;
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      return false; // Hide future scheduled prompts
    }

    return (
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prompt.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Only show latest 6 prompts on home page
  const latestPrompts = filteredPrompts.slice(0, 6);

  const toggleGridSize = () => {
    setGridSize(prev => prev === "normal" ? "compact" : "normal");
  };

  return (
    <div className="relative hero-gradient">
      {/* Unifying tint overlay so hero + body + footer feel like one surface */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-background/35" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          showSearch={true}
        />

        {/* Main Content */}
        <main className="flex-1">
        {/* Hero Section with Prompt Core */}
        <HeroSection
          promptOfDay={promptOfDay}
          trending={trending}
          creatorsChoice={creatorsChoice}
          loading={featuredLoading}
        />

        {/* Prompts Grid Section */}
        <section id="prompts" className="py-6 md:py-8 relative">
          <div className="container px-4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {searchQuery ? "Search Results" : "Latest Prompts"}
              </h2>
              
              {/* Grid Toggle - Single button like Theme Toggle */}
              <GridToggle gridSize={gridSize} onToggle={toggleGridSize} />
            </div>

            {/* Prompts Grid */}
            {loading ? (
              <div className={`grid gap-4 md:gap-6 ${
                gridSize === "compact" 
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}>
                <PromptCardSkeleton count={6} />
              </div>
            ) : latestPrompts.length > 0 ? (
              <div className={`grid gap-4 md:gap-6 ${
                gridSize === "compact" 
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}>
                {latestPrompts.map((prompt, index) => (
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

            {/* View All Button - iOS Glassmorphism Style */}
            {filteredPrompts.length > 6 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex justify-center"
              >
                <Link to="/prompts">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Button */}
                    <Button
                      size="lg"
                      className="relative backdrop-blur-xl bg-card/60 hover:bg-card/80 border border-border/50 text-foreground rounded-2xl px-8 py-6 text-base font-medium shadow-lg transition-all duration-300"
                    >
                      <span>View All Prompts</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;