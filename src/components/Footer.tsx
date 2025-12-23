import { useState, useEffect, useRef } from "react";
import { Instagram, Facebook, Heart, Send, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import logo from "@/assets/logo.png";
import { motion, useInView } from "framer-motion";

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
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

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

  const linkVariants = {
    initial: { y: 0 },
    hover: { y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const } }
  };

  return (
    <motion.footer 
      ref={footerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mt-20"
    >
      {/* Subtle gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      
      {/* Footer panel */}
      <div className="bg-muted/30 rounded-t-3xl md:rounded-t-none">
        <div className="container py-16 px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Branding Area */}
            <div className="md:col-span-4 space-y-6">
              <Link to="/" className="inline-block group">
                <img 
                  src={logo} 
                  alt="PromptHub" 
                  width={140}
                  height={48}
                  className="h-11 w-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
                />
              </Link>
              <p className="text-muted-foreground/70 text-sm leading-relaxed max-w-xs">
                Hand-crafted AI prompts that work.
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <motion.a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]"
                  aria-label="Follow on Instagram"
                >
                  <Instagram className="w-[18px] h-[18px]" />
                </motion.a>
                <motion.a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]"
                  aria-label="Follow on Facebook"
                >
                  <Facebook className="w-[18px] h-[18px]" />
                </motion.a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-4 grid grid-cols-2 gap-8">
              {/* Explore */}
              <div className="space-y-4">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground/50">
                  Explore
                </h4>
                <ul className="space-y-3">
                  <li>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link 
                        to="/" 
                        className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200"
                      >
                        Home
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link 
                        to="/" 
                        className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200"
                      >
                        Browse Prompts
                      </Link>
                    </motion.div>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-4">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground/50">
                  Company
                </h4>
                <ul className="space-y-3">
                  <li>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link 
                        to="/about" 
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200"
                      >
                        About
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link 
                        to="/privacy" 
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200"
                      >
                        Privacy Policy
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link 
                        to="/terms" 
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors duration-200"
                      >
                        Terms of Service
                      </Link>
                    </motion.div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feedback Section - Unchanged */}
            <div className="md:col-span-4 relative">
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
          <div className="mt-16 pt-6 relative">
            {/* Thin divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-border/30" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground/50">
                © 2025 PromptHub
              </p>
              <p className="text-xs text-muted-foreground/50 flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-destructive/70 fill-destructive/70" /> for creators
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
