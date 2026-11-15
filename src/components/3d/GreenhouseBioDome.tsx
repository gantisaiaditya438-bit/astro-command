import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveBuildingId } from './types';

interface GreenhouseBioDomeProps {
  isSelected: boolean;
  onSelect: (id: InteractiveBuildingId) => void;
  foodLevel: number;
  waterLevel: number;
}

export const GreenhouseBioDome: React.FC<GreenhouseBioDomeProps> = ({
  isSelected,
  onSelect,
  foodLevel,
  waterLevel
}) => {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const plantGlowRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (ringRef.current && (hovered || isSelected)) {
      ringRef.current.rotation.z += delta * 1.5;
    }
    if (plantGlowRef.current) {
      plantGlowRef.current.intensity = 1.0 + Math.sin(Date.now() * 0.004) * 0.2;
    }
  });

  return (
    <group
      position={[15, 0, 4]}
      onClick={e => {
        e.stopPropagation();
        onSelect('greenhouse');
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
      {/* Foundation Base */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 5.5, 0.3, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Translucent Bio-Dome Shell */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[4.5, 4.8, 5.5, 24]} />
        <meshPhysicalMaterial
          color={hovered || isSelected ? '#a855f7' : '#ec4899'}
          transparent
          opacity={0.45}
          roughness={0.15}
          transmission={0.65}
          ior={1.4}
        />
      </mesh>

      {/* Hemispherical Roof Cap */}
      <mesh position={[0, 5.75, 0]}>
        <sphereGeometry args={[4.5, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshPhysicalMaterial
          color="#a855f7"
          transparent
          opacity={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Internal Hydroponic Plant Trays (Green tiers) */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[3.8, 4.0, 0.6, 16]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[3.2, 3.4, 0.6, 16]} />
        <meshStandardMaterial color="#16a34a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.0, 0]}>
        <cylinderGeometry args={[2.5, 2.7, 0.5, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.9} />
      </mesh>

      {/* Internal Plant LED Grow Light (Violet / Magenta) */}
      <pointLight
        ref={plantGlowRef}
        position={[0, 3.5, 0]}
        color="#c084fc"
        intensity={1.2}
        distance={12}
      />

      {/* External Water Recycling Conduit Pipe connecting to base */}
      <mesh position={[-3.8, 0.8, -1.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 3.5, 12]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Selection Ring */}
      {(hovered || isSelected) && (
        <mesh ref={ringRef} position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.2, 6.8, 32]} />
          <meshBasicMaterial
            color="#22c55e"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Overhead 3D Floating Tag */}
      {(hovered || isSelected) && (
        <Html position={[0, 8.5, 0]} center distanceFactor={28}>
          <div className="bg-slate-950/90 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/60 shadow-xl font-mono text-[11px] pointer-events-none whitespace-nowrap flex items-center space-x-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="font-bold">Hydroponic Greenhouse</span>
            <span className="text-white">| Food: {Math.round(foodLevel)} Rations</span>
            <span className="text-blue-300">| H₂O: {Math.round(waterLevel)}L</span>
          </div>
        </Html>
      )}
    </group>
  );
};

