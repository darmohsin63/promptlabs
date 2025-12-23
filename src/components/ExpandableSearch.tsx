import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleClose = () => {
    setIsExpanded(false);
    onChange("");
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            initial={{ width: 32, opacity: 0.8 }}
            animate={{ width: 160, opacity: 1 }}
            exit={{ width: 32, opacity: 0.8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative flex items-center"
          >
            <SearchIcon className="absolute left-2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-8 pl-7 pr-6 rounded-lg bg-muted/50 border-0 text-foreground text-xs placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:bg-muted"
              onBlur={() => {
                if (!value) {
                  setIsExpanded(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  handleClose();
                }
              }}
            />
            {value && (
              <button
                onClick={handleClose}
                className="absolute right-1.5 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="Open search"
          >
            <SearchIcon className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
