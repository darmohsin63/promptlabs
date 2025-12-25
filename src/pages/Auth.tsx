import { useState, useEffect, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Robot3D } from "@/components/Robot3D";
import { Mail, Lock, User, ArrowRight, Cpu, Github, Twitter } from "lucide-react";
import { motion } from "framer-motion";

// Magical floating orbs around social icons
const MagicalOrbs = () => {
  const orbs = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    angle: (i * 60) * (Math.PI / 180),
    delay: i * 0.2,
  }));

  return (
    <>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute w-2 h-2 rounded-full bg-amber-400/60"
          style={{
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [
              Math.cos(orb.angle) * 40,
              Math.cos(orb.angle + Math.PI) * 40,
              Math.cos(orb.angle) * 40,
            ],
            y: [
              Math.sin(orb.angle) * 40,
              Math.sin(orb.angle + Math.PI) * 40,
              Math.sin(orb.angle) * 40,
            ],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

// Animated Social Icon Button with magical effects
const MagicalSocialButton = ({ 
  icon: Icon, 
  label, 
  color, 
  delay,
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  color: string;
  delay: number;
  onClick?: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative group"
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.6, 
        type: "spring", 
        bounce: 0.4 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Outer magical ring */}
      <motion.div
        className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${color}40, transparent, ${color}40, transparent)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Pulsing glow */}
      <motion.div
        className="absolute -inset-2 rounded-full blur-md"
        style={{ backgroundColor: `${color}30` }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Inner button */}
      <div 
        className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 overflow-hidden"
        style={{ 
          backgroundColor: `${color}15`,
          borderColor: `${color}40`,
          boxShadow: `0 0 20px ${color}20, inset 0 0 20px ${color}10`,
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
        
        {/* Icon */}
        <Icon 
          className="w-6 h-6 md:w-7 md:h-7 relative z-10 transition-transform duration-300 group-hover:scale-110" 
          style={{ color }}
        />
      </div>
      
      {/* Label */}
      <motion.span
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-serif whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color }}
      >
        {label}
      </motion.span>
    </motion.button>
  );
};

// Google icon component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// LinkedIn icon component
const LinkedInIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created!",
            description: "You can now start creating prompts.",
          });
          navigate("/");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming Soon",
      description: `${provider} login will be available soon!`,
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D Robot Background */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="w-16 h-16 text-primary/20 animate-pulse" />
        </div>
      }>
        <Robot3D />
      </Suspense>

      <Header />
      
      <main className="container pt-20 pb-12 px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 animate-fade-up">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center mb-6 shadow-glow animate-glow-pulse">
              <Cpu className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-serif">
              {isLogin ? "Welcome back" : "Join the future"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {isLogin
                ? "Sign in to access your prompts"
                : "Create your account and start exploring"}
            </p>
          </div>

          {/* Centered Social Icons with Extraordinary Animation */}
          <div className="flex justify-center items-center gap-6 mb-8 relative">
            <MagicalOrbs />
            
            <MagicalSocialButton
              icon={GoogleIcon}
              label="Google"
              color="#EA4335"
              delay={0.1}
              onClick={() => handleSocialLogin("Google")}
            />
            
            <MagicalSocialButton
              icon={Github}
              label="GitHub"
              color="#ffffff"
              delay={0.2}
              onClick={() => handleSocialLogin("GitHub")}
            />
            
            <MagicalSocialButton
              icon={Twitter}
              label="Twitter"
              color="#1DA1F2"
              delay={0.3}
              onClick={() => handleSocialLogin("Twitter")}
            />
            
            <MagicalSocialButton
              icon={LinkedInIcon}
              label="LinkedIn"
              color="#0A66C2"
              delay={0.4}
              onClick={() => handleSocialLogin("LinkedIn")}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <span className="text-xs text-muted-foreground font-serif">or continue with email</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          </div>

          <div className="glass-panel animate-fade-up stagger-1 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Dar Mohsin"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input-field pl-11"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="darmohsin63@prompthub.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary h-12 text-base font-serif"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Please wait...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline font-medium font-serif"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-muted-foreground font-serif">
            Are you an admin?{" "}
            <Link to="/admin" className="text-primary hover:underline font-medium">
              Admin Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
