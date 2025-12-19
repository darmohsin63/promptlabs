import { useRef, useMemo, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Box, Cylinder, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const RobotHead = memo(function RobotHead() {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    
    if (leftEyeRef.current && rightEyeRef.current) {
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      const material = leftEyeRef.current.material as THREE.MeshStandardMaterial;
      const material2 = rightEyeRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = intensity;
      material2.emissiveIntensity = intensity;
    }
  });

  const primaryColor = useMemo(() => new THREE.Color("#20c997"), []);
  const accentColor = useMemo(() => new THREE.Color("#f59e0b"), []);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={headRef}>
        {/* Main Head - simplified geometry */}
        <RoundedBox args={[2.2, 2.5, 2]} radius={0.3} smoothness={2}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Face plate */}
        <RoundedBox args={[1.8, 1.8, 0.3]} radius={0.15} position={[0, 0, 1]} smoothness={2}>
          <meshStandardMaterial color="#16213e" metalness={0.7} roughness={0.3} />
        </RoundedBox>

        {/* Eyes - reduced segments */}
        <Sphere ref={leftEyeRef} args={[0.25, 16, 16]} position={[-0.5, 0.3, 1.15]}>
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.2}
          />
        </Sphere>

        <Sphere ref={rightEyeRef} args={[0.25, 16, 16]} position={[0.5, 0.3, 1.15]}>
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.2}
          />
        </Sphere>

        {/* Mouth */}
        <RoundedBox args={[0.8, 0.15, 0.1]} radius={0.05} position={[0, -0.5, 1.15]} smoothness={1}>
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
        </RoundedBox>

        {/* Antenna - reduced segments */}
        <Cylinder args={[0.15, 0.2, 0.3, 8]} position={[0, 1.4, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.05, 0.05, 0.6, 6]} position={[0, 1.8, 0]}>
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
        </Cylinder>
        <Sphere args={[0.12, 8, 8]} position={[0, 2.15, 0]}>
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
        </Sphere>

        {/* Ear panels */}
        <Box args={[0.3, 0.8, 0.5]} position={[-1.25, 0, 0]}>
          <meshStandardMaterial color="#0f3460" metalness={0.7} roughness={0.3} />
        </Box>
        <Box args={[0.3, 0.8, 0.5]} position={[1.25, 0, 0]}>
          <meshStandardMaterial color="#0f3460" metalness={0.7} roughness={0.3} />
        </Box>

        {/* Neck */}
        <Cylinder args={[0.4, 0.5, 0.5, 8]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </Cylinder>

        {/* Shoulders */}
        <RoundedBox args={[3, 0.4, 1.2]} radius={0.1} position={[0, -2, 0]} smoothness={1}>
          <meshStandardMaterial color="#16213e" metalness={0.7} roughness={0.3} />
        </RoundedBox>
      </group>
    </Float>
  );
});

const ParticleField = memo(function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  // Reduced particle count for performance
  const particles = useMemo(() => {
    const positions = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={80}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#20c997" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
});

const GlowingSphere = memo(function GlowingSphere() {
  return (
    <Sphere args={[4, 16, 16]} position={[0, 0, -5]}>
      <MeshDistortMaterial color="#0f3460" transparent opacity={0.08} distort={0.3} speed={1.5} />
    </Sphere>
  );
});

export const Robot3D = memo(function Robot3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]} // Reduced max DPR for performance
        gl={{ 
          antialias: false, // Disable for performance on mobile
          alpha: true,
          powerPreference: "high-performance"
        }}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={0.8} />
        <pointLight position={[-5, 5, 5]} intensity={0.4} color="#20c997" />
        
        <RobotHead />
        <ParticleField />
        <GlowingSphere />
      </Canvas>
    </div>
  );
});
