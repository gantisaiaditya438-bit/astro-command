import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveBuildingId } from './types';

interface ResearchLabProps {
  isSelected: boolean;
  onSelect: (id: InteractiveBuildingId) => void;
  sciencePoints: number;
  sciencePower: number;
}

export const ResearchLab: React.FC<ResearchLabProps> = ({
  isSelected,
  onSelect,
  sciencePoints,
  sciencePower
}) => {
  const [hovered, setHovered] = useState(false);
  const dishRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (dishRef.current) {
      dishRef.current.rotation.y += delta * 0.4;
    }
    if (ringRef.current && (hovered || isSelected)) {
      ringRef.current.rotation.z += delta * 1.5;
    }
  });

  return (
    <group
      position={[12, 0, -12]}
      onClick={e => {
        e.stopPropagation();
        onSelect('research_lab');
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
        <boxGeometry args={[9, 0.3, 7]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Main Science Lab Module (Cylindrical Hub with Flat Roof) */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 4, 16]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#60a5fa' : '#cbd5e1'}
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Blue Science Accent Band */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[3.25, 3.25, 0.5, 16]} />
        <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Laser Sensor Core / Mass Spectrometer Port */}
      <mesh position={[0, 4.4, 1.2]} castShadow>
        <boxGeometry args={[1.6, 1.2, 1.4]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 4.4, 1.95]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Rotating High-Gain Spectrometry Dish on Roof */}
      <group ref={dishRef} position={[0, 4.8, -0.8]}>
        {/* Mount Pylon */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 1.6, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* Parabolic Dish */}
        <mesh position={[0, 1.8, 0]} rotation={[0.4, 0, 0]} castShadow>
          <sphereGeometry args={[1.5, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.9}
            roughness={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Antenna Feed Tip */}
        <mesh position={[0, 2.3, 0.6]}>
          <coneGeometry args={[0.12, 0.5, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Selection Ring */}
      {(hovered || isSelected) && (
        <mesh ref={ringRef} position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.8, 6.4, 32]} />
          <meshBasicMaterial
            color="#3b82f6"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Overhead 3D Floating Tag */}
      {(hovered || isSelected) && (
        <Html position={[0, 8.2, 0]} center distanceFactor={28}>
          <div className="bg-slate-950/90 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/60 shadow-xl font-mono text-[11px] pointer-events-none whitespace-nowrap flex items-center space-x-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping inline-block" />
            <span className="font-bold">Research Laboratory</span>
            <span className="text-white">| Science: {sciencePoints} pts</span>
            <span className="text-cyan-400">| Pwr: {sciencePower}%</span>
          </div>
        </Html>
      )}
    </group>
  );
};

