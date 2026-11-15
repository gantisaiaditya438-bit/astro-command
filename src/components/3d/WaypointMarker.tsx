import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface WaypointMarkerProps {
  position: [number, number, number];
  title: string;
  subtitle?: string;
  color?: string;
  playerPosition?: [number, number, number];
  onClick?: () => void;
}

export const WaypointMarker: React.FC<WaypointMarkerProps> = ({
  position,
  title,
  subtitle,
  color = '#00f0ff',
  playerPosition = [0, 0, 0],
  onClick
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const arrowRef = useRef<THREE.Group>(null);

  // Calculate distance in 3D
  const distance = Math.round(
    Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    )
  );

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }

    if (beaconRef.current) {
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
      (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }

    if (arrowRef.current) {
      arrowRef.current.position.y = 4.2 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      arrowRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* 1. Ground Pulse Holographic Target Rings */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[1.5, 1.8, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>

      {/* 2. Vertical Light Beacon Pillar */}
      <mesh ref={beaconRef} position={[0, 5, 0]}>
        <cylinderGeometry args={[0.08, 0.35, 10, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>

      {/* 3. Floating Downward Arrow Marker */}
      <group ref={arrowRef} position={[0, 4.2, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.45, 0.9, 4]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 4. Overhead Navigational Distance Badge */}
      <Html position={[0, 5.8, 0]} center distanceFactor={35}>
        <div
          onClick={onClick}
          className="cursor-pointer bg-slate-950/90 border border-cyan-400 rounded-xl px-2.5 py-1 text-center shadow-2xl backdrop-blur-md pointer-events-auto select-none transition hover:scale-105"
        >
          <div className="text-[10px] font-mono font-black text-cyan-300 uppercase tracking-wider flex items-center justify-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span>{title}</span>
          </div>
          {subtitle && (
            <p className="text-[9px] text-slate-300 font-sans">{subtitle}</p>
          )}
          <div className="text-[9px] font-mono font-bold text-amber-300 mt-0.5">
            {distance}m AWAY
          </div>
        </div>
      </Html>
    </group>
  );
};
