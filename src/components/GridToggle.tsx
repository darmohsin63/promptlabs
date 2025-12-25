import { motion } from "framer-motion";
import { LayoutGrid, Grid3X3 } from "lucide-react";

interface GridToggleProps {
  gridSize: "normal" | "compact";
  onToggle: () => void;
}

export function GridToggle({ gridSize, onToggle }: GridToggleProps) {
  const isCompact = gridSize === "compact";

  return (
    <motion.button
      onClick={onToggle}
      className="relative flex items-center justify-center w-8 h-8 rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.1] transition-colors"
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={isCompact ? "Switch to normal grid" : "Switch to compact grid"}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isCompact ? 180 : 0,
          scale: 1
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {isCompact ? (
          <Grid3X3 className="w-4 h-4 text-foreground/80" />
        ) : (
          <LayoutGrid className="w-4 h-4 text-foreground/80" />
        )}
      </motion.div>
    </motion.button>
  );
}
