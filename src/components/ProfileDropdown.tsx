import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  LogOut, 
  Shield, 
  UserCircle, 
  Bookmark, 
  Star,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export function ProfileDropdown() {
  const { user, isAdmin, isPro, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const canAddPrompt = isAdmin || isPro;

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, email")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
          <Star className="w-3 h-3" />
          Admin
        </span>
      );
    }
    if (isPro) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
          <Star className="w-3 h-3" />
          Pro
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
        User
      </span>
    );
  };

  const displayName = profile?.display_name || profile?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url;
  const initial = displayName[0]?.toUpperCase() || 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/30 transition-all duration-200"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground ring-2 ring-border/50 transition-transform hover:scale-105">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            initial
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 z-50 animate-scale-in origin-top-right">
          {/* Glassmorphism container with gradient */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient background layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/95 to-accent/10" />
            
            {/* Glass effect layer */}
            <div className="absolute inset-0 backdrop-blur-xl bg-background/70" />
            
            {/* Border gradient */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-border/50 ring-inset" />
            
            {/* Content */}
            <div className="relative p-4">
              {/* Profile Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-primary-foreground ring-2 ring-primary/20">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {displayName}
                  </p>
                  <div className="mt-1">
                    {getRoleBadge()}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="pt-3 space-y-1">
                {canAddPrompt && (
                  <Link
                    to="/upload"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-primary/10 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                    <span className="font-medium">Add Prompt</span>
                  </Link>
                )}
                
                <Link
                  to="/saved-prompts"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-primary/10 transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Saved Prompts</span>
                </Link>
                
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-primary/10 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">My Profile</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-primary/10 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                )}

                <div className="pt-2 mt-2 border-t border-border/50">
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
