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
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

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

// Floating 3D Orbs
const FloatingOrbs = () => {
  const orbs = [
    { size: 180, x: "10%", y: "20%", delay: 0, duration: 8 },
    { size: 120, x: "80%", y: "60%", delay: 2, duration: 10 },
    { size: 80, x: "60%", y: "10%", delay: 4, duration: 7 },
    { size: 140, x: "20%", y: "70%", delay: 1, duration: 9 },
    { size: 60, x: "90%", y: "30%", delay: 3, duration: 6 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle at 30% 30%, hsl(var(--foreground) / 0.04), hsl(var(--foreground) / 0.01))`,
            filter: "blur(40px)",
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    setRotateX(-mouseY / 20);
    setRotateY(mouseX / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const springConfig = { stiffness: 300, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// iOS-style Social Button with 3D effect
const SocialButton = ({ 
  icon: Icon, 
  label, 
  href,
  delay,
}: { 
  icon: React.ElementType; 
  label: string; 
  href: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group"
      initial={{ opacity: 0, y: 30, rotateX: -30 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        delay,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ 
        scale: 1.1, 
        y: -5,
        rotateY: 10,
      }}
      whileTap={{ scale: 0.95 }}
      style={{ transformPerspective: 600 }}
      aria-label={label}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-2 rounded-full bg-foreground/5 blur-xl opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      
      {/* Button */}
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.1] border border-foreground/[0.08] backdrop-blur-sm transition-all duration-300 shadow-lg shadow-foreground/[0.02]">
        <Icon className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
      </div>
      
      {/* Label */}
      <motion.span
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
      >
        {label}
      </motion.span>
    </motion.a>
  );
};

// Animated Link with 3D hover
const AnimatedLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <motion.div
    whileHover={{ x: 4, rotateY: 5 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    style={{ transformPerspective: 500 }}
  >
    <Link 
      to={to}
      onClick={onClick}
      className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-block"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {children}
    </Link>
  </motion.div>
);

export function Footer() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]);

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
    <motion.footer 
      ref={footerRef}
      className="relative overflow-hidden"
      style={{ opacity }}
    >
      {/* iOS-style separator with glow */}
      <div className="relative h-px">
        <div className="absolute inset-0 bg-foreground/[0.06]" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Footer content with glassmorphism - blends with hero-gradient background */}
      <div className="relative bg-transparent backdrop-blur-sm">
        {/* Floating Orbs for depth */}
        <FloatingOrbs />
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/[0.02] via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          className="container py-14 px-6 relative z-10"
          style={{ y }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Branding Area with 3D entrance */}
            <motion.div 
              className="md:col-span-4 space-y-4"
              initial={{ opacity: 0, x: -40, rotateY: -20 }}
              animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
              style={{ transformPerspective: 1000 }}
            >
              <Link to="/" className="inline-block">
                <motion.img 
                  src={logo} 
                  alt="PromptHub" 
                  width={120}
                  height={40}
                  className="h-9 w-auto object-cover"
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{ transformPerspective: 500 }}
                />
              </Link>
              <p 
                className="text-muted-foreground text-sm leading-relaxed max-w-xs"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                "Hand-crafted AI prompts that work."
              </p>
            </motion.div>

            {/* Links Columns with staggered 3D entrance */}
            <motion.div 
              className="md:col-span-4 grid grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Explore */}
              <div className="space-y-4">
                <motion.h4 
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  Explore
                </motion.h4>
                <ul className="space-y-2.5">
                  <li><AnimatedLink to="/">Home</AnimatedLink></li>
                  <li><AnimatedLink to="/search">Browse</AnimatedLink></li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-4">
                <motion.h4 
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  Company
                </motion.h4>
                <ul className="space-y-2.5">
                  <li><AnimatedLink to="/about" onClick={() => window.scrollTo(0, 0)}>About</AnimatedLink></li>
                  <li><AnimatedLink to="/privacy" onClick={() => window.scrollTo(0, 0)}>Privacy</AnimatedLink></li>
                  <li><AnimatedLink to="/terms" onClick={() => window.scrollTo(0, 0)}>Terms</AnimatedLink></li>
                </ul>
              </div>
            </motion.div>

            {/* Feedback Section - iOS Card Style with 3D Tilt */}
            <motion.div 
              className="md:col-span-4"
              initial={{ opacity: 0, x: 40, rotateY: 20 }}
              animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 80 }}
              style={{ transformPerspective: 1000 }}
            >
              <TiltCard>
                <div className="relative bg-foreground/[0.03] border border-foreground/[0.08] rounded-2xl p-5 backdrop-blur-sm shadow-xl shadow-foreground/[0.02]">
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/[0.02] via-transparent to-transparent pointer-events-none" />
                  
                  <div className="relative flex items-center gap-2.5 mb-4">
                    <motion.div 
                      className="flex items-center justify-center w-9 h-9 rounded-xl bg-foreground/[0.06] border border-foreground/[0.06]"
                      whileHover={{ scale: 1.1, rotateZ: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <MessageSquare className="w-4 h-4 text-foreground/70" />
                    </motion.div>
                    <h3 
                      className="font-semibold text-foreground text-sm"
                      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    >
                      Contact Us
                    </h3>
                  </div>
                  
                  {user ? (
                    <form onSubmit={handleSubmit} className="relative space-y-3">
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
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-xl h-10 text-sm font-medium shadow-lg shadow-foreground/10"
                          style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                        >
                          <Send className="w-3.5 h-3.5 mr-2" />
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </motion.div>
                    </form>
                  ) : (
                    <div className="relative text-center py-4">
                      <p 
                        className="text-sm text-muted-foreground mb-3"
                        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
                      >
                        Sign in to send feedback
                      </p>
                      <Link to="/auth">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
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
              </TiltCard>
            </motion.div>
          </div>

          {/* Social Icons - iOS Style with 3D entrance */}
          <motion.div 
            className="flex flex-col items-center justify-center mt-14"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.h4 
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6"
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              Connect With Us
            </motion.h4>
            
            <div className="flex items-center gap-4" style={{ perspective: 600 }}>
              <SocialButton
                icon={Instagram}
                label="Instagram"
                href={INSTAGRAM_URL}
                delay={0.7}
              />
              
              <SocialButton
                icon={Facebook}
                label="Facebook"
                href={FACEBOOK_URL}
                delay={0.8}
              />
            </div>
          </motion.div>

          {/* Bottom Bar - iOS Style */}
          <motion.div 
            className="mt-12 pt-6 border-t border-foreground/[0.06]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p 
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                © 2025 PromptHub. All rights reserved.
              </p>
              <motion.p 
                className="text-xs text-muted-foreground flex items-center gap-1"
                style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                Made with 
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                </motion.span>
                by the team
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
