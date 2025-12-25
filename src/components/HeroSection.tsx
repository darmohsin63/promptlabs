import { motion } from "framer-motion";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

interface HeroSectionProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
  loading: boolean;
}

export function HeroSection({ promptOfDay, trending, creatorsChoice, loading }: HeroSectionProps) {
  const hasContent = promptOfDay.length > 0 || trending.length > 0 || creatorsChoice.length > 0;

  return (
    <section className="relative min-h-[100dvh] w-full p-2 sm:p-4 md:p-8 lg:p-12 flex items-center justify-center bg-[#49657B]">
      {/* Main Container */}
      <div className="relative w-full h-full min-h-[calc(100dvh-6rem)] max-w-[1400px] bg-white rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl isolate">
        
        {/* Background Video */}
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/videos/ai-face.mp4" type="video/mp4" />
        </video>

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-white/10 z-[1]" />

        {/* Top Left Decorative Shape */}
        <svg 
          className="absolute top-0 left-0 w-32 md:w-64 text-white transform -scale-x-100 -scale-y-100 z-10 pointer-events-none" 
          viewBox="0 0 100 100" 
          fill="currentColor"
        >
          <path d="M0 0 L100 0 C 60 0 40 40 40 100 L0 100 Z" />
        </svg>

        {/* Bottom Right Decorative Shape */}
        <svg 
          className="absolute bottom-0 right-0 w-40 md:w-80 text-white z-10 pointer-events-none" 
          viewBox="0 0 100 100" 
          fill="currentColor"
        >
          <path d="M0 100 L100 100 L100 0 C 100 60 60 100 0 100 Z" />
        </svg>

        {/* Gradient Orb */}
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-blue-500 rounded-full blur-[100px] opacity-40 z-[2]" />

        {/* Content Container */}
        <div className="relative z-20 h-full min-h-[calc(100dvh-6rem)] flex flex-col justify-between p-4 md:p-6 lg:p-8">
          
          {/* Header Space (matches existing header position) */}
          <div className="h-16" />

          {/* Hero Content */}
          <div className="flex-1 flex flex-col md:flex-row items-start md:items-center relative">
            
            {/* Main Content */}
            <div className="w-full md:w-1/2 px-4 md:px-12 lg:px-20 flex flex-col justify-center h-full">
              <div className="max-w-lg flex flex-col gap-6 md:gap-8">
                
                {/* Title and Description */}
                <div className="space-y-4">
                  <motion.h1 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="font-audio text-4xl sm:text-5xl lg:text-7xl leading-[1.1] text-gray-900"
                  >
                    <motion.span 
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                      className="inline-block"
                    >
                      HAND-CRAFTED
                    </motion.span>
                    <br />
                    <motion.span 
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="inline-block"
                    >
                      AI
                    </motion.span>
                    <br />
                    <motion.span 
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="inline-block text-blue-700"
                    >
                      PROMPTS
                    </motion.span>
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="text-gray-700 text-lg md:text-xl font-light leading-relaxed max-w-md"
                  >
                    Discover curated prompts crafted by creators, for creators. Experience the future of AI interaction.
                  </motion.p>
                </div>

                {/* Glass Panel - Featured Stats */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
                  className="bg-white/15 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 w-max"
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">
                    Featured Collections
                  </h2>
                  <div className="flex gap-6 text-gray-800">
                    {loading ? (
                      <div className="flex gap-4">
                        <div className="w-16 h-12 bg-white/20 rounded animate-pulse" />
                        <div className="w-16 h-12 bg-white/20 rounded animate-pulse" />
                        <div className="w-16 h-12 bg-white/20 rounded animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                          className="text-center"
                        >
                          <span className="block text-2xl font-bold text-blue-600">
                            {promptOfDay.length}
                          </span>
                          <span className="text-xs uppercase tracking-wide">Daily</span>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.9 }}
                          className="text-center"
                        >
                          <span className="block text-2xl font-bold text-blue-600">
                            {trending.length}
                          </span>
                          <span className="text-xs uppercase tracking-wide">Trending</span>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 1 }}
                          className="text-center"
                        >
                          <span className="block text-2xl font-bold text-blue-600">
                            {creatorsChoice.length}
                          </span>
                          <span className="text-xs uppercase tracking-wide">Curated</span>
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>

              </div>
            </div>

            {/* CTA Button - Bottom Right */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="w-full md:w-auto md:absolute md:bottom-12 md:right-12 p-4 md:p-0 flex justify-center md:block mt-8 md:mt-0"
            >
              <a 
                href="#prompts" 
                className="inline-block bg-gray-900 text-white text-lg font-light px-8 py-4 rounded-full border border-gray-700 hover:bg-blue-600 hover:border-blue-500 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore Prompts
              </a>
            </motion.div>
          </div>

          {/* Bottom Spacer */}
          <div className="h-8" />
        </div>
      </div>
    </section>
  );
}
