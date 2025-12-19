import { useState, useEffect } from "react";
import { Instagram, Facebook, Heart, Send, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import logo from "@/assets/logo.jpg";

const FACEBOOK_URL = "https://facebook.com/darmohasin13";
const INSTAGRAM_URL = "https://instagram.com/darmohsin63";

// Validation schema for feedback form
const feedbackSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

export function Footer() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("email, display_name")
          .eq("id", user.id)
          .single();
        
        if (data) {
          setUserEmail(data.email);
          setUserName(data.display_name);
        }
      } else {
        setUserEmail(null);
        setUserName(null);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userEmail) {
      toast({
        title: "Sign in required",
        description: "Please sign in to send feedback.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate input with zod
    const validationResult = feedbackSchema.safeParse({ message });
    
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    const validatedData = validationResult.data;
    setIsSubmitting(true);
    
    const { error } = await supabase.from("feedback").insert({
      email: userEmail,
      message: validatedData.message,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message sent!",
        description: "Thank you for your feedback.",
      });
      setMessage("");
    }
  };

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="inline-block mb-4 group">
              <img 
                src={logo} 
                alt="PromptHub" 
                width={140}
                height={48}
                className="h-12 w-auto rounded-xl object-cover transition-all duration-300 group-hover:scale-105" 
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              Discover, copy, and use curated prompts for your creative projects. 
              Your one-stop destination for amazing AI prompts.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Follow on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Follow on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Prompts
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/terms" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Feedback Form - Glassmorphism Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 rounded-2xl blur-xl opacity-60" />
            <div className="relative backdrop-blur-xl bg-background/40 border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                  <MessageSquare className="w-4 h-4 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">Send Feedback</h3>
              </div>
              
              {user ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="text-xs text-muted-foreground mb-2 px-1">
                    Sending as <span className="text-foreground font-medium">{userName || userEmail}</span>
                  </div>
                  <Textarea
                    placeholder="Your suggestion or complaint..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="bg-background/50 border-white/10 resize-none focus:border-primary/50 transition-colors"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Feedback"}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">Sign in to send feedback</p>
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PromptHub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for creators
          </p>
        </div>
      </div>
    </footer>
  );
}