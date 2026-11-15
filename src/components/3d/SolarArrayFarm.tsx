import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveBuildingId } from './types';

interface SolarArrayFarmProps {
  isSelected: boolean;
  onSelect: (id: InteractiveBuildingId) => void;
  energyLevel: number;
  dustLevel: number;
}

export const SolarArrayFarm: React.FC<SolarArrayFarmProps> = ({
  isSelected,
  onSelect,
  energyLevel,
  dustLevel
}) => {
  const [hovered, setHovered] = useState(false);
  const panelsRef1 = useRef<THREE.Group>(null);
  const panelsRef2 = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Subtle sun-tracking angle adjustment
    const sunAngle = -0.35 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    if (panelsRef1.current) {
      panelsRef1.current.rotation.x = sunAngle;
    }
    if (panelsRef2.current) {
      panelsRef2.current.rotation.x = sunAngle;
    }

    if (pulseRef.current && (hovered || isSelected)) {
      pulseRef.current.rotation.y += delta * 1.5;
    }
  });

  // Calculate panel color based on dust accumulation
  // Clean: deep navy blue (#1d4ed8); High dust: grayish brown (#94a3b8 / #78716c)
  const dustFactor = Math.min(1, Math.max(0, dustLevel / 100));
  const panelColor = new THREE.Color('#1d4ed8').lerp(new THREE.Color('#78716c'), dustFactor * 0.7);

  return (
    <group
      position={[-16, 0, -10]}
      onClick={e => {
        e.stopPropagation();
        onSelect('solar_station');
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
        <boxGeometry args={[16, 0.3, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Array 1 (Left) */}
      <group position={[-4.5, 0, 0]}>
        {/* Support Mast */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, 5, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Crossbar & Rotary Joint */}
        <mesh position={[0, 4.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 2.8, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Tilting Solar Panel Wings */}
        <group ref={panelsRef1} position={[0, 4.8, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[6.2, 0.12, 3.8]} />
            <meshStandardMaterial
              color={panelColor}
              roughness={0.25 + dustFactor * 0.5}
              metalness={0.85 - dustFactor * 0.4}
            />
          </mesh>
        </group>
      </group>

      {/* Array 2 (Right) */}
      <group position={[4.5, 0, 0]}>
        {/* Support Mast */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, 5, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Crossbar & Rotary Joint */}
        <mesh position={[0, 4.8, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 2.8, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Tilting Solar Panel Wings */}
        <group ref={panelsRef2} position={[0, 4.8, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[6.2, 0.12, 3.8]} />
            <meshStandardMaterial
              color={panelColor}
              roughness={0.25 + dustFactor * 0.5}
              metalness={0.85 - dustFactor * 0.4}
            />
          </mesh>
        </group>
      </group>

      {/* Battery Storage Vault (Center low unit) */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.4, 2.2]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Battery Status Indicator Glow */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={energyLevel > 20 ? '#f59e0b' : '#ef4444'} />
      </mesh>

      {/* Selection Halo */}
      {(hovered || isSelected) && (
        <mesh ref={pulseRef} position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8.5, 9.2, 32]} />
          <meshBasicMaterial
            color="#f59e0b"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Overhead 3D Floating Tag */}
      {(hovered || isSelected) && (
        <Html position={[0, 8.5, 0]} center distanceFactor={28}>
          <div className="bg-slate-950/90 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/60 shadow-xl font-mono text-[11px] pointer-events-none whitespace-nowrap flex items-center space-x-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            <span className="font-bold">Solar Power Station</span>
            <span className="text-white">| Pwr: {Math.round(energyLevel)}%</span>
            <span className={dustLevel > 30 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
              | Dust: {dustLevel}%
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};

