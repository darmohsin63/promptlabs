import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PromptCard } from "@/components/PromptCard";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { usePrompts } from "@/hooks/usePrompts";
import { motion } from "framer-motion";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { prompts, loading } = usePrompts();

  // Filter prompts based on search query
  const filteredPrompts = prompts.filter((prompt) => {
    if (!query.trim()) return true;
    const searchTerm = query.toLowerCase();
    return (
      prompt.title.toLowerCase().includes(searchTerm) ||
      (prompt.description || "").toLowerCase().includes(searchTerm) ||
      prompt.author.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showSearch={false} />

      <main className="flex-1 pt-20">
        <div className="container px-4">
          {/* Search Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <SearchIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Search Results
                </h1>
                {query && (
                  <p className="text-muted-foreground">
                    Showing results for "{query}"
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between mb-6"
          >
            <span className="text-sm text-muted-foreground bg-secondary/50 rounded-full px-3 py-1">
              {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""} found
            </span>
          </motion.div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <PromptCardSkeleton count={6} />
            </div>
          ) : filteredPrompts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-12"
            >
              {filteredPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <PromptCard prompt={prompt} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center py-16 glass-panel rounded-2xl"
            >
              <SearchIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                No prompts found for "{query}"
              </p>
              <p className="text-sm text-muted-foreground/70">
                Try a different search term or browse all prompts
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse all prompts
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
