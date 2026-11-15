import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveBuildingId } from './types';

interface RadiationShelterProps {
  isSelected: boolean;
  onSelect: (id: InteractiveBuildingId) => void;
  shieldLevel: number;
  activeSolarStorm: boolean;
  shieldPower: number;
}

export const RadiationShelter: React.FC<RadiationShelterProps> = ({
  isSelected,
  onSelect,
  shieldLevel,
  activeSolarStorm,
  shieldPower
}) => {
  const [hovered, setHovered] = useState(false);
  const shieldBubbleRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const shieldActive = shieldPower > 10 || activeSolarStorm;

  useFrame((state, delta) => {
    if (shieldBubbleRef.current && shieldActive) {
      const pulse = activeSolarStorm
        ? 0.35 + Math.sin(state.clock.elapsedTime * 6) * 0.15
        : 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      (shieldBubbleRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
      shieldBubbleRef.current.rotation.y += delta * 0.1;
    }
    if (ringRef.current && (hovered || isSelected)) {
      ringRef.current.rotation.z += delta * 1.5;
    }
  });

  return (
    <group
      position={[0, 0, -18]}
      onClick={e => {
        e.stopPropagation();
        onSelect('radiation_shelter');
      }}
      onPointerOver={e => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Subterranean Regolith Berm Mound (Thick Moon Dirt Bunker) */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <coneGeometry args={[7.5, 3.2, 24]} />
        <meshStandardMaterial color="#334155" roughness={0.95} />
      </mesh>

      {/* Reinforced Titanium Blast Airlock Hatch */}
      <mesh position={[0, 1.6, 2.8]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 2.4, 1.2]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#a855f7' : '#475569'}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Yellow/Black Warning Hazard Stripe Bar */}
      <mesh position={[0, 2.7, 2.6]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[3.2, 0.25, 0.1]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* Electromagnetic Emitter Pylon on Top of Bunker */}
      <mesh position={[0, 3.6, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 2.2, 16]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
      {/* Magnetic Emitter Core Sphere */}
      <mesh position={[0, 4.8, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial
          color={activeSolarStorm ? '#ef4444' : shieldActive ? '#c084fc' : '#64748b'}
        />
      </mesh>

      {/* Global Holographic Active Deflector Shield Bubble (envelops entire outpost) */}
      {shieldActive && (
        <mesh
          ref={shieldBubbleRef}
          position={[0, 0, 18]} // Center over main base
          scale={[28, 16, 28]}
        >
          <sphereGeometry args={[1, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshBasicMaterial
            color={activeSolarStorm ? '#ef4444' : '#38bdf8'}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Selection Ring */}
      {(hovered || isSelected) && (
        <mesh ref={ringRef} position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.8, 8.4, 32]} />
          <meshBasicMaterial
            color="#a855f7"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Overhead 3D Floating Tag */}
      {(hovered || isSelected) && (
        <Html position={[0, 6.8, 0]} center distanceFactor={28}>
          <div className="bg-slate-950/90 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-500/60 shadow-xl font-mono text-[11px] pointer-events-none whitespace-nowrap flex items-center space-x-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping inline-block" />
            <span className="font-bold">Regolith Radiation Shelter</span>
            <span className="text-white">| Shield: {Math.round(shieldLevel)}%</span>
            <span className={shieldActive ? 'text-emerald-400' : 'text-slate-400'}>
              | {shieldActive ? 'Active Deflector ON' : 'Standby'}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};

