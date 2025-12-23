import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PromptCore, SectionType } from "./PromptCore";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

interface HeroSectionProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
  loading: boolean;
}

const SECTIONS = [
  { id: "prompt_of_day" as SectionType, label: "Prompt of the Day", icon: Sparkles },
  { id: "trending" as SectionType, label: "Trending", icon: TrendingUp },
  { id: "creators_choice" as SectionType, label: "Creator's Choice", icon: Star },
];

export function HeroSection({ promptOfDay, trending, creatorsChoice, loading }: HeroSectionProps) {
  const [activeSection, setActiveSection] = useState<SectionType>("prompt_of_day");
  const [currentIndex, setCurrentIndex] = useState(0);

  const getActivePrompts = () => {
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
  const hasContent = promptOfDay.length > 0 || trending.length > 0 || creatorsChoice.length > 0;

  // Reset index when section changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeSection]);

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

  const getImageUrl = (prompt: FeaturedPrompt) => {
    if (prompt.prompt.image_urls && prompt.prompt.image_urls.length > 0) {
      return prompt.prompt.image_urls[0];
    }
    return prompt.prompt.image_url || "/placeholder.svg";
  };

  const availableSections = SECTIONS.filter((section) => {
    if (section.id === "prompt_of_day") return promptOfDay.length > 0;
    if (section.id === "trending") return trending.length > 0;
    if (section.id === "creators_choice") return creatorsChoice.length > 0;
    return false;
  });

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient - soft neutral */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 via-background to-background dark:from-amber-950/10 dark:via-background dark:to-background" />
      
      {/* Depth fog effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      
      {/* Subtle light rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] opacity-20 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-24 pb-8">
        {/* Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            <span className="relative inline-block">
              Hand-crafted
              <motion.span 
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>{" "}
            AI{" "}
            <span className="relative inline-block">
              prompts
              <motion.span 
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>
            <br className="md:hidden" />
            <span className="text-muted-foreground"> that actually work.</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Discover curated prompts crafted by creators, for creators.
          </p>
        </motion.div>

        {/* 3D Prompt Core */}
        {!loading && hasContent && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="relative h-[300px] sm:h-[350px] md:h-[400px] mb-6"
          >
            <PromptCore activeSection={activeSection} className="w-full h-full" />
            
            {/* Floating section chips */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 md:gap-3">
              {availableSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 backdrop-blur-md ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/30"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">{section.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Featured prompt preview */}
        {!loading && activePrompts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative max-w-2xl mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSection}-${currentIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={`/prompt/${activePrompts[currentIndex]?.prompt.id}`}
                  className="group block p-4 md:p-5 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                      <img
                        src={getImageUrl(activePrompts[currentIndex])}
                        alt={activePrompts[currentIndex]?.prompt.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {activePrompts[currentIndex]?.prompt.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {activePrompts[currentIndex]?.prompt.description || "Click to explore this prompt"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        by <span className="text-foreground">{activePrompts[currentIndex]?.prompt.author}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            {activePrompts.length > 1 && (
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border/30"
                  aria-label="Previous prompt"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  {activePrompts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        idx === currentIndex 
                          ? "w-6 h-2 bg-primary" 
                          : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Go to prompt ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border/30"
                  aria-label="Next prompt"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="h-[300px] flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
