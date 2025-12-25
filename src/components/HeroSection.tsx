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

      {/* Unifying overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background) / 0.40), hsl(var(--background) / 0.26), hsl(var(--background) / 0.40)), var(--gradient-mesh)",
        }}
      />

      {/* Animated light sweep */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear" as Easing,
          repeatDelay: 2,
        }}
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.05), transparent)",
          width: "50%",
        }}
      />

      {/* Content - Top left positioning */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 pt-24 md:pt-32">
        <motion.div 
          className="flex flex-col items-start"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as Easing,
          }}
        >
          <motion.h1
            className="font-audio text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-foreground"
            style={{ perspective: "1000px" }}
          >
            {words.map((word, wordIndex) => (
              <span key={word} className="block">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${word}-${letterIndex}`}
                    initial={{ 
                      opacity: 0, 
                      y: 50,
                      rotateX: -90,
                      filter: "blur(10px)"
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      rotateX: 0,
                      filter: "blur(0px)"
                    }}
                    transition={{
                      delay: wordIndex * 0.3 + letterIndex * 0.04,
                      duration: 0.6,
                      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
                    }}
                    className={`inline-block ${word === "PROMPTS" ? "text-primary" : ""}`}
                    style={{ 
                      transformStyle: "preserve-3d",
                    }}
                    whileHover={{
                      scale: 1.15,
                      color: "hsl(165 70% 42%)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          {/* Glowing underline */}
          <motion.div
            className="h-1 bg-primary rounded-full mt-4"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "120px", opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" as Easing }}
          />
          <motion.div
            className="h-1 bg-primary/30 rounded-full -mt-1 blur-sm"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "120px", opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" as Easing }}
          />
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as Easing }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ 
              y: [0, 12, 0],
              opacity: [1, 0.3, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as Easing }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
