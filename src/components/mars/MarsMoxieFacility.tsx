import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveBuildingId } from '../3d/types';

interface MarsMoxieFacilityProps {
  isSelected: boolean;
  onSelect: (id: InteractiveBuildingId) => void;
  oxygenLevel: number;
}

export const MarsMoxieFacility: React.FC<MarsMoxieFacilityProps> = ({
  isSelected,
  onSelect,
  oxygenLevel
}) => {
  const [hovered, setHovered] = useState(false);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      // High-temperature 800°C SOEC electrolysis core glow
      coreRef.current.rotation.y += delta * 0.8;
    }
    if (ringRef.current && (hovered || isSelected)) {
      ringRef.current.rotation.z += delta * 1.5;
    }
  });

  return (
    <group
      position={[-15, 0, 8]}
      onClick={e => {
        e.stopPropagation();
        onSelect('oxygen_facility');
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
      {/* Foundation Pad */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[8.5, 0.3, 7.5]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>

      {/* Main MOXIE Atmospheric Processor Box */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 3.8, 4.2]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#38bdf8' : '#e2e8f0'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Martian CO2 Intake Louvers */}
      <mesh position={[0, 2.2, 2.15]}>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* Solid Oxide Electrolysis Glowing Core */}
      <mesh ref={coreRef} position={[0, 2.4, 0]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>

      {/* Cryogenic Liquid O2 Cylinders */}
      <mesh position={[-2.8, 2.2, 1.2]} castShadow>
        <capsuleGeometry args={[0.8, 2.6, 12, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      <mesh position={[2.8, 2.2, 1.2]} castShadow>
        <capsuleGeometry args={[0.8, 2.6, 12, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>

      {/* Selection Ring */}
      {(hovered || isSelected) && (
        <mesh ref={ringRef} position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.5, 6.2, 32]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Floating Overhead Tag */}
      {(hovered || isSelected) && (
        <Html position={[0, 5.2, 0]} center distanceFactor={26}>
          <div className="bg-slate-950/90 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/60 shadow-xl font-mono text-[11px] pointer-events-none whitespace-nowrap flex items-center space-x-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span className="font-bold">NASA MOXIE O₂ Plant</span>
            <span className="text-white">| O₂: {Math.round(oxygenLevel)}%</span>
          </div>
        </Html>
      )}
    </group>
  );
};
