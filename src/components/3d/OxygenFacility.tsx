import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveBuildingId } from './types';

interface OxygenFacilityProps {
  isSelected: boolean;
  onSelect: (id: InteractiveBuildingId) => void;
  oxygenLevel: number;
}

export const OxygenFacility: React.FC<OxygenFacilityProps> = ({
  isSelected,
  onSelect,
  oxygenLevel
}) => {
  const [hovered, setHovered] = useState(false);
  const ventRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const isCritical = oxygenLevel < 25;

  useFrame((state, delta) => {
    // Vent steam pulse
    if (ventRef.current) {
      const t = (state.clock.elapsedTime * 2.5) % 1;
      ventRef.current.position.y = 5.2 + t * 1.5;
      ventRef.current.scale.set(1 + t * 1.2, 1 + t * 1.2, 1 + t * 1.2);
    }

    // Emergency beacon pulse
    if (beaconRef.current && isCritical) {
      const flash = Math.sin(state.clock.elapsedTime * 10) > 0;
      beaconRef.current.visible = flash;
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
      {/* Concrete Foundation Pad */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[8, 0.3, 7]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Sabatier Catalyst Reactor Tower (Center) */}
      <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 5.2, 16]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#38bdf8' : '#e2e8f0'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Blue Band Ring with O2 Label */}
      <mesh position={[0, 3.8, 0]}>
        <cylinderGeometry args={[1.62, 1.62, 0.6, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* High-Pressure Cryogenic Tank 1 (Left) */}
      <mesh position={[-2.4, 2.2, 1.2]} castShadow>
        <capsuleGeometry args={[0.9, 2.6, 12, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* High-Pressure Cryogenic Tank 2 (Right) */}
      <mesh position={[2.4, 2.2, 1.2]} castShadow>
        <capsuleGeometry args={[0.9, 2.6, 12, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cooling Pipes and Conduits */}
      <mesh position={[0, 1.2, -1.8]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 5, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Vent Steam Exhaust Puff */}
      <group ref={ventRef} position={[0, 5.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Emergency Beacon Strobe */}
      <mesh ref={beaconRef} position={[0, 5.7, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Selection Ring */}
      {(hovered || isSelected) && (
        <mesh ref={ringRef} position={[0, 0.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.2, 5.8, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Overhead 3D Floating Tag */}
      {(hovered || isSelected) && (
        <Html position={[0, 7.5, 0]} center distanceFactor={28}>
          <div className="bg-slate-950/90 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/60 shadow-xl font-mono text-[11px] pointer-events-none whitespace-nowrap flex items-center space-x-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span className="font-bold">ECLSS Oxygen Plant</span>
            <span className={isCritical ? 'text-red-400 font-bold' : 'text-slate-300'}>
              | O₂: {Math.round(oxygenLevel)}%
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};

