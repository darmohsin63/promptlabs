import { Search } from "lucide-react";
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
      <section className="hero-gradient py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-up">
            Discover Amazing
            <span className="text-primary"> AI Prompts</span>
          </h1>
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            Browse, copy, and use curated prompts for your creative projects.
            Share your own with the community.
          </p>

          {/* Search Bar */}
          <div
            className="max-w-xl mx-auto relative animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 pr-4 py-4 text-base"
            />
          </div>
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {searchQuery ? "Search Results" : "Latest Prompts"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Loading prompts...</p>
            </div>
          ) : filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt, index) => (
                <PromptCard key={prompt.id} prompt={prompt} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
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
