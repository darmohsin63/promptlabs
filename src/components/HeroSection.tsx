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
    <section className="relative min-h-[40vh] md:min-h-[45vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Clean off-white background with subtle grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50/80 via-background to-background dark:from-stone-950/50 dark:via-background dark:to-background" />
      
      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Depth fog */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_75%)]" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-20 pb-4">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-6 md:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            <span className="relative inline-block">
              Hand-crafted
              <motion.span
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 md:h-[3px] bg-gradient-to-r from-primary to-primary/60 rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>{" "}
            AI{" "}
            <span className="relative inline-block">
              prompts
              <motion.span
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 md:h-[3px] bg-gradient-to-r from-primary/60 to-primary rounded-full"
                initial={{ scaleX: 0, originX: 1 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>
            <span className="text-muted-foreground"> that work.</span>
          </h1>
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-muted-foreground/15 flex justify-center pt-2"
        >
          <div className="w-0.5 h-1.5 rounded-full bg-muted-foreground/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
