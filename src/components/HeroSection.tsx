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
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col overflow-hidden bg-[#0d0d0d]">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight uppercase tracking-tight">
            <span className="text-primary">Hand-crafted</span>{" "}
            AI Prompts
          </h1>
          <p className="mt-3 text-white/50 text-base md:text-lg max-w-xl uppercase tracking-wider text-sm">
            Discover curated prompts crafted by creators, for creators.
          </p>
        </motion.div>

        {/* Featured Cards */}
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
          <div className="h-[400px] flex items-center justify-center">
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
            <p className="text-white/50">
              Discover curated prompts crafted by creators, for creators.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
