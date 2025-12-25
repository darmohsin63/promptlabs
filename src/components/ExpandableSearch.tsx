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
      {/* Collapsed: Tom cat with magnifying glass */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.6 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={() => setIsExpanded(true)}
            className="relative w-10 h-10 flex items-center justify-center cursor-pointer group"
            aria-label="Open search"
          >
            <svg width="36" height="36" viewBox="0 0 50 50" fill="none">
              {/* Tom's body - grey blue */}
              <motion.ellipse
                cx="18"
                cy="34"
                rx="8"
                ry="10"
                fill="#6B7B8C"
                animate={{ scaleY: [1, 0.96, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* White belly */}
              <ellipse cx="18" cy="36" rx="5" ry="6" fill="#E8E8E8" />
              
              {/* Tom's head */}
              <motion.g
                animate={{ y: [0, -1.5, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "18px 20px" }}
              >
                {/* Head base */}
                <ellipse cx="18" cy="18" rx="10" ry="9" fill="#6B7B8C" />
                
                {/* Face/muzzle */}
                <ellipse cx="18" cy="21" rx="6" ry="5" fill="#E8E8E8" />
                
                {/* Left ear */}
                <path d="M8 12 L10 6 L14 11 Z" fill="#6B7B8C" />
                <path d="M9 11 L10.5 7 L13 10.5 Z" fill="#FFB6C1" />
                
                {/* Right ear */}
                <path d="M28 12 L26 6 L22 11 Z" fill="#6B7B8C" />
                <path d="M27 11 L25.5 7 L23 10.5 Z" fill="#FFB6C1" />
                
                {/* Eyes */}
                <ellipse cx="14" cy="16" rx="2.5" ry="3" fill="#FFFEF0" />
                <ellipse cx="22" cy="16" rx="2.5" ry="3" fill="#FFFEF0" />
                <motion.circle 
                  cx="14" cy="16.5" r="1.5" fill="#2D2D2D"
                  animate={{ x: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle 
                  cx="22" cy="16.5" r="1.5" fill="#2D2D2D"
                  animate={{ x: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <circle cx="14.5" cy="15.5" r="0.5" fill="white" />
                <circle cx="22.5" cy="15.5" r="0.5" fill="white" />
                
                {/* Nose */}
                <ellipse cx="18" cy="21" rx="2" ry="1.5" fill="#3D3D3D" />
                
                {/* Whiskers */}
                <g stroke="#4A4A4A" strokeWidth="0.5">
                  <line x1="8" y1="19" x2="12" y2="20" />
                  <line x1="7" y1="22" x2="12" y2="22" />
                  <line x1="24" y1="20" x2="28" y2="19" />
                  <line x1="24" y1="22" x2="29" y2="22" />
                </g>
                
                {/* Mouth */}
                <path d="M16 24 Q18 26 20 24" stroke="#3D3D3D" strokeWidth="0.8" fill="none" />
              </motion.g>
              
              {/* Arm holding magnifying glass */}
              <motion.g
                animate={{ rotate: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "24px 28px" }}
              >
                {/* Arm */}
                <path d="M24 28 Q30 22 34 16" stroke="#6B7B8C" strokeWidth="4" strokeLinecap="round" fill="none" />
                
                {/* Paw */}
                <circle cx="34" cy="15" r="3" fill="#E8E8E8" />
                
                {/* Magnifying glass handle */}
                <rect x="36" y="8" width="3" height="10" rx="1" fill="#8B4513" transform="rotate(35 37 13)" />
                
                {/* Magnifying glass lens */}
                <motion.circle
                  cx="42"
                  cy="6"
                  r="6"
                  stroke="#C4A000"
                  strokeWidth="2.5"
                  fill="#E6F3FF"
                  fillOpacity="0.4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <path d="M39 4 Q40 3 41 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              </motion.g>
              
              {/* Legs with walking idle */}
              <motion.g
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "14px 42px" }}
              >
                <path d="M14 42 L12 48" stroke="#6B7B8C" strokeWidth="4" strokeLinecap="round" />
                <ellipse cx="11" cy="48" rx="3" ry="1.5" fill="#6B7B8C" />
              </motion.g>
              <motion.g
                animate={{ rotate: [0, -2, 0, 2, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "22px 42px" }}
              >
                <path d="M22 42 L24 48" stroke="#6B7B8C" strokeWidth="4" strokeLinecap="round" />
                <ellipse cx="25" cy="48" rx="3" ry="1.5" fill="#6B7B8C" />
              </motion.g>
              
              {/* Tail */}
              <motion.path
                d="M10 38 Q4 36 6 30 Q8 26 5 24"
                stroke="#6B7B8C"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                animate={{ d: ["M10 38 Q4 36 6 30 Q8 26 5 24", "M10 38 Q3 34 5 28 Q7 24 4 22", "M10 38 Q4 36 6 30 Q8 26 5 24"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
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
