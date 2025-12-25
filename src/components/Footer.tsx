import { useState, useEffect, useRef } from "react";
import { Instagram, Facebook, Heart, Send, MessageSquare, Twitter, Github } from "lucide-react";
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

// Hogwarts Castle Silhouette Component
const HogwartsCastle = () => (
  <svg
    viewBox="0 0 1200 200"
    className="absolute bottom-0 left-0 right-0 w-full h-auto pointer-events-none"
    preserveAspectRatio="xMidYMax slice"
  >
    <defs>
      <linearGradient id="castleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.15" />
        <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    
    {/* Main Castle Structure */}
    <g fill="url(#castleGradient)">
      {/* Left Tower - Astronomy Tower */}
      <path d="M50,200 L50,120 L40,120 L45,80 L40,80 L55,40 L70,80 L65,80 L70,120 L60,120 L60,200 Z" />
      <rect x="47" y="130" width="16" height="15" rx="7" fill="url(#windowGlow)" opacity="0.6" />
      
      {/* Second Tower */}
      <path d="M100,200 L100,100 L90,100 L95,70 L90,70 L105,30 L120,70 L115,70 L120,100 L110,100 L110,200 Z" />
      <rect x="97" y="110" width="16" height="15" rx="7" fill="url(#windowGlow)" opacity="0.5" />
      <rect x="97" y="140" width="16" height="15" rx="7" fill="url(#windowGlow)" opacity="0.7" />
      
      {/* Great Hall Section */}
      <path d="M140,200 L140,130 L180,130 L180,110 L170,110 L175,80 L185,80 L190,60 L195,80 L205,80 L210,110 L200,110 L200,130 L240,130 L240,200 Z" />
      <rect x="155" y="150" width="20" height="30" rx="10" fill="url(#windowGlow)" opacity="0.6" />
      <rect x="205" y="150" width="20" height="30" rx="10" fill="url(#windowGlow)" opacity="0.5" />
      
      {/* Central Main Tower - Gryffindor Tower */}
      <path d="M280,200 L280,90 L270,90 L275,60 L265,60 L280,20 L295,10 L310,20 L325,60 L315,60 L320,90 L310,90 L310,200 Z" />
      <circle cx="295" cy="45" r="8" fill="url(#windowGlow)" opacity="0.8" />
      <rect x="282" y="100" width="26" height="20" rx="10" fill="url(#windowGlow)" opacity="0.6" />
      <rect x="282" y="135" width="26" height="20" rx="10" fill="url(#windowGlow)" opacity="0.7" />
      
      {/* Bridge Section */}
      <path d="M340,200 L340,150 L380,150 L380,140 L420,140 L420,150 L460,150 L460,200 Z" />
      <rect x="360" y="160" width="15" height="20" rx="5" fill="url(#windowGlow)" opacity="0.4" />
      <rect x="395" y="155" width="15" height="25" rx="5" fill="url(#windowGlow)" opacity="0.5" />
      <rect x="425" y="160" width="15" height="20" rx="5" fill="url(#windowGlow)" opacity="0.4" />
      
      {/* Clock Tower */}
      <path d="M500,200 L500,70 L490,70 L495,50 L485,50 L510,15 L535,50 L525,50 L530,70 L520,70 L520,200 Z" />
      <circle cx="510" cy="90" r="15" fill="none" stroke="url(#windowGlow)" strokeWidth="2" opacity="0.7" />
      <line x1="510" y1="90" x2="510" y2="80" stroke="url(#windowGlow)" strokeWidth="2" opacity="0.7" />
      <line x1="510" y1="90" x2="518" y2="93" stroke="url(#windowGlow)" strokeWidth="2" opacity="0.7" />
      <rect x="497" y="120" width="26" height="25" rx="10" fill="url(#windowGlow)" opacity="0.6" />
      
      {/* Main Building Section */}
      <path d="M560,200 L560,120 L640,120 L640,200 Z" />
      <rect x="575" y="140" width="20" height="35" rx="8" fill="url(#windowGlow)" opacity="0.5" />
      <rect x="605" y="140" width="20" height="35" rx="8" fill="url(#windowGlow)" opacity="0.6" />
      
      {/* Ravenclaw Tower */}
      <path d="M680,200 L680,80 L670,80 L675,55 L665,55 L690,10 L715,55 L705,55 L710,80 L700,80 L700,200 Z" />
      <circle cx="690" cy="40" r="6" fill="url(#windowGlow)" opacity="0.9" />
      <rect x="677" y="90" width="26" height="20" rx="10" fill="url(#windowGlow)" opacity="0.6" />
      <rect x="677" y="125" width="26" height="20" rx="10" fill="url(#windowGlow)" opacity="0.5" />
      <rect x="677" y="160" width="26" height="20" rx="10" fill="url(#windowGlow)" opacity="0.7" />
      
      {/* Another Bridge */}
      <path d="M740,200 L740,140 L800,140 L800,200 Z" />
      <rect x="755" y="155" width="15" height="25" rx="5" fill="url(#windowGlow)" opacity="0.4" />
      <rect x="780" y="155" width="15" height="25" rx="5" fill="url(#windowGlow)" opacity="0.5" />
      
      {/* Hufflepuff Area */}
      <path d="M840,200 L840,110 L830,110 L835,85 L845,85 L855,60 L865,85 L875,85 L880,110 L870,110 L870,200 Z" />
      <rect x="842" y="120" width="26" height="20" rx="10" fill="url(#windowGlow)" opacity="0.5" />
      <rect x="842" y="155" width="26" height="25" rx="10" fill="url(#windowGlow)" opacity="0.6" />
      
      {/* Library Tower */}
      <path d="M920,200 L920,90 L910,90 L915,65 L905,65 L930,25 L955,65 L945,65 L950,90 L940,90 L940,200 Z" />
      <rect x="917" y="100" width="26" height="18" rx="8" fill="url(#windowGlow)" opacity="0.6" />
      <rect x="917" y="130" width="26" height="18" rx="8" fill="url(#windowGlow)" opacity="0.5" />
      <rect x="917" y="160" width="26" height="18" rx="8" fill="url(#windowGlow)" opacity="0.7" />
      
      {/* Right Section */}
      <path d="M980,200 L980,130 L1040,130 L1040,200 Z" />
      <rect x="995" y="145" width="15" height="30" rx="6" fill="url(#windowGlow)" opacity="0.5" />
      <rect x="1020" y="145" width="15" height="30" rx="6" fill="url(#windowGlow)" opacity="0.6" />
      
      {/* Far Right Tower - Slytherin Dungeon Tower */}
      <path d="M1080,200 L1080,95 L1070,95 L1075,70 L1065,70 L1090,30 L1115,70 L1105,70 L1110,95 L1100,95 L1100,200 Z" />
      <rect x="1077" y="105" width="26" height="18" rx="8" fill="url(#windowGlow)" opacity="0.5" />
      <rect x="1077" y="135" width="26" height="18" rx="8" fill="url(#windowGlow)" opacity="0.6" />
      <rect x="1077" y="165" width="26" height="18" rx="8" fill="url(#windowGlow)" opacity="0.4" />
      
      {/* Final Tower */}
      <path d="M1140,200 L1140,110 L1130,110 L1135,85 L1150,50 L1165,85 L1170,110 L1160,110 L1160,200 Z" />
      <rect x="1137" y="120" width="26" height="20" rx="8" fill="url(#windowGlow)" opacity="0.5" />
      <rect x="1137" y="155" width="26" height="25" rx="8" fill="url(#windowGlow)" opacity="0.6" />
    </g>
    
    {/* Ground/Hill */}
    <path d="M0,200 Q300,180 600,190 Q900,175 1200,200 L1200,220 L0,220 Z" fill="url(#castleGradient)" />
  </svg>
);

// Floating Stars Component
const FloatingStars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 60}%`,
        }}
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// Flying Owl with Letter Component
const FlyingOwl = ({ delay, startX, duration }: { delay: number; startX: number; duration: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    initial={{ x: startX, y: 80, opacity: 0 }}
    animate={{
      x: [startX, startX + 400, startX + 800, startX + 1200],
      y: [80, 40, 60, 30],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
    }}
  >
    {/* Owl Body */}
    <svg viewBox="0 0 60 50" className="w-12 h-10" fill="none">
      {/* Wings - animated flutter */}
      <motion.path
        d="M15 25 Q5 15 8 25 Q5 35 15 25"
        fill="hsl(var(--foreground))"
        opacity="0.6"
        animate={{ d: ["M15 25 Q5 15 8 25 Q5 35 15 25", "M15 25 Q5 20 8 25 Q5 30 15 25", "M15 25 Q5 15 8 25 Q5 35 15 25"] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      <motion.path
        d="M45 25 Q55 15 52 25 Q55 35 45 25"
        fill="hsl(var(--foreground))"
        opacity="0.6"
        animate={{ d: ["M45 25 Q55 15 52 25 Q55 35 45 25", "M45 25 Q55 20 52 25 Q55 30 45 25", "M45 25 Q55 15 52 25 Q55 35 45 25"] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      {/* Body */}
      <ellipse cx="30" cy="28" rx="12" ry="14" fill="hsl(var(--foreground))" opacity="0.5" />
      {/* Head */}
      <circle cx="30" cy="16" r="10" fill="hsl(var(--foreground))" opacity="0.6" />
      {/* Ears/Tufts */}
      <path d="M22 10 L24 6 L26 12" fill="hsl(var(--foreground))" opacity="0.5" />
      <path d="M38 10 L36 6 L34 12" fill="hsl(var(--foreground))" opacity="0.5" />
      {/* Eyes */}
      <circle cx="26" cy="15" r="4" fill="#ffd700" opacity="0.9" />
      <circle cx="34" cy="15" r="4" fill="#ffd700" opacity="0.9" />
      <circle cx="26" cy="15" r="2" fill="hsl(var(--background))" />
      <circle cx="34" cy="15" r="2" fill="hsl(var(--background))" />
      {/* Beak */}
      <path d="M28 19 L30 23 L32 19" fill="#ff8c00" opacity="0.8" />
      {/* Feet holding letter */}
      <path d="M26 40 L26 45 M28 40 L28 45" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.5" />
      <path d="M32 40 L32 45 M34 40 L34 45" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.5" />
    </svg>
    {/* Letter */}
    <motion.div
      className="absolute top-8 left-1/2 -translate-x-1/2"
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      <svg viewBox="0 0 24 18" className="w-6 h-5">
        <rect x="1" y="1" width="22" height="16" rx="1" fill="#f5e6d3" stroke="#8b7355" strokeWidth="0.5" />
        <path d="M1 2 L12 10 L23 2" stroke="#8b7355" strokeWidth="0.5" fill="none" />
        {/* Wax seal */}
        <circle cx="12" cy="14" r="3" fill="#8b0000" />
        <text x="12" y="15.5" textAnchor="middle" fontSize="4" fill="#ffd700" fontWeight="bold">H</text>
      </svg>
    </motion.div>
  </motion.div>
);

// Flying Owls Container
const FlyingOwls = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <FlyingOwl delay={0} startX={-100} duration={12} />
    <FlyingOwl delay={4} startX={-150} duration={15} />
    <FlyingOwl delay={8} startX={-80} duration={10} />
  </div>
);

// Magic Wand Icon
const MagicWandIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4M12.2 11.8l-1.4 1.4M3 21l9-9" />
    <path d="M12.2 6.2l-1.4-1.4" />
  </svg>
);

// Magical floating orbs around social icons section
const SocialMagicalOrbs = () => {
  const orbs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 45) * (Math.PI / 180),
    delay: i * 0.15,
  }));

  return (
    <>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-400/50"
          style={{
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [
              Math.cos(orb.angle) * 80,
              Math.cos(orb.angle + Math.PI) * 80,
              Math.cos(orb.angle) * 80,
            ],
            y: [
              Math.sin(orb.angle) * 30,
              Math.sin(orb.angle + Math.PI) * 30,
              Math.sin(orb.angle) * 30,
            ],
            opacity: [0.2, 0.7, 0.2],
            scale: [0.6, 1.2, 0.6],
          }}
          transition={{
            duration: 5,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

// Extraordinary Animated Social Icon Button
const MagicalSocialButton = ({ 
  icon: Icon, 
  label, 
  color,
  href,
  delay,
}: { 
  icon: React.ElementType; 
  label: string; 
  color: string;
  href: string;
  delay: number;
}) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        delay, 
        duration: 0.5, 
        type: "spring", 
        bounce: 0.4 
      }}
      whileHover={{ scale: 1.15, y: -5 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      {/* Outer magical rotating ring */}
      <motion.div
        className="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${color}30, transparent, ${color}30, transparent)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Pulsing magical glow */}
      <motion.div
        className="absolute -inset-2 rounded-full blur-md"
        style={{ backgroundColor: `${color}20` }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Inner button container */}
      <div 
        className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border overflow-hidden backdrop-blur-sm"
        style={{ 
          backgroundColor: `${color}10`,
          borderColor: `${color}30`,
          boxShadow: `0 0 25px ${color}15, inset 0 0 15px ${color}08`,
        }}
      >
        {/* Magical shimmer sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeInOut",
          }}
        />
        
        {/* Sparkle effects */}
        <motion.div
          className="absolute top-1 right-1 w-1 h-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.3,
          }}
        />
        <motion.div
          className="absolute bottom-2 left-2 w-0.5 h-0.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 0.8,
          }}
        />
        
        {/* Icon */}
        <Icon 
          className="w-5 h-5 md:w-6 md:h-6 relative z-10 transition-all duration-300 group-hover:scale-110" 
          style={{ color }}
        />
      </div>
      
      {/* Floating label on hover */}
      <motion.span
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-serif whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 px-2 py-0.5 rounded-full"
        style={{ 
          color,
          backgroundColor: `${color}15`,
        }}
      >
        {label}
      </motion.span>
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
      {/* Magical gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      
      {/* Footer panel with Hogwarts theme */}
      <div className="relative bg-gradient-to-b from-muted/30 via-muted/20 to-muted/40 rounded-t-3xl md:rounded-t-none overflow-hidden">
        {/* Floating Stars */}
        <FloatingStars />
        
        {/* Flying Owls */}
        <FlyingOwls />
        
        {/* Hogwarts Castle Silhouette */}
        <HogwartsCastle />
        
        <div className="container py-16 px-6 relative z-10">
          
          {/* CENTERED SOCIAL ICONS WITH EXTRAORDINARY ANIMATIONS */}
          <div className="flex flex-col items-center justify-center mb-16 relative">
            <h4 className="text-xs font-medium uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 flex items-center gap-2 mb-8">
              <MagicWandIcon className="w-3 h-3" />
              Connect With Us
              <MagicWandIcon className="w-3 h-3" />
            </h4>
            
            <div className="relative flex items-center justify-center gap-5 md:gap-8">
              {/* Magical orbs floating around */}
              <SocialMagicalOrbs />
              
              <MagicalSocialButton
                icon={Instagram}
                label="Instagram"
                color="#E4405F"
                href={INSTAGRAM_URL}
                delay={0}
              />
              
              <MagicalSocialButton
                icon={Facebook}
                label="Facebook"
                color="#1877F2"
                href={FACEBOOK_URL}
                delay={0.1}
              />
              
              <MagicalSocialButton
                icon={Twitter}
                label="Twitter"
                color="#1DA1F2"
                href="https://twitter.com/prompthub"
                delay={0.2}
              />
              
              <MagicalSocialButton
                icon={Github}
                label="GitHub"
                color="#ffffff"
                href="https://github.com/prompthub"
                delay={0.3}
              />
            </div>
            
            {/* Magical divider line */}
            <div className="mt-12 w-full max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          </div>
          
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
              <p className="text-muted-foreground/70 text-sm leading-relaxed max-w-xs font-serif italic">
                "It does not do to dwell on dreams and forget to live." — Hand-crafted AI prompts that work.
              </p>
            </div>

            {/* Links Columns with Harry Potter theming */}
            <div className="md:col-span-4 grid grid-cols-2 gap-8">
              {/* Explore */}
              <div className="space-y-4">
                <h4 className="text-xs font-medium uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 flex items-center gap-2">
                  <MagicWandIcon className="w-3 h-3" />
                  Explore
                </h4>
                <ul className="space-y-3">
                  <li>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link 
                        to="/" 
                        className="text-sm text-muted-foreground/70 hover:text-amber-500 transition-colors duration-200 font-serif"
                      >
                        Home
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link 
                        to="/search" 
                        className="text-sm text-muted-foreground/70 hover:text-amber-500 transition-colors duration-200 font-serif"
                      >
                        Browse
                      </Link>
                    </motion.div>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="space-y-4">
                <h4 className="text-xs font-medium uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 flex items-center gap-2">
                  <MagicWandIcon className="w-3 h-3" />
                  Company
                </h4>
                <ul className="space-y-3">
                  <li>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link 
                        to="/about" 
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-sm text-muted-foreground/70 hover:text-amber-500 transition-colors duration-200 font-serif"
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
                        className="text-sm text-muted-foreground/70 hover:text-amber-500 transition-colors duration-200 font-serif"
                      >
                        Privacy
                      </Link>
                    </motion.div>
                  </li>
                  <li>
                    <motion.div variants={linkVariants} initial="initial" whileHover="hover">
                      <Link 
                        to="/terms" 
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-sm text-muted-foreground/70 hover:text-amber-500 transition-colors duration-200 font-serif"
                      >
                        Terms
                      </Link>
                    </motion.div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="md:col-span-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-700/5 rounded-2xl blur-xl opacity-60" />
              <div className="relative backdrop-blur-xl bg-background/40 border border-amber-500/20 rounded-2xl p-5 shadow-xl shadow-amber-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground font-serif">Contact Us</h3>
                </div>
                
                {user ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="text-xs text-muted-foreground mb-2 px-1 font-serif italic">
                      Sending as <span className="text-amber-500 font-medium not-italic">{userName || userEmail}</span>
                    </div>
                    <Textarea
                      placeholder="Write your magical message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="bg-background/50 border-amber-500/20 resize-none focus:border-amber-500/50 transition-colors font-serif"
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 transition-all text-white"
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3 font-serif italic">Sign in to send feedback</p>
                    <Link to="/auth">
                      <Button variant="outline" size="sm" className="border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500 font-serif">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar with magical styling */}
          <div className="mt-16 pt-6 relative">
            {/* Thin divider with golden accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground/50 font-serif">
                © 2025 PromptHub. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground/50 flex items-center gap-1 font-serif">
                Made with <Heart className="w-3 h-3 text-amber-500/70 fill-amber-500/70" /> by the team
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
