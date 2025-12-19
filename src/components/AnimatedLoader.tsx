import { motion } from "framer-motion";

export function AnimatedLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden relative">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-secondary/30 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated circles */}
        <div className="relative w-24 h-24">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-accent/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner pulsing circle */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-accent"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Orbiting dots */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-primary rounded-full"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "-6px",
                marginLeft: "-6px",
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI) / 2) * 40, 0],
                y: [0, Math.sin((i * Math.PI) / 2) * 40, 0],
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Loading text with wave animation */}
        <div className="flex items-center gap-1">
          {"Loading".split("").map((letter, i) => (
            <motion.span
              key={i}
              className="text-xl font-medium text-foreground"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            >
              {letter}
            </motion.span>
          ))}
          {/* Animated dots */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={`dot-${i}`}
              className="text-xl font-medium text-primary"
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            >
              .
            </motion.span>
          ))}
        </div>

        {/* Subtle tagline */}
        <motion.p
          className="text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Preparing something amazing
        </motion.p>
      </div>
    </div>
  );
}
