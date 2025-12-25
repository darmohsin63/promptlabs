import { motion } from "framer-motion";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

interface HeroSectionProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
  loading: boolean;
}

export function HeroSection({ promptOfDay, trending, creatorsChoice, loading }: HeroSectionProps) {
  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center bg-background overflow-hidden">
      
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

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-background/40 z-[1]" />

      {/* Gradient Orb */}
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-primary/30 rounded-full blur-[100px] opacity-40 z-[2]" />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-24">
        
        {/* Hero Content */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Main Content */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 md:gap-8">
            
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

            {/* Glass Panel - Featured Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-4 md:p-6 w-max"
            >
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">
                Featured Collections
              </h2>
              <div className="flex gap-6 text-foreground">
                {loading ? (
                  <div className="flex gap-4">
                    <div className="w-16 h-12 bg-muted rounded animate-pulse" />
                    <div className="w-16 h-12 bg-muted rounded animate-pulse" />
                    <div className="w-16 h-12 bg-muted rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="text-center"
                    >
                      <span className="block text-2xl font-bold text-primary">
                        {promptOfDay.length}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">Daily</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                      className="text-center"
                    >
                      <span className="block text-2xl font-bold text-primary">
                        {trending.length}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">Trending</span>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      className="text-center"
                    >
                      <span className="block text-2xl font-bold text-primary">
                        {creatorsChoice.length}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">Curated</span>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <a 
                href="#prompts" 
                className="inline-block bg-foreground text-background text-lg font-light px-8 py-4 rounded-full border border-border hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore Prompts
              </a>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Bottom gradient fade to blend with content below */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
