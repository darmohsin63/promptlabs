import { motion } from "framer-motion";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

interface HeroSectionProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
  loading: boolean;
}

export function HeroSection({}: HeroSectionProps) {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden -mb-px">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0 video-mask-fade"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/ai-face.mp4" type="video/mp4" />
      </video>

      {/* Unifying overlay (same vibe as header/body) */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background) / 0.40), hsl(var(--background) / 0.26), hsl(var(--background) / 0.40)), var(--gradient-mesh)",
        }}
      />

      {/* Content - Top left positioning */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-24 md:pt-32">
        <div className="flex flex-col items-start">
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
        </div>
      </div>
    </section>
  );
}
