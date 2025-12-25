import { X } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { usePrompts } from "@/hooks/usePrompts";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Modern minimal search icon
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function ExpandableSearch({ value, onChange, placeholder = "Search prompts..." }: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
      .slice(0, 5); // Limit to 5 suggestions
  }, [value, prompts]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if (!value) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const handleClose = () => {
    setIsExpanded(false);
    setShowSuggestions(false);
    onChange("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearch = () => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      setShowSuggestions(false);
      setIsExpanded(false);
      onChange("");
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setIsExpanded(false);
    onChange("");
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            initial={{ width: 32, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 32, opacity: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8
            }}
            className="relative flex items-center"
          >
            <SearchIcon className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none z-10" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              onFocus={() => value && setShowSuggestions(true)}
              placeholder={placeholder}
              className="w-full h-8 pl-8 pr-7 rounded-lg bg-muted/60 border border-border/50 text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 focus:bg-background transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  handleClose();
                } else if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={handleClose}
              className="absolute right-1.5 p-1 rounded-full hover:bg-foreground/10 transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open search"
          >
            <SearchIcon className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {isExpanded && showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
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
