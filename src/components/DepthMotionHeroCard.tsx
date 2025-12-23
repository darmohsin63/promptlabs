import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

type SectionType = "prompt_of_day" | "trending" | "creators_choice";

const SECTIONS = [
  { id: "prompt_of_day" as SectionType, label: "Prompt of the Day", shortLabel: "Daily", icon: Sparkles },
  { id: "trending" as SectionType, label: "Trending", shortLabel: "Trending", icon: TrendingUp },
  { id: "creators_choice" as SectionType, label: "Creator's Choice", shortLabel: "Choice", icon: Star },
];

interface DepthMotionHeroCardProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
  className?: string;
}

export function DepthMotionHeroCard({
  promptOfDay,
  trending,
  creatorsChoice,
  className,
}: DepthMotionHeroCardProps) {
  const [activeSection, setActiveSection] = useState<SectionType>("prompt_of_day");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, 30]);
  const rotateX = useTransform(scrollY, [0, 400], [3, 0]);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });

  // Determine available sections
  const availableSections = (() => {
    const sections: SectionType[] = [];
    if (promptOfDay.length > 0) sections.push("prompt_of_day");
    if (trending.length > 0) sections.push("trending");
    if (creatorsChoice.length > 0) sections.push("creators_choice");
    return sections;
  })();

  // Get active prompts for current section
  const getActivePrompts = (): FeaturedPrompt[] => {
    switch (activeSection) {
      case "prompt_of_day":
        return promptOfDay;
      case "trending":
        return trending;
      case "creators_choice":
        return creatorsChoice;
      default:
        return [];
    }
  };

  const activePrompts = getActivePrompts();
  const currentPrompt = activePrompts[currentIndex] || null;
  const sectionInfo = SECTIONS.find((s) => s.id === activeSection);
  const Icon = sectionInfo?.icon || Sparkles;

  // Reset index when section changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeSection]);

  // Set initial section to first available
  useEffect(() => {
    if (availableSections.length > 0 && !availableSections.includes(activeSection)) {
      setActiveSection(availableSections[0]);
    }
  }, [availableSections, activeSection]);

  // Mouse tracking for subtle tilt
  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const nextSlide = () => {
    if (activePrompts.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % activePrompts.length);
    }
  };

  const prevSlide = () => {
    if (activePrompts.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + activePrompts.length) % activePrompts.length);
    }
  };

  if (availableSections.length === 0) {
    return null;
  }

  // Section-based accent colors
  const getAccentColor = () => {
    switch (activeSection) {
      case "prompt_of_day":
        return "from-amber-500/10 to-orange-500/5";
      case "trending":
        return "from-sky-500/10 to-blue-500/5";
      case "creators_choice":
        return "from-violet-500/10 to-purple-500/5";
    }
  };

  const getGlowColor = () => {
    switch (activeSection) {
      case "prompt_of_day":
        return "shadow-amber-500/5";
      case "trending":
        return "shadow-sky-500/5";
      case "creators_choice":
        return "shadow-violet-500/5";
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{
          y: parallaxY,
          rotateX: springRotateX,
          transformPerspective: 1200,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative mx-auto max-w-2xl"
      >
        {/* Main Card */}
        <motion.div
          animate={{
            rotateX: isHovered ? -mousePosition.y * 2 : 0,
            rotateY: isHovered ? mousePosition.x * 3 : 0,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`
            relative overflow-hidden rounded-3xl
            bg-gradient-to-br from-background/95 via-background/90 to-background/85
            backdrop-blur-xl border border-border/40
            shadow-2xl ${getGlowColor()}
            transition-shadow duration-500
          `}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Light sweep animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: ["100%", "-100%"], opacity: [0, 0.3, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 8,
              ease: "easeInOut",
            }}
          >
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          </motion.div>

          {/* Subtle accent gradient overlay */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-br ${getAccentColor()} pointer-events-none`}
          />

          {/* Card content */}
          <div className="relative z-10 px-8 py-10 sm:px-12 sm:py-14">
            {/* Section label */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-foreground/5 text-foreground/70">
                <Icon className="w-3.5 h-3.5" />
                {sectionInfo?.label}
              </div>
            </motion.div>

            {/* Prompt content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection}-${currentIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="text-center"
              >
                {currentPrompt ? (
                  <Link to={`/prompt/${currentPrompt.prompt.id}`} className="block group">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                      {currentPrompt.prompt.title}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-2 max-w-md mx-auto leading-relaxed">
                      {currentPrompt.prompt.description || "Click to explore this prompt"}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      by <span className="text-foreground/70 font-medium">{currentPrompt.prompt.author}</span>
                    </p>
                  </Link>
                ) : (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                      Discover Prompts
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Hand-crafted AI prompts that actually work
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            {activePrompts.length > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className="p-2.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all duration-200"
                  aria-label="Previous prompt"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  {activePrompts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        idx === currentIndex
                          ? "w-6 h-1.5 bg-primary"
                          : "w-1.5 h-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                      }`}
                      aria-label={`Go to prompt ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-2.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all duration-200"
                  aria-label="Next prompt"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Section switchers */}
            <div className="flex justify-center gap-2 mt-6">
              {availableSections.map((sectionId) => {
                const sectionData = SECTIONS.find((s) => s.id === sectionId);
                if (!sectionData) return null;
                const SectionIcon = sectionData.icon;
                const isActive = activeSection === sectionId;

                return (
                  <button
                    key={sectionId}
                    onClick={() => setActiveSection(sectionId)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                    }`}
                  >
                    <SectionIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{sectionData.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom soft shadow for depth */}
          <div className="absolute -bottom-1 left-4 right-4 h-6 bg-gradient-to-t from-foreground/[0.02] to-transparent rounded-b-3xl pointer-events-none" />
        </motion.div>

        {/* External shadow for depth illusion */}
        <motion.div
          animate={{
            scale: isHovered ? 1.02 : 1,
            opacity: isHovered ? 0.6 : 0.4,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-b from-foreground/[0.02] to-foreground/[0.06] blur-2xl"
        />
      </motion.div>
    </div>
  );
}

export type { SectionType };
