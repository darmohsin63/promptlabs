import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, RoundedBox, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { RobotAvatar } from "./RobotAvatar";

// Social URLs
const FACEBOOK_URL = "https://facebook.com/darmohasin13";
const INSTAGRAM_URL = "https://instagram.com/darmohsin63";

// Holographic floating panel
function HolographicPanel({ position, rotation, size, color, delay = 0 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
  color: string;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(time * 1.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floating data element / UI element
function FloatingDataElement({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime + delay;
      groupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15;
      groupRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Data cube */}
      <RoundedBox args={[0.15, 0.15, 0.15]} radius={0.03}>
        <meshStandardMaterial
          color="#14b8a6"
          emissive="#14b8a6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </RoundedBox>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.01, 8, 32]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Glowing UI screen element
function GlowingScreen({ position, rotation, size }: {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const borderRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && borderRef.current) {
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      (borderRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Screen background */}
      <mesh ref={meshRef}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color="#0a1628"
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Glowing border */}
      <mesh ref={borderRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[size[0] + 0.05, size[1] + 0.05]} />
        <meshBasicMaterial
          color="#14b8a6"
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Screen lines - data visualization */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[-size[0] / 4 + i * (size[0] / 4), 0, 0.02]}>
          <boxGeometry args={[0.02, size[1] * 0.6 * Math.random() + 0.1, 0.01]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Ambient light particles
function LightParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;

      // Teal, emerald, amber colors
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i * 3] = 0.08; // R - teal
        colors[i * 3 + 1] = 0.72; // G
        colors[i * 3 + 2] = 0.65; // B
      } else if (colorChoice < 0.8) {
        colors[i * 3] = 0.16; // R - emerald
        colors[i * 3 + 1] = 0.82; // G
        colors[i * 3 + 2] = 0.48; // B
      } else {
        colors[i * 3] = 0.96; // R - amber
        colors[i * 3 + 1] = 0.62; // G
        colors[i * 3 + 2] = 0.04; // B
      }
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Neural network with improved aesthetics
function EnhancedNeuralNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, linePositions } = useMemo(() => {
    const count = 40;
    const positions = new Float32Array(count * 3);
    const connections: number[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 3;
    }

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 2.8) {
          connections.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }

    return { positions, linePositions: new Float32Array(connections) };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group position={[0, 0, -4]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#14b8a6"
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#14b8a6" transparent opacity={0.08} />
      </lineSegments>
    </group>
  );
}

// Floor reflection / ground plane
function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        color="#0a1628"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Animated accent orbs
function AccentOrb({ position, color, size = 0.15, speed = 1 }: {
  position: [number, number, number];
  color: string;
  size?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={speed * 2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export function HeroScene3D() {
  const handleFacebookClick = () => {
    window.open(FACEBOOK_URL, "_blank");
  };

  const handleInstagramClick = () => {
    window.open(INSTAGRAM_URL, "_blank");
  };

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Premium cinematic lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#14b8a6" />
        <pointLight position={[-5, 3, 3]} intensity={0.8} color="#10b981" />
        <pointLight position={[0, -2, 5]} intensity={0.5} color="#f59e0b" />
        <pointLight position={[0, 5, 0]} intensity={0.4} color="#ffffff" />
        <spotLight
          position={[0, 8, 4]}
          angle={0.3}
          penumbra={0.8}
          intensity={0.6}
          color="#14b8a6"
        />

        {/* Subtle stars in background */}
        <Stars radius={80} depth={40} count={800} factor={3} saturation={0.2} fade speed={0.5} />

        {/* Neural network backdrop */}
        <EnhancedNeuralNetwork />

        {/* Light particles */}
        <LightParticles />

        {/* Holographic panels - futuristic room elements */}
        <HolographicPanel position={[-4, 1, -2]} rotation={[0, 0.3, 0]} size={[1.5, 2]} color="#14b8a6" delay={0} />
        <HolographicPanel position={[4, 0.5, -2]} rotation={[0, -0.3, 0]} size={[1.2, 1.8]} color="#10b981" delay={0.5} />
        <HolographicPanel position={[-3, -0.5, -3]} rotation={[0.1, 0.2, 0]} size={[0.8, 1.2]} color="#f59e0b" delay={1} />

        {/* Floating UI screens */}
        <GlowingScreen position={[-3.5, 1.5, -1.5]} rotation={[0, 0.4, 0]} size={[0.8, 0.6]} />
        <GlowingScreen position={[3.5, 1.2, -1.5]} rotation={[0, -0.4, 0]} size={[0.7, 0.5]} />

        {/* Floating data elements */}
        <FloatingDataElement position={[-2.5, 2, -1]} delay={0} />
        <FloatingDataElement position={[2.8, 1.8, -1.2]} delay={0.8} />
        <FloatingDataElement position={[0, 2.5, -2]} delay={1.5} />

        {/* Ground reflection */}
        <GroundPlane />

        {/* Robot Avatar with social logos */}
        <RobotAvatar 
          onFacebookClick={handleFacebookClick}
          onInstagramClick={handleInstagramClick}
        />
        
        {/* Accent orbs for depth */}
        <AccentOrb position={[-4, 2, -2]} color="#14b8a6" speed={0.6} size={0.12} />
        <AccentOrb position={[4, -1.5, -2.5]} color="#f59e0b" speed={0.8} size={0.1} />
        <AccentOrb position={[3.5, 2.2, -1.5]} color="#10b981" speed={0.5} size={0.08} />
        <AccentOrb position={[-3.8, -1, -2]} color="#14b8a6" speed={0.7} size={0.09} />
      </Canvas>
    </div>
  );
}
