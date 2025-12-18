import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
        <Sun className="w-5 h-5 text-muted-foreground" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-10 h-10 rounded-xl bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-foreground animate-scale-in" />
      ) : (
        <Moon className="w-5 h-5 text-foreground animate-scale-in" />
      )}
    </button>
  );
}
