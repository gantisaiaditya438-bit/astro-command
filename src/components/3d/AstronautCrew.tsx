import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CrewMember } from '../../types';

interface AstronautCrewProps {
  crew: CrewMember[];
}

export const AstronautCrew: React.FC<AstronautCrewProps> = ({ crew }) => {
  // Define base positions for each specialist near their respective modules
  const crewPositions: [number, number, number][] = [
    [1.5, 0, 8.5],    // Maya Lin (Commander) near airlock
    [-11.5, 0, 6.5],  // Alex Vance (Life Support) near Oxygen Facility
    [-10, 0, -8],     // Kiran Patel (Power) near Solar Arrays
    [11, 0, 3.5]      // Elena Rossi (Botanist) near Greenhouse
  ];

  return (
    <group>
      {crew.map((member, idx) => (
        <AstronautModel
          key={member.id}
          member={member}
          basePosition={crewPositions[idx] || [0, 0, 5 + idx * 2]}
        />
      ))}
    </group>
  );
};

const AstronautModel: React.FC<{
  member: CrewMember;
  basePosition: [number, number, number];
}> = ({ member, basePosition }) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (groupRef.current) {
      // Gentle fractional gravity breathing bob
      const bob = Math.sin(state.clock.elapsedTime * 2 + member.health) * 0.04;
      groupRef.current.position.y = basePosition[1] + bob;
    }
  });

  return (
    <group
      ref={groupRef}
      position={basePosition}
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
      {/* Torso & Spacesuit Pressure Garment */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.65, 8, 12]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Primary Life Support System Backpack (PLSS) */}
      <mesh position={[0, 1.35, -0.32]} castShadow>
        <boxGeometry args={[0.55, 0.75, 0.28]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Mini O2 Tank Tubes on Backpack */}
      <mesh position={[-0.15, 1.75, -0.32]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      <mesh position={[0.15, 1.75, -0.32]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Extravehicular Visor Helmet */}
      <group ref={headRef} position={[0, 1.95, 0]}>
        {/* Helmet Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* Gold Reflective Solar Visor */}
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.26, 16, 16, 0, Math.PI, 0, Math.PI * 0.7]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#ca8a04"
            emissiveIntensity={0.3}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.18, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.6, 6, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
      <mesh position={[0.18, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.6, 6, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>

      {/* Boots */}
      <mesh position={[-0.18, 0.1, 0.05]} castShadow>
        <boxGeometry args={[0.24, 0.18, 0.38]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 0.1, 0.05]} castShadow>
        <boxGeometry args={[0.24, 0.18, 0.38]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.45, 1.25, 0]} rotation={[0, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 6, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
      <mesh position={[0.45, 1.25, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 6, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>

      {/* Overhead Astronaut Status Tag */}
      {hovered && (
        <Html position={[0, 2.7, 0]} center distanceFactor={22}>
          <div className="bg-slate-950/90 text-white px-2 py-0.5 rounded-lg border border-cyan-500/60 shadow-xl font-mono text-[10px] pointer-events-none whitespace-nowrap flex items-center space-x-1.5 backdrop-blur-md">
            <span>{member.avatar}</span>
            <span className="font-bold text-cyan-300">{member.name}</span>
            <span className="text-emerald-400 font-semibold">{Math.round(member.health)}% HP</span>
          </div>
        </Html>
      )}
    </group>
  );
};

