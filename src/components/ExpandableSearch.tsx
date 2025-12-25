import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { usePrompts } from "@/hooks/usePrompts";
import "./ExpandableSearch.css";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ExpandableSearch({ value, onChange, placeholder = "Search prompts..." }: ExpandableSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { prompts } = usePrompts();
  const navigate = useNavigate();

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!value.trim() || value.length < 1) return [];
    const query = value.toLowerCase();
    return prompts
      .filter(prompt => 
        prompt.title.toLowerCase().includes(query) ||
        (prompt.description || "").toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [value, prompts]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearch = () => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      setShowSuggestions(false);
      onChange("");
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    onChange("");
  };

  return (
    <div ref={containerRef} className="relative flex items-center search-container">
      <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <label htmlFor="search" className="search-label">Search</label>
        <input
          ref={inputRef}
          required
          pattern=".*\S.*"
          type="search"
          className="search-input"
          id="search"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value && setShowSuggestions(true)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onChange("");
              inputRef.current?.blur();
              setShowSuggestions(false);
            } else if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <span className="search-caret"></span>
      </form>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[200px]"
          >
            {suggestions.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  to={`/prompt/${prompt.id}`}
                  onClick={handleSuggestionClick}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                >
                  {prompt.image_url && (
                    <img
                      src={prompt.image_url}
                      alt=""
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {prompt.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      by {prompt.author}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
