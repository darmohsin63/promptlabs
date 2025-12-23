import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, RoundedBox, Float } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FeaturedPrompt } from "@/hooks/useFeaturedPrompts";

type SectionType = "prompt_of_day" | "trending" | "creators_choice";

interface SectionConfig {
  color: string;
  emissive: string;
  distortSpeed: number;
  distortStrength: number;
  lightIntensity: number;
  roughness: number;
}

const SECTION_CONFIGS: Record<SectionType, SectionConfig> = {
  prompt_of_day: {
    color: "#fef3e6",
    emissive: "#ff9966",
    distortSpeed: 0.8,
    distortStrength: 0.04,
    lightIntensity: 0.35,
    roughness: 0.15,
  },
  trending: {
    color: "#e8f4fc",
    emissive: "#66b3ff",
    distortSpeed: 1.2,
    distortStrength: 0.06,
    lightIntensity: 0.5,
    roughness: 0.1,
  },
  creators_choice: {
    color: "#f5f0fa",
    emissive: "#b399d4",
    distortSpeed: 0.4,
    distortStrength: 0.02,
    lightIntensity: 0.25,
    roughness: 0.18,
  },
};

const SECTIONS = [
  { id: "prompt_of_day" as SectionType, label: "Prompt of the Day", shortLabel: "Daily", icon: Sparkles },
  { id: "trending" as SectionType, label: "Trending", shortLabel: "Trending", icon: TrendingUp },
  { id: "creators_choice" as SectionType, label: "Creator's Choice", shortLabel: "Choice", icon: Star },
];

interface GlassSurfaceProps {
  section: SectionType;
  mousePosition: { x: number; y: number };
}

function GlassSurface({ section, mousePosition }: GlassSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [currentConfig, setCurrentConfig] = useState(SECTION_CONFIGS[section]);
  const targetConfig = SECTION_CONFIGS[section];

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating motion
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.015;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;

      // Parallax response
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        mousePosition.x * 0.12,
        0.03
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        mousePosition.y * 0.06,
        0.03
      );
    }

    if (glowRef.current) {
      glowRef.current.rotation.x = meshRef.current?.rotation.x || 0;
      glowRef.current.rotation.y = meshRef.current?.rotation.y || 0;
      glowRef.current.position.x = meshRef.current?.position.x || 0;
      glowRef.current.position.y = meshRef.current?.position.y || 0;
    }

    // Smooth config transitions
    setCurrentConfig((prev) => ({
      ...prev,
      distortSpeed: THREE.MathUtils.lerp(prev.distortSpeed, targetConfig.distortSpeed, 0.015),
      distortStrength: THREE.MathUtils.lerp(prev.distortStrength, targetConfig.distortStrength, 0.015),
      lightIntensity: THREE.MathUtils.lerp(prev.lightIntensity, targetConfig.lightIntensity, 0.015),
    }));
  });

  return (
    <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.08}>
      <group>
        {/* Back glow layer */}
        <mesh ref={glowRef} position={[0, 0, -0.12]}>
          <RoundedBox args={[4.8, 2.8, 0.05]} radius={0.18} smoothness={4}>
            <meshBasicMaterial
              color={targetConfig.emissive}
              transparent
              opacity={0.12}
            />
          </RoundedBox>
        </mesh>

        {/* Main glass surface */}
        <mesh ref={meshRef}>
          <RoundedBox args={[5, 3, 0.12]} radius={0.2} smoothness={8}>
            <MeshDistortMaterial
              color={targetConfig.color}
              emissive={targetConfig.emissive}
              emissiveIntensity={currentConfig.lightIntensity}
              roughness={targetConfig.roughness}
              metalness={0.02}
              distort={currentConfig.distortStrength}
              speed={currentConfig.distortSpeed}
              transparent
              opacity={0.88}
            />
          </RoundedBox>
        </mesh>
      </group>
    </Float>
  );
}

// Subtle ambient particles
function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5 - 0.8;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={30}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#c4c4c4"
        transparent
        opacity={0.35}
        sizeAttenuation
      />
    </points>
  );
}

// Camera parallax controller
function CameraController({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.x * 0.15, 0.015);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.y * 0.08, 0.015);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface LivingPromptCanvasProps {
  promptOfDay: FeaturedPrompt[];
  trending: FeaturedPrompt[];
  creatorsChoice: FeaturedPrompt[];
  className?: string;
}

export function LivingPromptCanvas({
  promptOfDay,
  trending,
  creatorsChoice,
  className,
}: LivingPromptCanvasProps) {
  const [activeSection, setActiveSection] = useState<SectionType>("prompt_of_day");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine available sections
  const availableSections = useMemo(() => {
    const sections: SectionType[] = [];
    if (promptOfDay.length > 0) sections.push("prompt_of_day");
    if (trending.length > 0) sections.push("trending");
    if (creatorsChoice.length > 0) sections.push("creators_choice");
    return sections;
  }, [promptOfDay, trending, creatorsChoice]);

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

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setMousePosition({ x, y });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (containerRef.current && e.touches[0]) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
        const y = -((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

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

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 3D Canvas - the glass surface */}
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="absolute inset-0"
      >
        <CameraController mousePosition={mousePosition} />

        {/* Soft ambient lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 4, 4]} intensity={0.3} color="#ffffff" />
        <pointLight
          position={[-2, 1.5, 2]}
          intensity={0.25}
          color={SECTION_CONFIGS[activeSection].emissive}
        />

        {/* The living glass surface */}
        <GlassSurface section={activeSection} mousePosition={mousePosition} />

        {/* Subtle ambient particles */}
        <AmbientParticles />
      </Canvas>

      {/* Content overlay - embedded on top of the 3D surface */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-md px-6 py-8 text-center pointer-events-auto">
          {/* Section label */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mb-3"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-foreground/5 text-foreground/70 backdrop-blur-sm">
              <Icon className="w-3 h-3" />
              {sectionInfo?.label}
            </div>
          </motion.div>

          {/* Prompt content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSection}-${currentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {currentPrompt ? (
                <Link to={`/prompt/${currentPrompt.prompt.id}`} className="block group">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                    {currentPrompt.prompt.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 max-w-sm mx-auto">
                    {currentPrompt.prompt.description || "Click to explore this prompt"}
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    by <span className="text-foreground/80">{currentPrompt.prompt.author}</span>
                  </p>
                </Link>
              ) : (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
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
            <div className="flex justify-center items-center gap-4 mt-5">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all backdrop-blur-sm"
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
                        ? "w-5 h-1.5 bg-primary"
                        : "w-1.5 h-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/40"
                    }`}
                    aria-label={`Go to prompt ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all backdrop-blur-sm"
                aria-label="Next prompt"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Section switchers */}
          <div className="flex justify-center gap-2 mt-5">
            {availableSections.map((sectionId) => {
              const sectionData = SECTIONS.find((s) => s.id === sectionId);
              if (!sectionData) return null;
              const SectionIcon = sectionData.icon;
              const isActive = activeSection === sectionId;

              return (
                <button
                  key={sectionId}
                  onClick={() => setActiveSection(sectionId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 backdrop-blur-sm ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                  }`}
                >
                  <SectionIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">{sectionData.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export type { SectionType };
