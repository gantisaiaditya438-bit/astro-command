import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveBuildingId } from './types';

interface LunarRoverProps {
  isSelected: boolean;
  onSelect: (id: InteractiveBuildingId) => void;
  roverBattery: number;
}

export const LunarRover: React.FC<LunarRoverProps> = ({
  isSelected,
  onSelect,
  roverBattery
}) => {
  const [hovered, setHovered] = useState(false);
  const roverGroupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const mastHeadRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Drive along an elliptical path in front of base (around craters)
    if (roverGroupRef.current) {
      const t = state.clock.elapsedTime * 0.25;
      const radiusX = 22;
      const radiusZ = 16;
      const x = Math.sin(t) * radiusX;
      const z = Math.cos(t) * radiusZ + 12;

      // Calculate tangent heading angle
      const nextX = Math.sin(t + 0.02) * radiusX;
      const nextZ = Math.cos(t + 0.02) * radiusZ + 12;
      const angle = Math.atan2(nextX - x, nextZ - z);

      roverGroupRef.current.position.set(x, 0.45, z);
      roverGroupRef.current.rotation.y = angle;

      // Rotate wheels as rover drives
      wheelsRef.current.forEach(wheel => {
        if (wheel) wheel.rotation.x += delta * 6;
      });
    }

    if (mastHeadRef.current) {
      mastHeadRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.4;
    }
  });

  return (
    <group
      ref={roverGroupRef}
      position={[0, 0.45, 18]}
      onClick={e => {
        e.stopPropagation();
        onSelect('rover');
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
      {/* Rover Body Chassis */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.8, 0.65, 2.6]} />
        <meshStandardMaterial
          color={hovered || isSelected ? '#38bdf8' : '#e2e8f0'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Gold Foil Thermal Insulation Wrap on Rear Bay */}
      <mesh position={[0, 0.6, -0.6]} castShadow>
        <boxGeometry args={[1.6, 0.55, 1.2]} />
        <meshStandardMaterial
          color="#eab308"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Sensor Mast */}
      <group position={[0, 0.85, 0.8]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 1.2, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Mast Camera Head */}
        <group ref={mastHeadRef} position={[0, 1.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.25, 0.3]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Dual Optical Lenses */}
          <mesh position={[-0.1, 0, 0.16]}>
            <circleGeometry args={[0.06, 12]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
          <mesh position={[0.1, 0, 0.16]}>
            <circleGeometry args={[0.06, 12]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        </group>
      </group>

      {/* 6 High-Grip Wire Mesh Wheels */}
      {[-0.95, 0, 0.95].map((zPos, idx) => (
        <React.Fragment key={idx}>
          {/* Left Wheel */}
          <group
            ref={el => {
              if (el) wheelsRef.current[idx * 2] = el;
            }}
            position={[-1.1, 0.35, zPos]}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.32, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
            </mesh>
          </group>

          {/* Right Wheel */}
          <group
            ref={el => {
              if (el) wheelsRef.current[idx * 2 + 1] = el;
            }}
            position={[1.1, 0.35, zPos]}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.32, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
            </mesh>
          </group>
        </React.Fragment>
      ))}

      {/* Overhead 3D Floating Tag */}
      {(hovered || isSelected) && (
        <Html position={[0, 2.8, 0]} center distanceFactor={24}>
          <div className="bg-slate-950/90 text-cyan-300 px-2 py-0.5 rounded-lg border border-cyan-500/60 shadow-xl font-mono text-[10px] pointer-events-none whitespace-nowrap flex items-center space-x-1 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span className="font-bold">Autonomous Rover "Hermes"</span>
            <span className="text-amber-400">| Bat: {roverBattery}%</span>
          </div>
        </Html>
      )}
    </group>
  );
};

