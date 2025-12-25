import { motion } from "framer-motion";
import { DepthMotionHeroCard } from "./DepthMotionHeroCard";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

interface HeroSectionProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
  loading: boolean;
}

export function HeroSection({ promptOfDay, trending, creatorsChoice, loading }: HeroSectionProps) {
  const hasContent = promptOfDay.length > 0 || trending.length > 0 || creatorsChoice.length > 0;

  return (
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col overflow-hidden">
      {/* Dark theme background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-20 md:pt-24 pb-8">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="mb-8 md:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            <span className="relative inline-block">
              Hand-crafted
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>{" "}
            AI{" "}
            <span className="text-muted-foreground">prompts</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-xl">
            Discover curated prompts crafted by creators, for creators.
          </p>
        </motion.div>

        {/* Depth Motion Hero Card */}
        {!loading && hasContent && (
          <DepthMotionHeroCard
            promptOfDay={promptOfDay}
            trending={trending}
            creatorsChoice={creatorsChoice}
            className="w-full"
          />
        )}

        {/* Loading state */}
        {loading && (
          <div className="h-[300px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
            />
          </div>
        )}

        {/* Empty state */}
        {!loading && !hasContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              Discover curated prompts crafted by creators, for creators.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
