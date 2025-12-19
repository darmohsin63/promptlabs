import { Sparkles, Search } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { usePrompts } from "@/hooks/usePrompts";
import { useFeaturedPrompts } from "@/hooks/useFeaturedPrompts";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
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

  const hasFeaturedContent = promptOfDay.length > 0 || trending.length > 0 || creatorsChoice.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {/* Featured Carousel Section */}
        {!featuredLoading && hasFeaturedContent && (
          <section className="py-4 md:py-6">
            <div className="container px-4">
              <FeaturedCarousel
                promptOfDay={promptOfDay}
                trending={trending}
                creatorsChoice={creatorsChoice}
              />
            </div>
          </section>
        )}

        {/* Search & Title Section */}
        <section className="py-8 md:py-12">
          <div className="container px-4">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Discover Amazing <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Prompts</span>
              </h1>
              <p className="text-muted-foreground mb-6">
                Browse, copy, and use curated prompts for your creative projects.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl pl-12 pr-4 py-3 bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:border-primary/50 focus:bg-secondary/80"
                />
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 md:mb-8 px-1">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {searchQuery ? "Search Results" : "Latest Prompts"}
              </h2>
              <span className="text-sm text-muted-foreground bg-secondary/50 rounded-full px-3 py-1">
                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Prompts Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <PromptCardSkeleton count={6} />
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
      </main>

      <Footer />
    </div>
  );
};

export default Index;