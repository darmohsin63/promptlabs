import { Link, useLocation } from "react-router-dom";
import { Sparkles, Plus, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-header safe-top">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-glow">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
          </div>
          <span className="text-lg md:text-xl font-semibold text-foreground">Prompt Hub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
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

          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    to="/upload"
                    className="btn-primary flex items-center gap-2 text-sm !py-2.5 !px-4"
                  >
                    <Plus className="w-4 h-4" />
                    Add Prompt
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
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
          
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-panel !rounded-none !rounded-b-3xl mx-4 mb-4 animate-slide-up safe-bottom">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                location.pathname === "/" ? "bg-primary/10 text-primary" : "text-foreground"
              }`}
            >
              Browse Prompts
            </Link>
            
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      to="/upload"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-xl font-medium text-foreground flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Prompt
                    </Link>
                    <button
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                      className="px-4 py-3 rounded-xl font-medium text-muted-foreground flex items-center gap-2 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-center mt-2"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
