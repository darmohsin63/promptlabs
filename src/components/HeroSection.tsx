import { motion } from "framer-motion";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

interface HeroSectionProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
  loading: boolean;
}

export function HeroSection({ }: HeroSectionProps) {
  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden hero-gradient">
      
      {/* Background Video */}
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay 
        muted 
        loop 
        playsInline
      >
        <source src="/videos/ai-face.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay to blend with site theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background z-[1]" />
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'var(--gradient-mesh)' }} />

      {/* Floating Orbs for depth */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-24">
        
        {/* Hero Content */}
        <div className="flex flex-col items-start">
          
          {/* Title and Description */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="font-audio text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-foreground"
            >
              <motion.span 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="inline-block"
              >
                HAND-CRAFTED
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="inline-block"
              >
                AI
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="inline-block text-primary"
              >
                PROMPTS
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed max-w-md"
            >
              Discover curated prompts crafted by creators, for creators. Experience the future of AI interaction.
            </motion.p>
          </div>

        </div>
      </div>
    </section>
  );
}
