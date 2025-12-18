import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Facebook URL - Update this with your actual profile
const FACEBOOK_URL = "https://facebook.com/yourprofile";
// Instagram URL - Update this with your actual profile
const INSTAGRAM_URL = "https://instagram.com/yourprofile";

function RobotHead() {
  const headRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (headRef.current) {
      // Gentle head movement
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
    
    // Eye glow pulsing
    if (eyeLeftRef.current && eyeRightRef.current) {
      const intensity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      (eyeLeftRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
      (eyeRightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  return (
    <group ref={headRef} position={[0, 0.5, 0]}>
      {/* Main head - rounded box */}
      <RoundedBox args={[1.2, 1.4, 1]} radius={0.2} smoothness={4}>
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Face plate */}
      <RoundedBox args={[1, 0.8, 0.1]} radius={0.1} position={[0, 0.1, 0.5]}>
        <meshStandardMaterial
          color="#16213e"
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Left eye */}
      <Sphere ref={eyeLeftRef} args={[0.15, 32, 32]} position={[-0.25, 0.2, 0.55]}>
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </Sphere>

      {/* Right eye */}
      <Sphere ref={eyeRightRef} args={[0.15, 32, 32]} position={[0.25, 0.2, 0.55]}>
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </Sphere>

      {/* Mouth - LED strip */}
      <RoundedBox args={[0.5, 0.08, 0.05]} radius={0.02} position={[0, -0.2, 0.55]}>
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.6}
        />
      </RoundedBox>

      {/* Antenna */}
      <group position={[0, 0.8, 0]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 0.3]} />
          <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.1} />
        </mesh>
        <Sphere args={[0.08, 16, 16]} position={[0, 0.2, 0]}>
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={1}
          />
        </Sphere>
      </group>

      {/* Ear panels */}
      <RoundedBox args={[0.15, 0.4, 0.3]} radius={0.05} position={[-0.7, 0, 0]}>
        <meshStandardMaterial color="#0f3460" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.4, 0.3]} radius={0.05} position={[0.7, 0, 0]}>
        <meshStandardMaterial color="#0f3460" metalness={0.8} roughness={0.2} />
      </RoundedBox>
    </group>
  );
}

function RobotBody() {
  return (
    <group position={[0, -0.8, 0]}>
      {/* Torso */}
      <RoundedBox args={[1, 1.2, 0.8]} radius={0.15}>
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Chest light */}
      <Sphere args={[0.15, 32, 32]} position={[0, 0.2, 0.45]}>
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1}
        />
      </Sphere>

      {/* Shoulder joints */}
      <Sphere args={[0.15, 16, 16]} position={[-0.6, 0.4, 0]}>
        <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.1} />
      </Sphere>
      <Sphere args={[0.15, 16, 16]} position={[0.6, 0.4, 0]}>
        <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.1} />
      </Sphere>
    </group>
  );
}

function RobotArms({ facebookHovered, instagramHovered }: { facebookHovered: boolean; instagramHovered: boolean }) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (leftArmRef.current) {
      // Left arm plays with Instagram
      leftArmRef.current.rotation.x = Math.sin(time * 1.5) * 0.3 - 0.5;
      leftArmRef.current.rotation.z = Math.sin(time * 0.8) * 0.2 + 0.3;
      if (instagramHovered) {
        leftArmRef.current.rotation.x = -0.8;
      }
    }
    
    if (rightArmRef.current) {
      // Right arm plays with Facebook
      rightArmRef.current.rotation.x = Math.sin(time * 1.5 + 1) * 0.3 - 0.5;
      rightArmRef.current.rotation.z = Math.sin(time * 0.8 + 1) * -0.2 - 0.3;
      if (facebookHovered) {
        rightArmRef.current.rotation.x = -0.8;
      }
    }
  });

  return (
    <>
      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.8, -0.4, 0]}>
        <RoundedBox args={[0.2, 0.8, 0.2]} radius={0.05} position={[0, -0.4, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        {/* Hand */}
        <Sphere args={[0.12, 16, 16]} position={[0, -0.85, 0]}>
          <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.1} />
        </Sphere>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.8, -0.4, 0]}>
        <RoundedBox args={[0.2, 0.8, 0.2]} radius={0.05} position={[0, -0.4, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        {/* Hand */}
        <Sphere args={[0.12, 16, 16]} position={[0, -0.85, 0]}>
          <meshStandardMaterial color="#4a5568" metalness={0.9} roughness={0.1} />
        </Sphere>
      </group>
    </>
  );
}

function InstagramLogo({ onHover, onClick }: { onHover: (h: boolean) => void; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group
        ref={groupRef}
        position={[-2, -0.5, 0.5]}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        onClick={onClick}
      >
        {/* Glow */}
        <Sphere ref={glowRef} args={[0.6, 16, 16]}>
          <meshBasicMaterial color="#E1306C" transparent opacity={0.15} />
        </Sphere>
        
        {/* Instagram rounded square */}
        <RoundedBox args={[0.7, 0.7, 0.15]} radius={0.15}>
          <meshStandardMaterial
            color="#E1306C"
            metalness={0.3}
            roughness={0.4}
          />
        </RoundedBox>
        
        {/* Inner circle (camera lens) */}
        <mesh position={[0, 0, 0.1]}>
          <ringGeometry args={[0.12, 0.18, 32]} />
          <meshBasicMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Flash dot */}
        <Sphere args={[0.05, 16, 16]} position={[0.18, 0.18, 0.1]}>
          <meshBasicMaterial color="white" />
        </Sphere>
      </group>
    </Float>
  );
}

function FacebookLogo({ onHover, onClick }: { onHover: (h: boolean) => void; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + 1) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2 + 1) * 0.15;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + 1) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group
        ref={groupRef}
        position={[2, -0.5, 0.5]}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        onClick={onClick}
      >
        {/* Glow */}
        <Sphere ref={glowRef} args={[0.6, 16, 16]}>
          <meshBasicMaterial color="#1877F2" transparent opacity={0.15} />
        </Sphere>
        
        {/* Facebook rounded square */}
        <RoundedBox args={[0.7, 0.7, 0.15]} radius={0.15}>
          <meshStandardMaterial
            color="#1877F2"
            metalness={0.3}
            roughness={0.4}
          />
        </RoundedBox>
        
        {/* F letter - simplified */}
        <mesh position={[0.05, 0, 0.1]}>
          <boxGeometry args={[0.08, 0.4, 0.02]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[-0.05, 0.1, 0.1]}>
          <boxGeometry args={[0.25, 0.08, 0.02]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[-0.02, -0.02, 0.1]}>
          <boxGeometry args={[0.18, 0.08, 0.02]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </Float>
  );
}

interface RobotAvatarProps {
  onFacebookClick: () => void;
  onInstagramClick: () => void;
}

export function RobotAvatar({ onFacebookClick, onInstagramClick }: RobotAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [facebookHovered, setFacebookHovered] = useState(false);
  const [instagramHovered, setInstagramHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Robot */}
      <group position={[0, 0, 0]}>
        <RobotHead />
        <RobotBody />
        <RobotArms facebookHovered={facebookHovered} instagramHovered={instagramHovered} />
      </group>

      {/* Social logos the robot is playing with */}
      <InstagramLogo 
        onHover={setInstagramHovered} 
        onClick={onInstagramClick}
      />
      <FacebookLogo 
        onHover={setFacebookHovered} 
        onClick={onFacebookClick}
      />
    </group>
  );
}
