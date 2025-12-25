import { Sparkles, Search, Grid3X3, LayoutGrid, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { PromptCard } from "@/components/PromptCard";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { usePrompts } from "@/hooks/usePrompts";
import { Footer } from "@/components/Footer";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "By Title" },
  { value: "author", label: "By Author" },
];

const Prompts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [gridSize, setGridSize] = useState<"normal" | "compact">("normal");
  const [isSortOpen, setIsSortOpen] = useState(false);
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

  // Sort prompts
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "author":
        return a.author.localeCompare(b.author);
      default: // newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Newest First";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSearch={false} />

      <main className="flex-1">
        {/* Hero Banner */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative py-10 md:py-14 overflow-hidden"
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
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                All Prompts
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                Explore our complete collection of AI prompts
              </p>
            </motion.div>

            {/* Search and Filter Bar - Clean iOS Style */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="backdrop-blur-2xl bg-card/50 border border-border/30 rounded-[28px] p-5 shadow-xl shadow-black/5">
                {/* Search Input */}
                <div className="relative mb-4">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-14 pr-5 bg-background/60 border border-border/40 rounded-2xl text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
                  />
                </div>

                {/* Filter Row */}
                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="relative flex-1">
                    <motion.button
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-12 px-5 bg-background/60 border border-border/40 rounded-2xl flex items-center justify-between text-foreground hover:bg-background/80 transition-colors duration-200"
                    >
                      <span className="text-sm font-medium">{currentSortLabel}</span>
                      <motion.div
                        animate={{ rotate: isSortOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isSortOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsSortOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-2 z-50 backdrop-blur-2xl bg-card/95 border border-border/40 rounded-2xl shadow-xl shadow-black/10 overflow-hidden"
                          >
                            {sortOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setIsSortOpen(false);
                                }}
                                className={`w-full px-5 py-3.5 text-left text-sm font-medium transition-colors duration-150 ${
                                  sortBy === option.value
                                    ? "bg-primary/15 text-primary"
                                    : "text-foreground hover:bg-muted/50"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Grid Toggle */}
                  <div className="flex bg-background/60 border border-border/40 rounded-2xl p-1.5">
                    <motion.button
                      onClick={() => setGridSize("normal")}
                      whileTap={{ scale: 0.9 }}
                      className={`relative h-9 w-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                        gridSize === "normal" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {gridSize === "normal" && (
                        <motion.div
                          layoutId="gridToggle"
                          className="absolute inset-0 bg-primary/15 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <LayoutGrid className="w-4.5 h-4.5 relative z-10" />
                    </motion.button>
                    <motion.button
                      onClick={() => setGridSize("compact")}
                      whileTap={{ scale: 0.9 }}
                      className={`relative h-9 w-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                        gridSize === "compact" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {gridSize === "compact" && (
                        <motion.div
                          layoutId="gridToggle"
                          className="absolute inset-0 bg-primary/15 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <Grid3X3 className="w-4.5 h-4.5 relative z-10" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Prompts Grid Section */}
        <section className="py-6 md:py-8">
          <div className="container px-4">
            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between mb-6 px-1"
            >
              <span className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{sortedPrompts.length}</span> prompt{sortedPrompts.length !== 1 ? "s" : ""}
              </span>
            </motion.div>

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
                transition={{ delay: 0.4 }}
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
