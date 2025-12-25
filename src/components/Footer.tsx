import { useState, useEffect } from "react";
import { Instagram, Facebook, Heart, Send, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";

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

// iOS-style Social Button
const SocialButton = ({ 
  icon: Icon, 
  label, 
  href,
}: { 
  icon: React.ElementType; 
  label: string; 
  href: string;
}) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.1] transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={label}
    >
      <Icon className="w-4.5 h-4.5 text-foreground/70" />
    </motion.a>
  );
};

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
    <footer className="relative mt-16">
      {/* iOS-style separator */}
      <div className="h-px bg-foreground/[0.08]" />
      
      {/* Footer content with iOS glassmorphism */}
      <div className="bg-background/80 backdrop-blur-xl">
        <div className="container py-12 px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Branding Area */}
            <div className="md:col-span-4 space-y-4">
              <Link to="/" className="inline-block">
                <motion.img 
                  src={logo} 
                  alt="PromptHub" 
                  width={120}
                  height={40}
                  className="h-9 w-auto object-cover"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                />
              </Link>
              <p 
                className="text-muted-foreground text-sm leading-relaxed max-w-xs"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                "Hand-crafted AI prompts that work."
              </p>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-4 grid grid-cols-2 gap-8">
              {/* Explore */}
              <div className="space-y-4">
                <h4 
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  Explore
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link 
                      to="/" 
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/search" 
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      Browse
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-4">
                <h4 
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  Company
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <Link 
                      to="/about" 
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/privacy" 
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/terms" 
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feedback Section - iOS Card Style */}
            <div className="md:col-span-4">
              <div className="bg-foreground/[0.03] border border-foreground/[0.06] rounded-2xl p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/[0.06]">
                    <MessageSquare className="w-4 h-4 text-foreground/70" />
                  </div>
                  <h3 
                    className="font-semibold text-foreground text-sm"
                    style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  >
                    Contact Us
                  </h3>
                </div>
                
                {user ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <p 
                      className="text-xs text-muted-foreground px-1"
                      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      Sending as <span className="text-foreground font-medium">{userName || userEmail}</span>
                    </p>
                    <Textarea
                      placeholder="Write your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="bg-background/60 border-foreground/[0.08] resize-none focus:border-foreground/20 transition-colors text-sm rounded-xl"
                      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    />
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-xl h-9 text-sm font-medium"
                        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                      >
                        <Send className="w-3.5 h-3.5 mr-2" />
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </motion.div>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p 
                      className="text-sm text-muted-foreground mb-3"
                      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      Sign in to send feedback
                    </p>
                    <Link to="/auth">
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-foreground/[0.1] hover:bg-foreground/[0.04] rounded-xl"
                          style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          Sign In
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Icons - iOS Style */}
          <div className="flex flex-col items-center justify-center mt-12">
            <h4 
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-5"
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              Connect With Us
            </h4>
            
            <div className="flex items-center gap-3">
              <SocialButton
                icon={Instagram}
                label="Instagram"
                href={INSTAGRAM_URL}
              />
              
              <SocialButton
                icon={Facebook}
                label="Facebook"
                href={FACEBOOK_URL}
              />
            </div>
          </div>

          {/* Bottom Bar - iOS Style */}
          <div className="mt-10 pt-6 border-t border-foreground/[0.06]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p 
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                © 2025 PromptHub. All rights reserved.
              </p>
              <p 
                className="text-xs text-muted-foreground flex items-center gap-1"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by the team
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
