import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { usePrompts } from "@/hooks/usePrompts";
import { useFeaturedPrompts } from "@/hooks/useFeaturedPrompts";
import { HeroSection } from "@/components/HeroSection";
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
        <section className="py-6 md:py-8">
          <div className="container px-4">
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