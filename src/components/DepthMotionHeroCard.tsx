import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

type SectionType = "prompt_of_day" | "trending" | "creators_choice";

const SECTIONS = [
  { id: "prompt_of_day" as SectionType, label: "Prompt of the Day", shortLabel: "DAILY", icon: Sparkles },
  { id: "trending" as SectionType, label: "Trending", shortLabel: "TRENDING", icon: TrendingUp },
  { id: "creators_choice" as SectionType, label: "Creator's Choice", shortLabel: "CHOICE", icon: Star },
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, 20]);

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

  // Get accent color based on section
  const getAccentStyles = () => {
    switch (activeSection) {
      case "prompt_of_day":
        return { accent: "bg-primary", text: "text-primary" };
      case "trending":
        return { accent: "bg-cyan-500", text: "text-cyan-500" };
      case "creators_choice":
        return { accent: "bg-amber-500", text: "text-amber-500" };
    }
  };

  const accentStyles = getAccentStyles();

  // Get display prompts (max 3 for the cards)
  const displayPrompts = activePrompts.slice(0, 3);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{ y: parallaxY }}
        className="relative mx-auto max-w-6xl"
      >
        {/* Marvel-style layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left sidebar - Section nav & prompt list */}
          <div className="lg:w-64 flex flex-col">
            {/* Section tabs */}
            <div className="flex lg:flex-col gap-2 mb-4 lg:mb-6">
              {availableSections.map((sectionId) => {
                const sectionData = SECTIONS.find((s) => s.id === sectionId);
                if (!sectionData) return null;
                const SectionIcon = sectionData.icon;
                const isActive = activeSection === sectionId;

                return (
                  <button
                    key={sectionId}
                    onClick={() => setActiveSection(sectionId)}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 ${
                      isActive
                        ? `${accentStyles.accent} text-white shadow-lg`
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <SectionIcon className="w-4 h-4" />
                    <span>{sectionData.shortLabel}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl bg-primary -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prompt list */}
            <div className="hidden lg:flex flex-col gap-1.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-1"
                >
                  {activePrompts.slice(0, 5).map((prompt, idx) => (
                    <motion.button
                      key={prompt.prompt.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        idx === currentIndex
                          ? "bg-foreground/10 border-l-2 border-primary"
                          : "hover:bg-foreground/5 border-l-2 border-transparent"
                      }`}
                    >
                      <span className={`text-sm font-medium line-clamp-1 ${
                        idx === currentIndex ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}>
                        {prompt.prompt.title}
                      </span>
                      <span className="text-xs text-muted-foreground/60 line-clamp-1">
                        {prompt.prompt.author}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right side - Featured cards grid */}
          <div className="flex-1">
            {/* Main featured card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`main-${activeSection}-${currentIndex}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="relative mb-4"
              >
                <Link
                  to={currentPrompt ? `/prompt/${currentPrompt.prompt.id}` : "/"}
                  className="block group"
                >
                  <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-border/30 shadow-xl">
                    {/* Background image */}
                    {currentPrompt?.prompt.image_url ? (
                      <img
                        src={currentPrompt.prompt.image_url}
                        alt={currentPrompt.prompt.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full ${accentStyles.accent} opacity-20`} />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    {/* Red accent bar */}
                    <div className={`absolute top-0 left-0 w-2 h-full ${accentStyles.accent}`} />

                    {/* Section badge */}
                    <div className={`absolute top-4 left-6 px-3 py-1 ${accentStyles.accent} text-white text-xs font-bold tracking-wider uppercase`}>
                      {sectionInfo?.shortLabel}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <motion.h2
                        className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {currentPrompt?.prompt.title || "Discover Prompts"}
                      </motion.h2>
                      <motion.p
                        className="text-white/70 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        {currentPrompt?.prompt.description || "Hand-crafted AI prompts that actually work"}
                      </motion.p>
                      <motion.div
                        className="flex items-center gap-3"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-white/50 text-sm">
                          by <span className="text-white/80 font-medium">{currentPrompt?.prompt.author}</span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </motion.div>
                    </div>

                    {/* Hover shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Secondary cards row */}
            {displayPrompts.length > 1 && (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {displayPrompts.slice(1, 3).map((prompt, idx) => (
                  <motion.div
                    key={prompt.prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Link
                      to={`/prompt/${prompt.prompt.id}`}
                      className="block group relative"
                    >
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/30 shadow-lg">
                        {prompt.prompt.image_url ? (
                          <img
                            src={prompt.prompt.image_url}
                            alt={prompt.prompt.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Title label */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-sm md:text-base line-clamp-1 mb-1">
                            {prompt.prompt.title}
                          </h3>
                          <span className="text-white/60 text-xs">
                            {prompt.prompt.author}
                          </span>
                        </div>

                        {/* Hover indicator */}
                        <motion.div
                          className={`absolute top-0 left-0 w-1 h-full ${accentStyles.accent}`}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: hoveredCard === idx ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ originY: 0 }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Navigation dots - mobile */}
            {activePrompts.length > 1 && (
              <div className="flex lg:hidden justify-center items-center gap-3 mt-4">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
                  aria-label="Previous prompt"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  {activePrompts.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        idx === currentIndex
                          ? `w-6 h-1.5 ${accentStyles.accent}`
                          : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Go to prompt ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
                  aria-label="Next prompt"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export type { SectionType };
