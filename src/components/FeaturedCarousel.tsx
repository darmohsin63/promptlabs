import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Star } from "lucide-react";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

interface FeaturedCarouselProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
}

type TabType = "prompt_of_day" | "trending" | "creators_choice";

const TABS = [
  { id: "prompt_of_day" as TabType, label: "Prompt of the Day", icon: Sparkles },
  { id: "trending" as TabType, label: "Trending", icon: TrendingUp },
  { id: "creators_choice" as TabType, label: "Creator's Choice", icon: Star },
];

export function FeaturedCarousel({ promptOfDay, trending, creatorsChoice }: FeaturedCarouselProps) {
  const [activeTab, setActiveTab] = useState<TabType>("prompt_of_day");
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const getActivePrompts = () => {
    switch (activeTab) {
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

  // Reset index when tab changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swiped left - next tab
        const currentTabIndex = TABS.findIndex(t => t.id === activeTab);
        if (currentTabIndex < TABS.length - 1) {
          setActiveTab(TABS[currentTabIndex + 1].id);
        }
      } else {
        // Swiped right - previous tab
        const currentTabIndex = TABS.findIndex(t => t.id === activeTab);
        if (currentTabIndex > 0) {
          setActiveTab(TABS[currentTabIndex - 1].id);
        }
      }
    }
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

  const getImageUrl = (prompt: FeaturedPrompt) => {
    if (prompt.prompt.image_urls && prompt.prompt.image_urls.length > 0) {
      return prompt.prompt.image_urls[0];
    }
    return prompt.prompt.image_url || "/placeholder.svg";
  };

  if (promptOfDay.length === 0 && trending.length === 0 && creatorsChoice.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const hasItems = 
            (tab.id === "prompt_of_day" && promptOfDay.length > 0) ||
            (tab.id === "trending" && trending.length > 0) ||
            (tab.id === "creators_choice" && creatorsChoice.length > 0);
          
          if (!hasItems) return null;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/50 to-background border border-border/50 group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {activePrompts.length > 0 ? (
          <div className="relative aspect-[16/9] sm:aspect-[21/9]">
            {/* Current Slide */}
            <Link 
              to={`/prompt/${activePrompts[currentIndex]?.prompt.id}`}
              className="block absolute inset-0 group"
            >
              <img
                src={getImageUrl(activePrompts[currentIndex])}
                alt={activePrompts[currentIndex]?.prompt.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  {TABS.find(t => t.id === activeTab)?.icon && (
                    <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {(() => {
                        const Icon = TABS.find(t => t.id === activeTab)?.icon;
                        return Icon ? <Icon className="w-3 h-3" /> : null;
                      })()}
                      {TABS.find(t => t.id === activeTab)?.label}
                    </span>
                  )}
                </div>
                <h3 className="text-white text-lg sm:text-2xl font-bold mb-1 line-clamp-1">
                  {activePrompts[currentIndex]?.prompt.title}
                </h3>
                <p className="text-white/70 text-sm line-clamp-1">
                  by {activePrompts[currentIndex]?.prompt.author}
                </p>
              </div>
            </Link>

            {/* Navigation Arrows */}
            {activePrompts.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.preventDefault(); prevSlide(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 sm:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); nextSlide(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 sm:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {activePrompts.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {activePrompts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex 
                        ? "bg-white w-6" 
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center text-muted-foreground">
            <p>No featured prompts in this section</p>
          </div>
        )}
      </div>

      {/* Swipe Indicator */}
      <p className="text-center text-xs text-muted-foreground mt-2 sm:hidden">
        Swipe left or right to switch sections
      </p>
    </section>
  );
}
