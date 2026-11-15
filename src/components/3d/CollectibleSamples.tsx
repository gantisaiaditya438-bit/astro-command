import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { ScienceSample } from '../../types/solar';
import { DISCOVERABLE_SAMPLES } from '../../data/planetaryMissions';

interface CollectibleSamplesProps {
  destination: 'moon' | 'mars';
  playerPosition: [number, number, number];
  onCollect: (sample: ScienceSample) => void;
}

export const CollectibleSamples: React.FC<CollectibleSamplesProps> = ({
  destination,
  playerPosition,
  onCollect
}) => {
  const { collectedSamples } = useGame();

  // Filter samples based on destination
  const destinationSamples: Array<{ sample: ScienceSample; pos: [number, number, number] }> =
    destination === 'moon'
      ? [
          { sample: DISCOVERABLE_SAMPLES[0], pos: [-12, 0.4, 22] }, // Lunar Basalt
          { sample: DISCOVERABLE_SAMPLES[1], pos: [22, 0.4, 26] }   // Shackleton Ice
        ]
      : [
          { sample: DISCOVERABLE_SAMPLES[2], pos: [20, 0.4, 22] },  // Jezero Clay
          { sample: DISCOVERABLE_SAMPLES[3], pos: [-20, 0.4, 18] }  // Shergottite
        ];

  return (
    <group>
      {destinationSamples.map(({ sample, pos }) => {
        const isCollected = collectedSamples.some(c => c.id === sample.id);
        if (isCollected) return null;

        return (
          <SampleItem
            key={sample.id}
            sample={sample}
            position={pos}
            playerPosition={playerPosition}
            onCollect={() => onCollect(sample)}
          />
        );
      })}
    </group>
  );
};

const SampleItem: React.FC<{
  sample: ScienceSample;
  position: [number, number, number];
  playerPosition: [number, number, number];
  onCollect: () => void;
}> = ({ sample, position, playerPosition, onCollect }) => {
  const meshRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const [inRange, setInRange] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.5;
      meshRef.current.position.y = position[1] + 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.12;
    }

    if (beaconRef.current) {
      const pulse = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }

    // Check distance to player
    const dist = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    );
    setInRange(dist < 5.0);
  });

  const isIce = sample.category === 'life_support';

  return (
    <group position={position}>
      {/* Vertical Beacon Light Pillar */}
      <mesh ref={beaconRef} position={[0, 4, 0]}>
        <cylinderGeometry args={[0.08, 0.2, 8, 12]} />
        <meshBasicMaterial
          color={isIce ? '#38bdf8' : '#eab308'}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Floating Rotating Geological Crystal/Rock Mesh */}
      <group
        ref={meshRef}
        onClick={e => {
          e.stopPropagation();
          onCollect();
        }}
      >
        <mesh castShadow>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color={isIce ? '#7dd3fc' : '#fbbf24'}
            emissive={isIce ? '#0284c7' : '#d97706'}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* Floating Prompt Tag */}
      <Html position={[0, 1.6, 0]} center distanceFactor={24}>
        <div
          onClick={onCollect}
          className={`px-2.5 py-1 rounded-xl text-[10px] font-mono whitespace-nowrap cursor-pointer transition shadow-xl backdrop-blur-md flex items-center space-x-1.5 ${
            inRange
              ? 'bg-amber-500 text-black font-extrabold border-2 border-white scale-110 animate-pulse'
              : 'bg-slate-950/85 text-amber-300 border border-amber-500/50'
          }`}
        >
          <span>✨</span>
          <span>{inRange ? `[E / Tap] Collect: ${sample.name}` : sample.name}</span>
          <span className="text-emerald-400 font-bold">+{sample.scienceValue} pts</span>
        </div>
      </Html>
    </group>
  );
};
