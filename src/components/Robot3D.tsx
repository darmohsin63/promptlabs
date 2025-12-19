import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Sphere, Box, Cylinder, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function RobotHead() {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (headRef.current) {
      // Gentle floating motion
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    
    // Eye glow pulsing
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
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={headRef}>
        {/* Main Head */}
        <RoundedBox args={[2.2, 2.5, 2]} radius={0.3} smoothness={4}>
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.9}
            roughness={0.1}
          />
        </RoundedBox>

        {/* Face plate */}
        <RoundedBox args={[1.8, 1.8, 0.3]} radius={0.15} position={[0, 0, 1]}>
          <meshStandardMaterial
            color="#16213e"
            metalness={0.8}
            roughness={0.2}
          />
        </RoundedBox>

        {/* Left Eye */}
        <Sphere ref={leftEyeRef} args={[0.25, 32, 32]} position={[-0.5, 0.3, 1.15]}>
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.2}
          />
        </Sphere>

        {/* Right Eye */}
        <Sphere ref={rightEyeRef} args={[0.25, 32, 32]} position={[0.5, 0.3, 1.15]}>
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.2}
          />
        </Sphere>

        {/* Mouth/Speaker grille */}
        <RoundedBox args={[0.8, 0.15, 0.1]} radius={0.05} position={[0, -0.5, 1.15]}>
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.3}
          />
        </RoundedBox>

        {/* Antenna base */}
        <Cylinder args={[0.15, 0.2, 0.3, 16]} position={[0, 1.4, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </Cylinder>

        {/* Antenna */}
        <Cylinder args={[0.05, 0.05, 0.6, 8]} position={[0, 1.8, 0]}>
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
        </Cylinder>

        {/* Antenna tip */}
        <Sphere args={[0.12, 16, 16]} position={[0, 2.15, 0]}>
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.6}
          />
        </Sphere>

        {/* Left ear panel */}
        <Box args={[0.3, 0.8, 0.5]} position={[-1.25, 0, 0]}>
          <meshStandardMaterial color="#0f3460" metalness={0.8} roughness={0.2} />
        </Box>

        {/* Right ear panel */}
        <Box args={[0.3, 0.8, 0.5]} position={[1.25, 0, 0]}>
          <meshStandardMaterial color="#0f3460" metalness={0.8} roughness={0.2} />
        </Box>

        {/* Neck */}
        <Cylinder args={[0.4, 0.5, 0.5, 16]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </Cylinder>

        {/* Shoulder plates */}
        <RoundedBox args={[3, 0.4, 1.2]} radius={0.1} position={[0, -2, 0]}>
          <meshStandardMaterial color="#16213e" metalness={0.8} roughness={0.2} />
        </RoundedBox>
      </group>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#20c997"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function GlowingSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.1);
    }
  });

  return (
    <Sphere ref={sphereRef} args={[5, 32, 32]} position={[0, 0, -5]}>
      <MeshDistortMaterial
        color="#0f3460"
        transparent
        opacity={0.1}
        distort={0.4}
        speed={2}
      />
    </Sphere>
  );
}

export function Robot3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />
        <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={0.5} color="#20c997" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#f59e0b" />
        
        <RobotHead />
        <ParticleField />
        <GlowingSphere />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
