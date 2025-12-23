import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative flex items-center"
          >
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-10 pl-10 pr-10 rounded-full bg-secondary/80 border border-border/50 text-foreground text-sm placeholder:text-muted-foreground transition-all duration-300 focus:outline-none focus:border-primary/50 focus:bg-secondary"
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
                className="absolute right-3 p-0.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary border border-border/30 transition-all duration-300 hover:scale-105"
            aria-label="Open search"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
