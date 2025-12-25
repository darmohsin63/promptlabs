import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Combine all prompts for the sidebar list
  const allPrompts = [...promptOfDay, ...trending, ...creatorsChoice];
  
  // Get unique prompts (max 5 for sidebar)
  const sidebarPrompts = allPrompts.slice(0, 5);
  
  // Get display cards (2 at a time)
  const getDisplayCards = () => {
    const startIdx = currentIndex * 2;
    return allPrompts.slice(startIdx, startIdx + 2);
  };

  const displayCards = getDisplayCards();
  const totalPages = Math.ceil(allPrompts.length / 2);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (allPrompts.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative mx-auto"
      >
        {/* Main container with dark background */}
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
          <div className="flex">
            {/* Left sidebar - Prompt titles list */}
            <div className="hidden md:flex flex-col w-56 lg:w-64 border-r border-white/10 p-6">
              <div className="space-y-1">
                {sidebarPrompts.map((prompt, idx) => {
                  const isActive = Math.floor(idx / 2) === currentIndex || 
                    (displayCards.some(card => card.prompt.id === prompt.prompt.id));
                  
                  return (
                    <motion.button
                      key={prompt.prompt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setCurrentIndex(Math.floor(idx / 2))}
                      className={`w-full text-left py-3 transition-all duration-200 group ${
                        isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                      }`}
                    >
                      <span className={`text-sm font-bold uppercase tracking-wider line-clamp-1 ${
                        isActive ? "text-white" : "text-white/70"
                      }`}>
                        {prompt.prompt.title}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Right side - Cards grid */}
            <div className="flex-1 p-4 md:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {displayCards.map((prompt, idx) => (
                    <motion.div
                      key={prompt.prompt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="relative"
                    >
                      <Link
                        to={`/prompt/${prompt.prompt.id}`}
                        className="block group"
                      >
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#2a2a2a]">
                          {/* Background image */}
                          {prompt.prompt.image_url ? (
                            <img
                              src={prompt.prompt.image_url}
                              alt={prompt.prompt.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                          )}

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                          {/* Red badge at top */}
                          <div className="absolute top-4 left-4">
                            <div className="bg-primary px-3 py-1 text-white text-[10px] font-bold tracking-widest uppercase">
                              PROMPTHUB
                            </div>
                          </div>

                          {/* Content at bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            {/* Title */}
                            <h3 className="text-white font-bold text-lg md:text-xl uppercase tracking-wide mb-2 line-clamp-2">
                              {prompt.prompt.title}
                            </h3>
                            
                            {/* Author */}
                            <p className="text-white/60 text-xs uppercase tracking-wider">
                              by {prompt.prompt.author}
                            </p>
                          </div>

                          {/* Hover border effect */}
                          <motion.div
                            className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredCard === idx ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${
                          idx === currentIndex
                            ? "w-8 h-2 bg-primary"
                            : "w-2 h-2 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Page ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export type SectionType = "prompt_of_day" | "trending" | "creators_choice";
