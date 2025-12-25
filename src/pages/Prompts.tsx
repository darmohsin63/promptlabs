import { Sparkles, Grid3X3, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { usePrompts } from "@/hooks/usePrompts";
import { Footer } from "@/components/Footer";

const Prompts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [gridSize, setGridSize] = useState<"normal" | "compact">("normal");
  const { prompts, loading } = usePrompts();

  // Filter prompts - only show non-scheduled or past-scheduled prompts
  const filteredPrompts = prompts.filter((prompt) => {
    const scheduledAt = (prompt as unknown as { scheduled_at?: string }).scheduled_at;
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      return false;
    }

    return (
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prompt.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort by newest
  const sortedPrompts = [...filteredPrompts].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={true}
      />

      <main className="flex-1 pt-16 md:pt-20">
        {/* Hero Banner */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative py-6 md:py-10 overflow-hidden"
        >
          {/* Soft gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent" />
          <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] opacity-60" />
          <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] opacity-50" />
          
          <div className="container px-4 relative z-10">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1">
                  All Prompts
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Explore our complete collection
                </p>
              </div>

              {/* Grid Toggle - iOS Style like Theme Toggle */}
              <div className="flex gap-1">
                <motion.button
                  onClick={() => setGridSize("normal")}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    gridSize === "normal" 
                      ? "bg-primary/15 text-primary" 
                      : "bg-foreground/[0.06] hover:bg-foreground/[0.1] text-foreground/80"
                  }`}
                  aria-label="Normal grid view"
                >
                  <motion.div
                    initial={false}
                    animate={{ scale: gridSize === "normal" ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </motion.div>
                </motion.button>
                <motion.button
                  onClick={() => setGridSize("compact")}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    gridSize === "compact" 
                      ? "bg-primary/15 text-primary" 
                      : "bg-foreground/[0.06] hover:bg-foreground/[0.1] text-foreground/80"
                  }`}
                  aria-label="Compact grid view"
                >
                  <motion.div
                    initial={false}
                    animate={{ scale: gridSize === "compact" ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Prompts Grid Section */}
        <section className="py-4 md:py-6">
          <div className="container px-4">
            {/* Prompts Grid */}
            {loading ? (
              <div className={`grid gap-4 md:gap-6 ${
                gridSize === "compact" 
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}>
                <PromptCardSkeleton count={12} />
              </div>
            ) : sortedPrompts.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`grid gap-4 md:gap-6 ${
                  gridSize === "compact" 
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" 
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {sortedPrompts.map((prompt, index) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
                  >
                    <PromptCard prompt={prompt} index={index} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 backdrop-blur-xl bg-card/40 border border-border/30 rounded-3xl"
              >
                <Sparkles className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No prompts found. Try a different search term.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Prompts;
