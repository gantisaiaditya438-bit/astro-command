import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CelestialSkyProps {
  activeSolarStorm: boolean;
  isDaytime: boolean;
  isMars: boolean;
}

export const CelestialSky: React.FC<CelestialSkyProps> = ({
  activeSolarStorm,
  isDaytime,
  isMars
}) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const sunGroupRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

  // Generate star field points
  const [starPositions, starColors] = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 220 + Math.random() * 40;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.abs(r * Math.sin(phi) * Math.sin(theta)) + 10; // Keep mostly above horizon
      positions[i * 3 + 2] = r * Math.cos(phi);

      const colorVariance = Math.random();
      if (colorVariance > 0.8) {
        // Blue-white star
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1.0;
      } else if (colorVariance > 0.6) {
        // Yellow-orange star
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.6;
      } else {
        // Pure white
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.95;
      }
    }
    return [positions, colors];
  }, []);

  // Earth texture procedural canvas
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Deep ocean blue base
    ctx.fillStyle = '#0f387d';
    ctx.fillRect(0, 0, 512, 256);

    // Continents
    ctx.fillStyle = '#1e7b45';
    // North & South America shapes
    ctx.beginPath();
    ctx.ellipse(120, 90, 45, 60, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(160, 180, 35, 65, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Europe & Africa
    ctx.fillStyle = '#2d6a4f';
    ctx.beginPath();
    ctx.ellipse(280, 80, 35, 30, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d4a373';
    ctx.beginPath();
    ctx.ellipse(290, 150, 45, 55, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Asia & Australia
    ctx.fillStyle = '#386641';
    ctx.beginPath();
    ctx.ellipse(390, 95, 75, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#bc6c25';
    ctx.beginPath();
    ctx.ellipse(420, 190, 30, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Polar ice caps
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 18);
    ctx.fillRect(0, 238, 512, 18);

    // Swirling atmospheric white clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.ellipse(140, 70, 70, 14, 0.2, 0, Math.PI * 2);
    ctx.ellipse(320, 110, 90, 16, -0.1, 0, Math.PI * 2);
    ctx.ellipse(240, 170, 80, 12, 0.15, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z += delta * 0.15;
      const s = activeSolarStorm ? 1.0 + Math.sin(Date.now() * 0.006) * 0.25 : 1.0;
      coronaRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Distant Starfield */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starColors.length / 3}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
        />
      </points>

      {/* Earth / Mars Celestial Body */}
      {!isMars ? (
        <group position={[80, 65, -120]}>
          {/* Earth Body */}
          <mesh ref={earthRef}>
            <sphereGeometry args={[12, 32, 32]} />
            <meshStandardMaterial
              map={earthTexture || undefined}
              roughness={0.65}
              metalness={0.1}
            />
          </mesh>
          {/* Atmospheric Blue Glow */}
          <mesh>
            <sphereGeometry args={[13.2, 32, 32]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.25}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      ) : (
        <group position={[80, 65, -120]}>
          {/* Distant Earth-Moon pair from Mars */}
          <mesh>
            <sphereGeometry args={[3.5, 24, 24]} />
            <meshBasicMaterial color="#3b82f6" />
          </mesh>
          <mesh position={[5, 1, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#e2e8f0" />
          </mesh>
        </group>
      )}

      {/* Sun & Corona */}
      <group ref={sunGroupRef} position={[-110, 75, -90]}>
        {/* Sun Core */}
        <mesh>
          <sphereGeometry args={[14, 32, 32]} />
          <meshBasicMaterial
            color={activeSolarStorm ? '#ff3b00' : '#fffbeb'}
          />
        </mesh>
        {/* Sun Inner Flare */}
        <mesh ref={coronaRef}>
          <planeGeometry args={[44, 44]} />
          <meshBasicMaterial
            color={activeSolarStorm ? '#ef4444' : '#fef08a'}
            transparent
            opacity={activeSolarStorm ? 0.75 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

