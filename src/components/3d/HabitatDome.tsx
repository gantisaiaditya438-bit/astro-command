import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveBuildingId } from './types';

interface HabitatDomeProps {
  isSelected: boolean;
  onSelect: (id: InteractiveBuildingId) => void;
  oxygenLevel: number;
  astronautCount: number;
}

export const HabitatDome: React.FC<HabitatDomeProps> = ({
  isSelected,
  onSelect,
  oxygenLevel,
  astronautCount
}) => {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (ringRef.current && (hovered || isSelected)) {
      ringRef.current.rotation.z += delta * 1.5;
    }
    if (lightRef.current) {
      // Gentle interior habitat breathing light
      lightRef.current.intensity = 1.2 + Math.sin(Date.now() * 0.003) * 0.2;
    }
  });

  return (
    <group
      position={[0, 0, 0]}
      onClick={e => {
        e.stopPropagation();
        onSelect('habitat');
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
      {/* Geodesic Dome */}
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[7, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#38bdf8' : '#e2e8f0'}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {/* Observation Cupola Windows (Gold-tinted radiation glass) */}
      <mesh position={[0, 8.2, 0]} castShadow>
        <cylinderGeometry args={[2.2, 2.8, 1.2, 16]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#eab308"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Interior Warm Habitation Light */}
      <pointLight
        ref={lightRef}
        position={[0, 4.5, 0]}
        color="#fde047"
        intensity={1.2}
        distance={18}
      />

      {/* Airlock Tunnel Module (North entrance) */}
      <group position={[0, 1.5, 6.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 3, 3]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Airlock Door */}
        <mesh position={[0, 0, 1.55]}>
          <planeGeometry args={[2, 2.4]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
        {/* Status Indicator LED above door */}
        <mesh position={[0, 1.25, 1.58]}>
          <circleGeometry args={[0.2, 16]} />
          <meshBasicMaterial color={oxygenLevel > 25 ? '#22c55e' : '#ef4444'} />
        </mesh>
      </group>

      {/* Connective Tunnel to Greenhouse (East) */}
      <mesh position={[7.5, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 3.5, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Connective Tunnel to Oxygen & Lab (West) */}
      <mesh position={[-7.5, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 3.5, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Ground Foundation Ring */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[7.8, 8.2, 0.5, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Holographic Selection Ring */}
      {(hovered || isSelected) && (
        <mesh ref={ringRef} position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8.8, 9.4, 32]} />
          <meshBasicMaterial
            color={isSelected ? '#38bdf8' : '#38bdf8'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Overhead 3D Floating Tag */}
      {(hovered || isSelected) && (
        <Html position={[0, 11, 0]} center distanceFactor={28}>
          <div className="bg-slate-950/90 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/60 shadow-xl font-mono text-[11px] pointer-events-none whitespace-nowrap flex items-center space-x-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span className="font-bold">Habitat Dome</span>
            <span className="text-slate-400">| O₂: {Math.round(oxygenLevel)}%</span>
            <span className="text-emerald-400">| Crew: {astronautCount}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

