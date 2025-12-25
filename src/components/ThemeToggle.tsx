import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted/50" />
    );
  }

  return (
    <motion.button
      onClick={handleToggle}
      className="relative flex items-center justify-center w-8 h-8 rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.1] transition-colors"
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDark ? 0 : 180,
          scale: 1
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-foreground/80" />
        ) : (
          <Sun className="w-4 h-4 text-foreground/80" />
        )}
      </motion.div>
    </motion.button>
  );
}
