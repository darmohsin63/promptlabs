import { Link, useLocation } from "react-router-dom";
import { LogIn, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { ExpandableSearch } from "@/components/ExpandableSearch";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

// Floating magical particles for the header
const MagicalParticles = () => {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + i * 12}%`,
    delay: i * 0.4,
    duration: 3 + Math.random() * 2,
    size: 2 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-amber-400/30"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: 60, opacity: 0 }}
          animate={{
            y: [-10, 60],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Magical wand sparkle effect
const WandSparkle = ({ className }: { className?: string }) => (
  <motion.div
    className={className}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Sparkles className="w-4 h-4 text-amber-400" />
  </motion.div>
);

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

export function Header({ searchQuery = "", onSearchChange, showSearch = true }: HeaderProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  return (
    <header className="glass-header safe-top relative overflow-hidden">
      {/* Magical gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/5 via-transparent to-amber-900/5 pointer-events-none" />
      
      {/* Subtle bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      
      {/* Floating particles */}
      <MagicalParticles />
      
      <div className="container flex items-center justify-between h-14 md:h-16 relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group relative">
          {/* Logo glow effect on hover */}
          <div className="absolute -inset-2 bg-amber-500/0 group-hover:bg-amber-500/10 rounded-xl transition-all duration-500 blur-lg" />
          <img 
            src={logo} 
            alt="PromptHub Logo" 
            width={117}
            height={40}
            className="h-8 md:h-10 w-auto transition-all duration-300 group-hover:scale-105 relative z-10"
          />
          <WandSparkle className="absolute -right-3 -top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3">
          <Link
            to="/"
            className={`relative px-4 py-2 rounded-xl font-medium font-serif transition-all duration-300 group ${
              location.pathname === "/"
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                : "text-muted-foreground hover:text-amber-200 hover:bg-amber-500/5"
            }`}
          >
            <span className="relative z-10">Browse</span>
            {location.pathname === "/" && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/5 to-amber-600/5"
                layoutId="navHighlight"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>

          {showSearch && onSearchChange && (
            <div className="relative">
              <ExpandableSearch 
                value={searchQuery} 
                onChange={onSearchChange}
                placeholder="Search prompts..."
              />
            </div>
          )}

          <ThemeToggle />

          {!loading && (
            <>
              {user ? (
                <ProfileDropdown />
              ) : (
                <Link
                  to="/auth"
                  className="relative flex items-center gap-2 text-sm py-2.5 px-4 rounded-xl font-serif font-medium bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] group overflow-hidden"
                >
                  {/* Magical shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />
                  <LogIn className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Sign In</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-2">
          {showSearch && onSearchChange && (
            <ExpandableSearch 
              value={searchQuery} 
              onChange={onSearchChange}
              placeholder="Search..."
            />
          )}
          <ThemeToggle />
          {!loading && user && <ProfileDropdown />}
          {!loading && !user && (
            <Link
              to="/auth"
              className="relative flex items-center gap-2 text-sm py-2 px-3 rounded-xl font-serif bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
              <LogIn className="w-4 h-4 relative z-10" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}