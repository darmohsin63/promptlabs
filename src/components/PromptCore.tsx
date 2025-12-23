import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

type SectionType = "prompt_of_day" | "trending" | "creators_choice";

interface CoreConfig {
  color: string;
  emissive: string;
  distortSpeed: number;
  distortStrength: number;
  scale: number;
  glowIntensity: number;
}

const SECTION_CONFIGS: Record<SectionType, CoreConfig> = {
  prompt_of_day: {
    color: "#ff9966",
    emissive: "#ff6633",
    distortSpeed: 2,
    distortStrength: 0.4,
    scale: 1.05,
    glowIntensity: 1.2,
  },
  trending: {
    color: "#66ccff",
    emissive: "#3399ff",
    distortSpeed: 4,
    distortStrength: 0.5,
    scale: 1.0,
    glowIntensity: 1.5,
  },
  creators_choice: {
    color: "#cc99ff",
    emissive: "#9966cc",
    distortSpeed: 1.5,
    distortStrength: 0.3,
    scale: 1.02,
    glowIntensity: 1.0,
  },
};

// Inner energy streams
function EnergyStreams({ section }: { section: SectionType }) {
  const config = SECTION_CONFIGS[section];
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3 * (config.distortSpeed / 2);
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const streams = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      radius: 0.3 + Math.random() * 0.4,
      tubeRadius: 0.02 + Math.random() * 0.03,
      rotationY: (i / 8) * Math.PI * 2,
      rotationX: Math.random() * 0.5,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {streams.map((stream, i) => (
        <mesh
          key={i}
          rotation={[stream.rotationX, stream.rotationY, 0]}
        >
          <torusGeometry args={[stream.radius, stream.tubeRadius, 8, 32]} />
          <meshBasicMaterial
            color={config.emissive}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main organic core shape
function OrganicCore({ section, mousePosition }: { section: SectionType; mousePosition: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = SECTION_CONFIGS[section];
  const [targetConfig, setTargetConfig] = useState(config);
  
  useEffect(() => {
    setTargetConfig(SECTION_CONFIGS[section]);
  }, [section]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle morph over time
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
      
      // Parallax response to mouse
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        mousePosition.x * 0.3,
        0.05
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        mousePosition.y * 0.2,
        0.05
      );
      
      // Smooth scale transition
      const currentScale = meshRef.current.scale.x;
      const targetScale = targetConfig.scale;
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(currentScale, targetScale, 0.02)
      );
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} scale={config.scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={targetConfig.color}
          emissive={targetConfig.emissive}
          emissiveIntensity={0.3 * targetConfig.glowIntensity}
          roughness={0.1}
          metalness={0.2}
          distort={targetConfig.distortStrength}
          speed={targetConfig.distortSpeed}
          transparent
          opacity={0.85}
        />
      </mesh>
      <EnergyStreams section={section} />
    </Float>
  );
}

// Outer glass shell
function GlassShell({ section }: { section: SectionType }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = SECTION_CONFIGS[section];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.4}>
      <dodecahedronGeometry args={[1, 0]} />
      <MeshDistortMaterial
        color="#ffffff"
        roughness={0}
        metalness={0.1}
        distort={0.15}
        speed={1}
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// Floating particles for depth
function FloatingParticles({ section }: { section: SectionType }) {
  const pointsRef = useRef<THREE.Points>(null);
  const config = SECTION_CONFIGS[section];

  const particles = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={config.emissive}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Camera controller for parallax
function CameraController({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.x * 0.5, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.y * 0.3 + 0.5, 0.02);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

interface PromptCoreProps {
  activeSection: SectionType;
  className?: string;
}

export function PromptCore({ activeSection, className }: PromptCoreProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <CameraController mousePosition={mousePosition} />
        
        {/* Soft ambient light */}
        <ambientLight intensity={0.4} />
        
        {/* Main directional light */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          color="#ffffff"
        />
        
        {/* Accent lights based on section */}
        <pointLight
          position={[-3, 2, 2]}
          intensity={1}
          color={SECTION_CONFIGS[activeSection].emissive}
        />
        <pointLight
          position={[3, -2, 2]}
          intensity={0.5}
          color={SECTION_CONFIGS[activeSection].color}
        />
        
        {/* The main core */}
        <OrganicCore section={activeSection} mousePosition={mousePosition} />
        <GlassShell section={activeSection} />
        <FloatingParticles section={activeSection} />
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

export type { SectionType };
