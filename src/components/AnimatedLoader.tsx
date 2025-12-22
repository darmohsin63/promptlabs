import { motion } from "framer-motion";

export function AnimatedLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden relative">
      {/* Soft gradient background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px]" />
      </div>

      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Glassmorphism card */}
        <motion.div
          className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Spinning glass ring */}
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-transparent"
              style={{
                borderTopColor: "hsl(var(--primary) / 0.6)",
                borderRightColor: "hsl(var(--primary) / 0.2)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner glow dot */}
            <motion.div
              className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 backdrop-blur-sm"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="text-sm font-medium text-foreground/70 tracking-wide">
            Loading
          </span>
          
          {/* Three dots indicator */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/60"
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
