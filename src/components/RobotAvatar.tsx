import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, RoundedBox, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// Cute Robot Head with expressive LED eyes
function CuteRobotHead() {
  const headRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const pupilLeftRef = useRef<THREE.Mesh>(null);
  const pupilRightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (headRef.current) {
      // Gentle, curious head tilt
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      headRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05 - 0.1; // Slight forward tilt
    }
    
    // Expressive eye animations
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkCycle = Math.sin(state.clock.elapsedTime * 0.5);
      const blink = blinkCycle > 0.95 ? 0.3 : 1;
      eyeLeftRef.current.scale.y = blink;
      eyeRightRef.current.scale.y = blink;
      
      const intensity = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      (eyeLeftRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
      (eyeRightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }

    // Pupils follow a pattern
    if (pupilLeftRef.current && pupilRightRef.current) {
      const lookX = Math.sin(state.clock.elapsedTime * 0.7) * 0.03;
      const lookY = Math.cos(state.clock.elapsedTime * 0.5) * 0.02;
      pupilLeftRef.current.position.x = -0.28 + lookX;
      pupilLeftRef.current.position.y = 0.15 + lookY;
      pupilRightRef.current.position.x = 0.28 + lookX;
      pupilRightRef.current.position.y = 0.15 + lookY;
    }
  });

  return (
    <group ref={headRef} position={[0, 0.6, 0]}>
      {/* Main head - soft, rounded shape */}
      <RoundedBox args={[1.4, 1.3, 1.1]} radius={0.35} smoothness={8}>
        <meshStandardMaterial
          color="#e8e8ed"
          metalness={0.1}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Glossy face visor */}
      <RoundedBox args={[1.1, 0.7, 0.15]} radius={0.2} position={[0, 0.05, 0.52]}>
        <meshStandardMaterial
          color="#1a1f2e"
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Left LED eye - large and expressive */}
      <group position={[-0.28, 0.15, 0.58]}>
        <Sphere ref={eyeLeftRef} args={[0.18, 32, 32]}>
          <meshStandardMaterial
            color="#14b8a6"
            emissive="#14b8a6"
            emissiveIntensity={1.2}
            metalness={0.3}
            roughness={0.2}
          />
        </Sphere>
        {/* Eye highlight */}
        <Sphere args={[0.06, 16, 16]} position={[0.05, 0.05, 0.1]}>
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
        {/* Pupil */}
        <Sphere ref={pupilLeftRef} args={[0.08, 16, 16]} position={[0, 0, 0.12]}>
          <meshBasicMaterial color="#0d4a42" />
        </Sphere>
      </group>

      {/* Right LED eye - large and expressive */}
      <group position={[0.28, 0.15, 0.58]}>
        <Sphere ref={eyeRightRef} args={[0.18, 32, 32]}>
          <meshStandardMaterial
            color="#14b8a6"
            emissive="#14b8a6"
            emissiveIntensity={1.2}
            metalness={0.3}
            roughness={0.2}
          />
        </Sphere>
        {/* Eye highlight */}
        <Sphere args={[0.06, 16, 16]} position={[0.05, 0.05, 0.1]}>
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
        {/* Pupil */}
        <Sphere ref={pupilRightRef} args={[0.08, 16, 16]} position={[0, 0, 0.12]}>
          <meshBasicMaterial color="#0d4a42" />
        </Sphere>
      </group>

      {/* Happy smile - curved LED */}
      <group position={[0, -0.18, 0.58]}>
        <mesh>
          <torusGeometry args={[0.12, 0.025, 8, 16, Math.PI]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* Cute antenna */}
      <group position={[0, 0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.25]} />
          <meshStandardMaterial color="#c4c4cc" metalness={0.8} roughness={0.2} />
        </mesh>
        <Float speed={4} rotationIntensity={0} floatIntensity={0.5}>
          <Sphere args={[0.1, 32, 32]} position={[0, 0.22, 0]}>
            <meshStandardMaterial
              color="#14b8a6"
              emissive="#14b8a6"
              emissiveIntensity={1.5}
              metalness={0.5}
              roughness={0.2}
            />
          </Sphere>
        </Float>
      </group>

      {/* Ear accent lights */}
      <Sphere args={[0.08, 16, 16]} position={[-0.72, 0.1, 0.1]}>
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.6}
        />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[0.72, 0.1, 0.1]}>
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.6}
        />
      </Sphere>

      {/* Cheek blush - subtle warm glow */}
      <Sphere args={[0.12, 16, 16]} position={[-0.45, -0.05, 0.4]}>
        <meshStandardMaterial
          color="#fca5a5"
          transparent
          opacity={0.3}
        />
      </Sphere>
      <Sphere args={[0.12, 16, 16]} position={[0.45, -0.05, 0.4]}>
        <meshStandardMaterial
          color="#fca5a5"
          transparent
          opacity={0.3}
        />
      </Sphere>
    </group>
  );
}

function CuteRobotBody() {
  const chestRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (chestRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      (chestRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    }
  });

  return (
    <group position={[0, -0.65, 0]}>
      {/* Main torso - soft rounded shape */}
      <RoundedBox args={[1.1, 0.9, 0.8]} radius={0.25} smoothness={8}>
        <meshStandardMaterial
          color="#e8e8ed"
          metalness={0.1}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Chest panel */}
      <RoundedBox args={[0.6, 0.5, 0.1]} radius={0.1} position={[0, 0.05, 0.42]}>
        <meshStandardMaterial
          color="#1a1f2e"
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Heart-shaped chest light */}
      <Sphere ref={chestRef} args={[0.12, 32, 32]} position={[0, 0.05, 0.48]}>
        <meshStandardMaterial
          color="#14b8a6"
          emissive="#14b8a6"
          emissiveIntensity={1}
        />
      </Sphere>

      {/* Shoulder joints - soft */}
      <Sphere args={[0.18, 32, 32]} position={[-0.65, 0.25, 0]}>
        <meshStandardMaterial color="#c4c4cc" metalness={0.6} roughness={0.3} />
      </Sphere>
      <Sphere args={[0.18, 32, 32]} position={[0.65, 0.25, 0]}>
        <meshStandardMaterial color="#c4c4cc" metalness={0.6} roughness={0.3} />
      </Sphere>

      {/* Belt/waist accent */}
      <RoundedBox args={[1.15, 0.15, 0.85]} radius={0.07} position={[0, -0.42, 0]}>
        <meshStandardMaterial
          color="#c4c4cc"
          metalness={0.7}
          roughness={0.3}
        />
      </RoundedBox>
    </group>
  );
}

function CuteRobotArms({ facebookHovered, instagramHovered }: { facebookHovered: boolean; instagramHovered: boolean }) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(time * 1.2) * 0.2 - 0.3;
      leftArmRef.current.rotation.z = 0.4 + Math.sin(time * 0.6) * 0.1;
      if (instagramHovered) {
        leftArmRef.current.rotation.x = -0.6;
        leftArmRef.current.rotation.z = 0.6;
      }
    }
    
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(time * 1.2 + 1) * 0.2 - 0.3;
      rightArmRef.current.rotation.z = -0.4 + Math.sin(time * 0.6 + 1) * -0.1;
      if (facebookHovered) {
        rightArmRef.current.rotation.x = -0.6;
        rightArmRef.current.rotation.z = -0.6;
      }
    }
  });

  return (
    <>
      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.8, -0.35, 0]}>
        <RoundedBox args={[0.22, 0.6, 0.22]} radius={0.08} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#e8e8ed" metalness={0.1} roughness={0.4} />
        </RoundedBox>
        {/* Elbow joint */}
        <Sphere args={[0.1, 16, 16]} position={[0, -0.6, 0]}>
          <meshStandardMaterial color="#c4c4cc" metalness={0.6} roughness={0.3} />
        </Sphere>
        {/* Forearm */}
        <RoundedBox args={[0.18, 0.4, 0.18]} radius={0.06} position={[0, -0.85, 0]}>
          <meshStandardMaterial color="#e8e8ed" metalness={0.1} roughness={0.4} />
        </RoundedBox>
        {/* Hand */}
        <Sphere args={[0.13, 32, 32]} position={[0, -1.1, 0]}>
          <meshStandardMaterial color="#c4c4cc" metalness={0.5} roughness={0.3} />
        </Sphere>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.8, -0.35, 0]}>
        <RoundedBox args={[0.22, 0.6, 0.22]} radius={0.08} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#e8e8ed" metalness={0.1} roughness={0.4} />
        </RoundedBox>
        {/* Elbow joint */}
        <Sphere args={[0.1, 16, 16]} position={[0, -0.6, 0]}>
          <meshStandardMaterial color="#c4c4cc" metalness={0.6} roughness={0.3} />
        </Sphere>
        {/* Forearm */}
        <RoundedBox args={[0.18, 0.4, 0.18]} radius={0.06} position={[0, -0.85, 0]}>
          <meshStandardMaterial color="#e8e8ed" metalness={0.1} roughness={0.4} />
        </RoundedBox>
        {/* Hand */}
        <Sphere args={[0.13, 32, 32]} position={[0, -1.1, 0]}>
          <meshStandardMaterial color="#c4c4cc" metalness={0.5} roughness={0.3} />
        </Sphere>
      </group>
    </>
  );
}

// Glassy Instagram Logo
function GlassyInstagramLogo({ onHover, onClick }: { onHover: (h: boolean) => void; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      glowRef.current.scale.setScalar(hovered ? scale * 1.3 : scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group
        ref={groupRef}
        position={[-1.8, 0.8, 0.8]}
        onPointerEnter={() => { onHover(true); setHovered(true); }}
        onPointerLeave={() => { onHover(false); setHovered(false); }}
        onClick={onClick}
      >
        {/* Outer glow */}
        <Sphere ref={glowRef} args={[0.5, 32, 32]}>
          <meshBasicMaterial color="#E1306C" transparent opacity={0.12} />
        </Sphere>
        
        {/* Inner glow ring */}
        <mesh>
          <torusGeometry args={[0.38, 0.08, 16, 32]} />
          <meshBasicMaterial color="#E1306C" transparent opacity={0.25} />
        </mesh>

        {/* Glassy main body */}
        <RoundedBox args={[0.55, 0.55, 0.12]} radius={0.14}>
          <meshPhysicalMaterial
            color="#E1306C"
            metalness={0.1}
            roughness={0.05}
            transmission={0.6}
            thickness={0.5}
            transparent
            opacity={0.9}
          />
        </RoundedBox>
        
        {/* Camera lens ring */}
        <mesh position={[0, 0, 0.07]}>
          <ringGeometry args={[0.1, 0.15, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Flash dot */}
        <Sphere args={[0.04, 16, 16]} position={[0.15, 0.15, 0.07]}>
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
          />
        </Sphere>

        {/* Click indicator ring */}
        {hovered && (
          <mesh position={[0, 0, 0.08]}>
            <ringGeometry args={[0.28, 0.3, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// Glassy Facebook Logo
function GlassyFacebookLogo({ onHover, onClick }: { onHover: (h: boolean) => void; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + 1) * 0.1;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5 + 1) * 0.15;
      glowRef.current.scale.setScalar(hovered ? scale * 1.3 : scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group
        ref={groupRef}
        position={[1.8, 0.5, 0.8]}
        onPointerEnter={() => { onHover(true); setHovered(true); }}
        onPointerLeave={() => { onHover(false); setHovered(false); }}
        onClick={onClick}
      >
        {/* Outer glow */}
        <Sphere ref={glowRef} args={[0.5, 32, 32]}>
          <meshBasicMaterial color="#1877F2" transparent opacity={0.12} />
        </Sphere>
        
        {/* Inner glow ring */}
        <mesh>
          <torusGeometry args={[0.38, 0.08, 16, 32]} />
          <meshBasicMaterial color="#1877F2" transparent opacity={0.25} />
        </mesh>

        {/* Glassy main body */}
        <RoundedBox args={[0.55, 0.55, 0.12]} radius={0.14}>
          <meshPhysicalMaterial
            color="#1877F2"
            metalness={0.1}
            roughness={0.05}
            transmission={0.6}
            thickness={0.5}
            transparent
            opacity={0.9}
          />
        </RoundedBox>
        
        {/* F letter - sleek design */}
        <mesh position={[0.02, 0, 0.07]}>
          <boxGeometry args={[0.06, 0.32, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.06, 0.08, 0.07]}>
          <boxGeometry args={[0.18, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.03, -0.02, 0.07]}>
          <boxGeometry args={[0.12, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Click indicator ring */}
        {hovered && (
          <mesh position={[0, 0, 0.08]}>
            <ringGeometry args={[0.28, 0.3, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}
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
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
      // Subtle breathing rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Cute Robot */}
      <group>
        <CuteRobotHead />
        <CuteRobotBody />
        <CuteRobotArms facebookHovered={facebookHovered} instagramHovered={instagramHovered} />
      </group>

      {/* Glassy floating social logos */}
      <GlassyInstagramLogo 
        onHover={setInstagramHovered} 
        onClick={onInstagramClick}
      />
      <GlassyFacebookLogo 
        onHover={setFacebookHovered} 
        onClick={onFacebookClick}
      />
    </group>
  );
}
