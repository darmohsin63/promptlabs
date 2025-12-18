import { Link, useLocation } from "react-router-dom";
import { Plus, LogIn, LogOut, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.jpg";

export function Header() {
  const location = useLocation();
  const { user, isAdmin, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass-header safe-top">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src={logo} 
            alt="PromptHub Logo" 
            className="h-8 md:h-10 w-auto rounded-lg transition-all duration-300 group-hover:scale-105"
          />
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
                  {isAdmin && (
                    <>
                      <Link
                        to="/upload"
                        className="btn-primary flex items-center gap-2 text-sm !py-2.5 !px-4"
                      >
                        <Plus className="w-4 h-4" />
                        Add Prompt
                      </Link>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                      >
                        <Shield className="w-4 h-4" />
                        Admin
                      </Link>
                    </>
                  )}
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
                    {isAdmin && (
                      <>
                        <Link
                          to="/upload"
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-3 rounded-xl font-medium text-foreground flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Prompt
                        </Link>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-3 rounded-xl font-medium text-foreground flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      </>
                    )}
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