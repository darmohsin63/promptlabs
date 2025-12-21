import { Link, useLocation } from "react-router-dom";
import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import logo from "@/assets/logo.png";

export function Header() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-header safe-top">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src={logo} 
            alt="PromptHub Logo" 
            width={117}
            height={40}
            className="h-8 md:h-10 w-auto transition-all duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              location.pathname === "/"
                ? "glass-card !rounded-xl text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            Browse
          </Link>

          <ThemeToggle />

          {!loading && (
            <>
              {user ? (
                <ProfileDropdown />
              ) : (
                <Link
                  to="/auth"
                  className="btn-primary flex items-center gap-2 text-sm !py-2.5 !px-4"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          {!loading && user && <ProfileDropdown />}
          {!loading && !user && (
            <Link
              to="/auth"
              className="btn-primary flex items-center gap-2 text-sm !py-2 !px-3"
            >
              <LogIn className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}