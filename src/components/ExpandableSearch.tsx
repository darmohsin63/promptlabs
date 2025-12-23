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
            initial={{ width: 36, opacity: 0.8 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 36, opacity: 0.8 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative flex items-center"
          >
            <SearchIcon className="absolute left-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-9 pl-9 pr-8 rounded-xl bg-muted/60 border-0 text-foreground text-sm placeholder:text-muted-foreground/60 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:bg-muted"
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
                className="absolute right-2 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="Open search"
          >
            <SearchIcon className="w-[18px] h-[18px]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
