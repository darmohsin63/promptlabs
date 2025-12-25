import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { usePrompts } from "@/hooks/usePrompts";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Golden Snitch SVG component
const GoldenSnitch = ({ isFlying = false }: { isFlying?: boolean }) => (
  <svg width="40" height="44" viewBox="0 0 80 60" fill="none">
    {/* Left Wing */}
    <motion.g
      animate={isFlying ? { 
        rotate: [-15, 15, -15],
        y: [-2, 2, -2]
      } : { 
        rotate: [-5, 5, -5]
      }}
      transition={{ duration: isFlying ? 0.15 : 0.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "32px 30px" }}
    >
      <path
        d="M30 28 Q20 18 8 16 Q4 20 6 26 Q10 22 18 24 Q12 26 8 32 Q12 34 18 30 Q12 34 10 40 Q16 40 22 34 Q18 38 18 44 Q24 42 28 36 L32 30"
        fill="#F5F5DC"
        stroke="#D4AF37"
        strokeWidth="1"
      />
      <path d="M10 20 L16 24" stroke="#E8DCC8" strokeWidth="0.5" />
      <path d="M10 28 L18 28" stroke="#E8DCC8" strokeWidth="0.5" />
      <path d="M14 36 L22 32" stroke="#E8DCC8" strokeWidth="0.5" />
    </motion.g>

    {/* Right Wing */}
    <motion.g
      animate={isFlying ? { 
        rotate: [15, -15, 15],
        y: [-2, 2, -2]
      } : { 
        rotate: [5, -5, 5]
      }}
      transition={{ duration: isFlying ? 0.15 : 0.8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "48px 30px" }}
    >
      <path
        d="M50 28 Q60 18 72 16 Q76 20 74 26 Q70 22 62 24 Q68 26 72 32 Q68 34 62 30 Q68 34 70 40 Q64 40 58 34 Q62 38 62 44 Q56 42 52 36 L48 30"
        fill="#F5F5DC"
        stroke="#D4AF37"
        strokeWidth="1"
      />
      <path d="M70 20 L64 24" stroke="#E8DCC8" strokeWidth="0.5" />
      <path d="M70 28 L62 28" stroke="#E8DCC8" strokeWidth="0.5" />
      <path d="M66 36 L58 32" stroke="#E8DCC8" strokeWidth="0.5" />
    </motion.g>

    {/* Snitch Body */}
    <motion.g
      animate={isFlying ? { 
        y: [-3, 3, -3],
        rotate: [-5, 5, -5]
      } : { 
        y: [0, -2, 0],
        scale: [1, 1.02, 1]
      }}
      transition={{ duration: isFlying ? 0.2 : 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "40px 30px" }}
    >
      {/* Main golden ball */}
      <circle cx="40" cy="30" r="12" fill="url(#snitchGold)" />
      
      {/* Highlight */}
      <ellipse cx="36" cy="25" rx="4" ry="3" fill="#FFF8DC" opacity="0.6" />
      <circle cx="34" cy="24" r="2" fill="white" opacity="0.8" />
      
      {/* Decorative engravings */}
      <path d="M32 30 Q40 26 48 30" stroke="#B8860B" strokeWidth="0.8" fill="none" />
      <path d="M32 32 Q40 36 48 32" stroke="#B8860B" strokeWidth="0.8" fill="none" />
      <circle cx="40" cy="30" r="8" stroke="#B8860B" strokeWidth="0.5" fill="none" opacity="0.5" />
      
      {/* Center gemstone */}
      <circle cx="40" cy="30" r="2" fill="#8B0000" />
      <circle cx="39" cy="29" r="0.8" fill="#FF6B6B" opacity="0.8" />
    </motion.g>

    {/* Gradient definition */}
    <defs>
      <radialGradient id="snitchGold" cx="35%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#FFE55C" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </radialGradient>
    </defs>
  </svg>
);

// Flying Snitch for inside search bar
const FlyingSnitch = () => (
  <motion.svg 
    width="24" 
    height="24" 
    viewBox="0 0 80 60" 
    fill="none"
    animate={{ x: [0, 160, 0], y: [0, -8, 4, -4, 0] }}
    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
  >
    {/* Simplified flying snitch */}
    <motion.g
      animate={{ rotate: [-10, 10, -10] }}
      transition={{ duration: 0.3, repeat: Infinity }}
      style={{ transformOrigin: "40px 30px" }}
    >
      {/* Left Wing */}
      <motion.path
        d="M30 28 Q20 20 10 20 Q14 28 22 30 Q14 32 10 40 Q20 40 30 32"
        fill="#F5F5DC"
        stroke="#D4AF37"
        strokeWidth="1"
        animate={{ rotate: [-20, 20, -20] }}
        transition={{ duration: 0.1, repeat: Infinity }}
        style={{ transformOrigin: "30px 30px" }}
      />
      
      {/* Right Wing */}
      <motion.path
        d="M50 28 Q60 20 70 20 Q66 28 58 30 Q66 32 70 40 Q60 40 50 32"
        fill="#F5F5DC"
        stroke="#D4AF37"
        strokeWidth="1"
        animate={{ rotate: [20, -20, 20] }}
        transition={{ duration: 0.1, repeat: Infinity }}
        style={{ transformOrigin: "50px 30px" }}
      />
      
      {/* Golden ball */}
      <circle cx="40" cy="30" r="10" fill="#FFD700" />
      <ellipse cx="36" cy="26" rx="3" ry="2" fill="#FFF8DC" opacity="0.6" />
      <circle cx="40" cy="30" r="1.5" fill="#8B0000" />
    </motion.g>
  </motion.svg>
);

export function ExpandableSearch({ value, onChange, placeholder = "Search prompts..." }: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
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
      const timer = setTimeout(() => inputRef.current?.focus(), 600);
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

  const handleExpand = () => {
    setIsJumping(true);
    setTimeout(() => {
      setIsExpanded(true);
      setTimeout(() => setIsJumping(false), 800);
    }, 400);
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

  const handleClose = () => {
    setIsExpanded(false);
    setShowSuggestions(false);
    onChange("");
  };

  return (
    <div ref={containerRef} className="relative flex items-center h-10">
      {/* Collapsed: Golden Snitch */}
      <AnimatePresence>
        {!isExpanded && !isJumping && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={handleExpand}
            className="relative w-12 h-12 flex items-center justify-center cursor-pointer group"
            aria-label="Open search"
          >
            <GoldenSnitch isFlying={false} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Flying Snitch animation */}
      <AnimatePresence>
        {isJumping && !isExpanded && (
          <motion.div
            className="absolute left-0"
            initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
            animate={{ 
              x: [0, 30, 80],
              y: [0, -30, 0],
              scale: [1, 1.1, 0.6],
              rotate: [0, -10, 0]
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.2, 0, 0.2, 1],
              times: [0, 0.5, 1]
            }}
          >
            <GoldenSnitch isFlying={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded: Search bar with flying snitch inside */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="relative flex items-center overflow-hidden"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Search bar background */}
            <motion.div
              className="absolute inset-0 bg-muted/60 border border-border/60 rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Flying Snitch inside search bar */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10 pointer-events-none overflow-hidden w-6 h-6">
              <FlyingSnitch />
            </div>

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
              transition={{ delay: 0.35, duration: 0.2 }}
              className="relative w-full h-9 pl-10 pr-8 bg-transparent text-foreground text-xs placeholder:text-muted-foreground/60 focus:outline-none z-10"
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
              transition={{ delay: 0.4, duration: 0.15 }}
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
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[240px]"
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
