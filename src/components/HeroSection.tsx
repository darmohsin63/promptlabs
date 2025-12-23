import { motion } from "framer-motion";
import { LivingPromptCanvas } from "./LivingPromptCanvas";
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
    <section className="relative min-h-[80vh] md:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Clean neutral gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-background to-background dark:from-stone-950/30 dark:via-background dark:to-background" />

      {/* Subtle depth fog */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_80%)]" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-20">
        {/* Headline - above the canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-4 md:mb-6"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            <span className="relative inline-block">
              Hand-crafted
              <motion.span
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>{" "}
            AI{" "}
            <span className="relative inline-block">
              prompts
              <motion.span
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-accent to-primary rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>
            <span className="text-muted-foreground"> that work.</span>
          </h1>
        </motion.div>

        {/* The unified 3D Living Prompt Canvas */}
        {!loading && hasContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative h-[380px] sm:h-[420px] md:h-[460px]"
          >
            <LivingPromptCanvas
              promptOfDay={promptOfDay}
              trending={trending}
              creatorsChoice={creatorsChoice}
              className="w-full h-full"
            />
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="h-[380px] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        )}

        {/* Empty state - still show headline only */}
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
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-muted-foreground/20 flex justify-center pt-1.5"
        >
          <div className="w-0.5 h-1.5 rounded-full bg-muted-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
