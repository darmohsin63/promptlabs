import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { usePrompts } from "@/hooks/usePrompts";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ExpandableSearch({ value, onChange, placeholder = "Search prompts..." }: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { prompts } = usePrompts();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        if (!value) setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

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

  const handleClose = () => {
    setIsExpanded(false);
    setShowSuggestions(false);
    onChange("");
  };

  return (
    <div ref={containerRef} className="relative flex items-center h-8">
      {/* Collapsed: Magnifying glass icon */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setIsExpanded(true)}
            className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
            aria-label="Open search"
          >
            {/* Lens circle */}
            <motion.div
              className="absolute w-[18px] h-[18px] rounded-full border-[1.5px] border-current text-muted-foreground"
              style={{ top: "6px", left: "5px" }}
            />
            {/* Handle */}
            <motion.div
              className="absolute w-[1.5px] h-[7px] bg-current text-muted-foreground rounded-full"
              style={{ 
                top: "18px", 
                left: "20px",
                transformOrigin: "top center",
                transform: "rotate(-45deg)"
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded: Search bar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="relative flex items-center"
            initial={{ width: 28 }}
            animate={{ width: 220 }}
            exit={{ width: 28 }}
            transition={{ 
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Animated lens that morphs into input background */}
            <motion.div
              className="absolute inset-0 bg-muted/60 border border-border/60"
              initial={{ 
                borderRadius: "50%",
                width: 28,
                height: 28
              }}
              animate={{ 
                borderRadius: "9999px",
                width: "100%",
                height: 32
              }}
              exit={{ 
                borderRadius: "50%",
                width: 28,
                height: 28
              }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1]
              }}
            />

            {/* Animated handle becoming caret */}
            <motion.div
              className="absolute bg-primary rounded-full pointer-events-none"
              initial={{ 
                width: 1.5,
                height: 7,
                left: 20,
                top: 12,
                rotate: -45,
                opacity: 1
              }}
              animate={{ 
                width: 1.5,
                height: 14,
                left: 10,
                top: 9,
                rotate: 0,
                opacity: [1, 1, 0]
              }}
              exit={{ 
                width: 1.5,
                height: 7,
                left: 20,
                top: 12,
                rotate: -45,
                opacity: 1
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.6, times: [0, 0.7, 1] }
              }}
            />

            {/* Search input */}
            <motion.input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              onFocus={() => value && setShowSuggestions(true)}
              placeholder={placeholder}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              className="relative w-full h-8 pl-4 pr-8 bg-transparent text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none z-10"
              onKeyDown={(e) => {
                if (e.key === "Escape") handleClose();
                else if (e.key === "Enter") handleSearch();
              }}
            />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.35, duration: 0.15 }}
              onClick={handleClose}
              className="absolute right-2 z-10 p-1 rounded-full hover:bg-foreground/10 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted-foreground">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Suggestions */}
      <AnimatePresence>
        {isExpanded && showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[220px]"
          >
            {suggestions.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/prompt/${prompt.id}`}
                  onClick={handleSuggestionClick}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-b-0"
                >
                  {prompt.image_url && (
                    <img src={prompt.image_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{prompt.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">by {prompt.author}</p>
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
