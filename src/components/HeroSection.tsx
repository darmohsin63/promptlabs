import { motion, Easing } from "framer-motion";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

interface HeroSectionProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
  loading: boolean;
}

export function HeroSection({}: HeroSectionProps) {
  const words = ["HAND-CRAFTED", "AI", "PROMPTS"];

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

      {/* Subtle overlay that breathes with the video */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        animate={{
          background: [
            "linear-gradient(to bottom, hsl(var(--background) / 0.35), hsl(var(--background) / 0.20), hsl(var(--background) / 0.35))",
            "linear-gradient(to bottom, hsl(var(--background) / 0.40), hsl(var(--background) / 0.25), hsl(var(--background) / 0.40))",
            "linear-gradient(to bottom, hsl(var(--background) / 0.35), hsl(var(--background) / 0.20), hsl(var(--background) / 0.35))",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut" as Easing,
        }}
      />

      {/* Mesh gradient */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none opacity-60"
        style={{ background: "var(--gradient-mesh)" }}
      />

      {/* Content - Top left positioning */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-24 md:pt-32">
        <motion.h1
          className="font-audio text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-foreground"
          style={{ perspective: "1000px" }}
        >
          {words.map((word, wordIndex) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                className={`inline-block ${word === "PROMPTS" ? "text-primary" : ""}`}
                initial={{ 
                  y: "100%",
                  opacity: 0,
                }}
                animate={{ 
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: wordIndex * 0.15,
                  duration: 0.8,
                  ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>
      </div>
    </section>
  );
}
