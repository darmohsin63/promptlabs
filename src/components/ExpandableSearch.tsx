import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { usePrompts } from "@/hooks/usePrompts";

interface ExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Tom cat SVG component with realistic design
const TomCat = ({ isWalking = false }: { isWalking?: boolean }) => (
  <svg width="40" height="44" viewBox="0 0 60 66" fill="none">
    {/* Tail */}
    <motion.path
      d="M8 48 Q2 44 4 36 Q6 28 2 22"
      stroke="#8B9AAB"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      animate={isWalking ? {
        d: ["M8 48 Q2 44 4 36 Q6 28 2 22", "M8 48 Q0 42 2 34 Q4 26 0 20", "M8 48 Q4 46 6 38 Q8 30 4 24", "M8 48 Q2 44 4 36 Q6 28 2 22"]
      } : {
        d: ["M8 48 Q2 44 4 36 Q6 28 2 22", "M8 48 Q3 43 5 35 Q7 27 3 21", "M8 48 Q2 44 4 36 Q6 28 2 22"]
      }}
      transition={{ duration: isWalking ? 0.3 : 2.5, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Back leg */}
    <motion.g
      animate={isWalking ? { rotate: [-15, 25, -15] } : { rotate: [0, 3, 0, -3, 0] }}
      transition={{ duration: isWalking ? 0.3 : 1.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "18px 52px" }}
    >
      <path d="M18 52 L14 62" stroke="#8B9AAB" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="13" cy="63" rx="4" ry="2.5" fill="#8B9AAB" />
      <ellipse cx="11" cy="63" rx="1.5" ry="1" fill="#E8E0D8" />
      <ellipse cx="13" cy="64" rx="1.5" ry="1" fill="#E8E0D8" />
      <ellipse cx="15" cy="63" rx="1.5" ry="1" fill="#E8E0D8" />
    </motion.g>

    {/* Front leg */}
    <motion.g
      animate={isWalking ? { rotate: [25, -15, 25] } : { rotate: [0, -3, 0, 3, 0] }}
      transition={{ duration: isWalking ? 0.3 : 1.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "28px 52px" }}
    >
      <path d="M28 52 L32 62" stroke="#8B9AAB" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="33" cy="63" rx="4" ry="2.5" fill="#8B9AAB" />
      <ellipse cx="31" cy="63" rx="1.5" ry="1" fill="#E8E0D8" />
      <ellipse cx="33" cy="64" rx="1.5" ry="1" fill="#E8E0D8" />
      <ellipse cx="35" cy="63" rx="1.5" ry="1" fill="#E8E0D8" />
    </motion.g>

    {/* Body */}
    <motion.ellipse
      cx="23"
      cy="46"
      rx="12"
      ry="14"
      fill="#8B9AAB"
      animate={isWalking ? { scaleY: [1, 0.95, 1], scaleX: [1, 1.02, 1] } : { scaleY: [1, 0.97, 1] }}
      transition={{ duration: isWalking ? 0.15 : 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* White belly */}
    <ellipse cx="23" cy="50" rx="7" ry="9" fill="#E8E0D8" />
    
    {/* Chest fluff */}
    <ellipse cx="23" cy="38" rx="5" ry="3" fill="#E8E0D8" />

    {/* Arm holding magnifying glass */}
    <motion.g
      animate={isWalking ? { rotate: [5, -5, 5] } : { rotate: [0, 4, 0] }}
      transition={{ duration: isWalking ? 0.3 : 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "30px 38px" }}
    >
      {/* Upper arm */}
      <path d="M30 38 Q38 30 42 22" stroke="#8B9AAB" strokeWidth="5" strokeLinecap="round" fill="none" />
      
      {/* Paw */}
      <circle cx="43" cy="20" r="4" fill="#E8E0D8" />
      <circle cx="40" cy="18" r="1.5" fill="#8B9AAB" />
      <circle cx="43" cy="16" r="1.5" fill="#8B9AAB" />
      <circle cx="46" cy="18" r="1.5" fill="#8B9AAB" />
      
      {/* Magnifying glass handle */}
      <rect x="46" y="10" width="4" height="14" rx="2" fill="#8B5A2B" transform="rotate(40 48 17)" />
      <rect x="47" y="11" width="2" height="12" rx="1" fill="#A0724A" transform="rotate(40 48 17)" />
      
      {/* Magnifying glass lens */}
      <motion.g
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="54" cy="6" r="8" stroke="#D4AF37" strokeWidth="3" fill="none" />
        <circle cx="54" cy="6" r="6" fill="#E6F4FF" fillOpacity="0.5" />
        <path d="M50 3 Q52 1 54 3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </motion.g>
    </motion.g>

    {/* Head */}
    <motion.g
      animate={isWalking ? { y: [-2, 2, -2], rotate: [-2, 2, -2] } : { y: [0, -2, 0], rotate: [0, 1, 0] }}
      transition={{ duration: isWalking ? 0.3 : 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "23px 26px" }}
    >
      {/* Head base */}
      <ellipse cx="23" cy="24" rx="14" ry="12" fill="#8B9AAB" />
      
      {/* Cheek tufts */}
      <ellipse cx="10" cy="26" rx="4" ry="5" fill="#8B9AAB" />
      <ellipse cx="36" cy="26" rx="4" ry="5" fill="#8B9AAB" />
      <path d="M6 24 L8 22 L10 25" fill="#8B9AAB" />
      <path d="M40 24 L38 22 L36 25" fill="#8B9AAB" />
      
      {/* Left ear */}
      <path d="M10 16 L12 4 L18 14 Z" fill="#8B9AAB" />
      <path d="M11 15 L12.5 6 L17 13 Z" fill="#FFB6C1" />
      
      {/* Right ear */}
      <path d="M36 16 L34 4 L28 14 Z" fill="#8B9AAB" />
      <path d="M35 15 L33.5 6 L29 13 Z" fill="#FFB6C1" />
      
      {/* Face/muzzle area */}
      <ellipse cx="23" cy="28" rx="8" ry="6" fill="#E8E0D8" />
      
      {/* Eyes */}
      <ellipse cx="17" cy="22" rx="4" ry="4.5" fill="#FFFEF5" />
      <ellipse cx="29" cy="22" rx="4" ry="4.5" fill="#FFFEF5" />
      
      {/* Eye color - yellow/green like Tom */}
      <ellipse cx="17" cy="22.5" rx="2.5" ry="3" fill="#90B040" />
      <ellipse cx="29" cy="22.5" rx="2.5" ry="3" fill="#90B040" />
      
      {/* Pupils */}
      <motion.ellipse 
        cx="17" cy="23" rx="1.5" ry="2" fill="#1A1A1A"
        animate={{ x: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.ellipse 
        cx="29" cy="23" rx="1.5" ry="2" fill="#1A1A1A"
        animate={{ x: [0, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Eye highlights */}
      <circle cx="16" cy="21" r="1" fill="white" />
      <circle cx="28" cy="21" r="1" fill="white" />
      
      {/* Eyelids */}
      <motion.path
        d="M13 19.5 Q17 18 21 19.5"
        stroke="#8B9AAB"
        strokeWidth="1"
        fill="none"
        animate={{ d: ["M13 19.5 Q17 18 21 19.5", "M13 20 Q17 18.5 21 20", "M13 19.5 Q17 18 21 19.5"] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.path
        d="M25 19.5 Q29 18 33 19.5"
        stroke="#8B9AAB"
        strokeWidth="1"
        fill="none"
        animate={{ d: ["M25 19.5 Q29 18 33 19.5", "M25 20 Q29 18.5 33 20", "M25 19.5 Q29 18 33 19.5"] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Nose */}
      <ellipse cx="23" cy="28" rx="2.5" ry="2" fill="#3D3D3D" />
      <ellipse cx="22.5" cy="27.5" rx="1" ry="0.5" fill="#5A5A5A" />
      
      {/* Mouth */}
      <path d="M23 30 L23 31.5" stroke="#3D3D3D" strokeWidth="1" />
      <path d="M20 32 Q23 34 26 32" stroke="#3D3D3D" strokeWidth="1" fill="none" />
      
      {/* Whiskers */}
      <g stroke="#4A4A4A" strokeWidth="0.7">
        <motion.line 
          x1="5" y1="25" x2="14" y2="27"
          animate={{ y1: [25, 24, 25] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.line 
          x1="4" y1="28" x2="14" y2="29"
          animate={{ y1: [28, 27, 28] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <motion.line 
          x1="5" y1="31" x2="14" y2="31"
          animate={{ y1: [31, 30, 31] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <motion.line 
          x1="41" y1="25" x2="32" y2="27"
          animate={{ y1: [25, 24, 25] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.line 
          x1="42" y1="28" x2="32" y2="29"
          animate={{ y1: [28, 27, 28] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <motion.line 
          x1="41" y1="31" x2="32" y2="31"
          animate={{ y1: [31, 30, 31] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </g>
      
      {/* Forehead stripe pattern */}
      <path d="M19 14 Q23 12 27 14" stroke="#6B7B8C" strokeWidth="1.5" fill="none" />
      <path d="M20 16 Q23 15 26 16" stroke="#6B7B8C" strokeWidth="1" fill="none" />
    </motion.g>
  </svg>
);

// Small walking Tom for inside search bar
const WalkingTomSmall = () => (
  <motion.svg 
    width="24" 
    height="24" 
    viewBox="0 0 60 66" 
    fill="none"
    animate={{ x: [0, 180] }}
    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
  >
    {/* Simplified walking Tom */}
    <motion.g
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 0.15, repeat: Infinity }}
    >
      {/* Body */}
      <ellipse cx="23" cy="46" rx="10" ry="12" fill="#8B9AAB" />
      <ellipse cx="23" cy="49" rx="6" ry="7" fill="#E8E0D8" />
      
      {/* Legs walking */}
      <motion.g
        animate={{ rotate: [-20, 20, -20] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        style={{ transformOrigin: "18px 54px" }}
      >
        <path d="M18 54 L14 64" stroke="#8B9AAB" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="13" cy="65" rx="3" ry="2" fill="#8B9AAB" />
      </motion.g>
      <motion.g
        animate={{ rotate: [20, -20, 20] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        style={{ transformOrigin: "28px 54px" }}
      >
        <path d="M28 54 L32 64" stroke="#8B9AAB" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="33" cy="65" rx="3" ry="2" fill="#8B9AAB" />
      </motion.g>
      
      {/* Head */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        style={{ transformOrigin: "23px 30px" }}
      >
        <ellipse cx="23" cy="28" rx="12" ry="10" fill="#8B9AAB" />
        <ellipse cx="23" cy="31" rx="6" ry="5" fill="#E8E0D8" />
        <path d="M12 20 L14 10 L18 18 Z" fill="#8B9AAB" />
        <path d="M34 20 L32 10 L28 18 Z" fill="#8B9AAB" />
        <circle cx="18" cy="26" r="2" fill="#FFFEF5" />
        <circle cx="28" cy="26" r="2" fill="#FFFEF5" />
        <circle cx="18" cy="26.5" r="1" fill="#1A1A1A" />
        <circle cx="28" cy="26.5" r="1" fill="#1A1A1A" />
        <ellipse cx="23" cy="31" rx="2" ry="1.5" fill="#3D3D3D" />
      </motion.g>
      
      {/* Tail */}
      <motion.path
        d="M10 50 Q4 46 6 40"
        stroke="#8B9AAB"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        animate={{ d: ["M10 50 Q4 46 6 40", "M10 50 Q6 48 8 42", "M10 50 Q4 46 6 40"] }}
        transition={{ duration: 0.2, repeat: Infinity }}
      />
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
      {/* Collapsed: Tom cat with magnifying glass */}
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
            <TomCat isWalking={false} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Jumping Tom animation */}
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
            <TomCat isWalking={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded: Search bar with Tom walking inside */}
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

            {/* Walking Tom inside search bar */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10 pointer-events-none overflow-hidden w-6 h-6">
              <WalkingTomSmall />
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
