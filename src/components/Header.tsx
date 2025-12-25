import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { ExpandableSearch } from "@/components/ExpandableSearch";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

export function Header({ searchQuery = "", onSearchChange, showSearch = true }: HeaderProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  const navItems = [
    { label: "Browse", path: "/" },
  ];

  return (
    <header className="glass-header safe-top">
      <div className="container flex items-center justify-between h-12 md:h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <motion.img 
            src={logo} 
            alt="PromptHub Logo" 
            width={100}
            height={34}
            className="h-7 md:h-8 w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-foreground/[0.08] dark:bg-white/[0.12] rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
                <span className={`relative z-10 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {showSearch && onSearchChange && (
            <div className="ml-2">
              <ExpandableSearch 
                value={searchQuery} 
                onChange={onSearchChange}
                placeholder="Search prompts..."
              />
            </div>
          )}

          <div className="ml-2">
            <ThemeToggle />
          </div>

          {!loading && (
            <>
              {user ? (
                <div className="ml-1">
                  <ProfileDropdown />
                </div>
              ) : (
                <Link to="/auth" className="ml-2">
                  <motion.button
                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full bg-foreground text-background transition-colors"
                    style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center gap-1.5">
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
            <Link to="/auth">
              <motion.button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-background"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
