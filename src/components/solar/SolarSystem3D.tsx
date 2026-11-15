import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SOLAR_SYSTEM_PLANETS } from '../../data/planetsData';
import { PlanetData, PlanetId } from '../../types/solar';

interface SolarSystem3DProps {
  selectedPlanetId: PlanetId | null;
  onSelectPlanet: (id: PlanetId) => void;
}

export const SolarSystem3D: React.FC<SolarSystem3DProps> = ({
  selectedPlanetId,
  onSelectPlanet
}) => {
  const controlsRef = useRef<any>(null);
  const planetPositionsRef = useRef<{ [key: string]: THREE.Vector3 }>({});

  const handleUpdatePlanetPos = (id: PlanetId, pos: THREE.Vector3) => {
    planetPositionsRef.current[id] = pos;
  };

  return (
    <group>
      {/* 1. Deep Space Starfield & Color Nebulae Dust */}
      <DeepSpaceEnvironment />

      {/* 2. Cinematic Lighting */}
      <ambientLight intensity={0.4} color="#94a3b8" />
      <pointLight position={[0, 0, 0]} intensity={3.8} color="#fffbeb" distance={450} decay={1.1} />

      {/* 3. Render Center Sun & All Planets */}
      {SOLAR_SYSTEM_PLANETS.map(planet => (
        <PlanetNode
          key={planet.id}
          planet={planet}
          isSelected={selectedPlanetId === planet.id}
          onSelect={() => onSelectPlanet(planet.id)}
          onPositionUpdate={pos => handleUpdatePlanetPos(planet.id, pos)}
        />
      ))}

      {/* 4. Artemis / Orion Spacecraft Flyby in Deep Space */}
      <SpacecraftVoyager />

      {/* 5. Smooth Camera Target Controller */}
      <CameraTargetLerp
        controlsRef={controlsRef}
        selectedPlanetId={selectedPlanetId}
        planetPositions={planetPositionsRef.current}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        minDistance={8}
        maxDistance={220}
        maxPolarAngle={Math.PI / 2 + 0.35}
      />
    </group>
  );
};

// --- Deep Space Ambient Background & Nebulae ---
const DeepSpaceEnvironment: React.FC = () => {
  const starsCount = 1400;

  const [starPositions, starColors] = useMemo(() => {
    const pos = new Float32Array(starsCount * 3);
    const col = new Float32Array(starsCount * 3);
    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#bae6fd'),
      new THREE.Color('#fef08a'),
      new THREE.Color('#fed7aa'),
      new THREE.Color('#c084fc')
    ];

    for (let i = 0; i < starsCount; i++) {
      // Distribute stars on outer sphere shell
      const radius = 240 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, []);

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starsCount}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starsCount}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.4}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation={true}
        />
      </points>

      {/* Colorful Deep Nebulae Glow Cloud Spheres */}
      <mesh position={[-160, 40, -180]}>
        <sphereGeometry args={[75, 16, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.035} side={THREE.BackSide} />
      </mesh>
      <mesh position={[180, -30, -150]}>
        <sphereGeometry args={[85, 16, 16]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.035} side={THREE.BackSide} />
      </mesh>
      <mesh position={[40, -80, 190]}>
        <sphereGeometry args={[80, 16, 16]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

// --- Individual Planet Node with Axial Spin & Sun Corona ---
const PlanetNode: React.FC<{
  planet: PlanetData;
  isSelected: boolean;
  onSelect: () => void;
  onPositionUpdate: (pos: THREE.Vector3) => void;
}> = ({ planet, isSelected, onSelect, onPositionUpdate }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const coronaOuterRef = useRef<THREE.Mesh>(null);
  const orbitAngle = useRef<number>(Math.random() * Math.PI * 2);

  const isSun = planet.id === 'sun';
  const axialTilt = isSun ? 0 : planet.id === 'uranus' ? 1.7 : 0.4;

  useFrame((state, delta) => {
    // 1. Orbital revolution around the Sun
    if (planet.orbitRadius3D > 0 && groupRef.current) {
      orbitAngle.current += delta * planet.orbitSpeed * 0.6;
      const x = Math.cos(orbitAngle.current) * planet.orbitRadius3D;
      const z = Math.sin(orbitAngle.current) * planet.orbitRadius3D;
      groupRef.current.position.set(x, 0, z);
      onPositionUpdate(groupRef.current.position);
    } else if (isSun && groupRef.current) {
      onPositionUpdate(groupRef.current.position);
    }

    // 2. Planet axial rotation (spin on own axis)
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * (isSun ? 0.2 : 0.8);
    }

    // 3. Sun Corona Pulsation
    if (isSun) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.5);
      if (coronaRef.current) {
        coronaRef.current.scale.setScalar(1 + pulse * 0.05);
        coronaRef.current.rotation.z += delta * 0.15;
      }
      if (coronaOuterRef.current) {
        coronaOuterRef.current.scale.setScalar(1 + Math.cos(state.clock.elapsedTime * 1.8) * 0.08);
        coronaOuterRef.current.rotation.z -= delta * 0.08;
      }
    }
  });

  return (
    <group>
      {/* Orbital Elliptical Guide Line */}
      {planet.orbitRadius3D > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.orbitRadius3D - 0.07, planet.orbitRadius3D + 0.07, 96]} />
          <meshBasicMaterial
            color={isSelected ? '#38bdf8' : '#334155'}
            side={THREE.DoubleSide}
            transparent
            opacity={isSelected ? 0.7 : 0.22}
          />
        </mesh>
      )}

      {/* Planet / Sun Group */}
      <group
        ref={groupRef}
        position={[planet.orbitRadius3D, 0, 0]}
        onClick={e => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {/* Tilting Group for realistic planetary obliquity */}
        <group rotation={[0, 0, axialTilt]}>
          {/* Main Planetary Body Sphere */}
          <mesh ref={sphereRef} castShadow receiveShadow>
            <sphereGeometry args={[planet.scale3D, 36, 28]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={planet.emissiveColor || '#000000'}
              emissiveIntensity={isSun ? 1.0 : 0.12}
              roughness={isSun ? 0.0 : 0.65}
              metalness={0.15}
            />
          </mesh>

          {/* Earth Atmospheric Glow Layer */}
          {planet.id === 'earth' && (
            <mesh>
              <sphereGeometry args={[planet.scale3D * 1.06, 24, 24]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
            </mesh>
          )}

          {/* Sun Pulsating Coronal Aura Shells */}
          {isSun && (
            <>
              <mesh ref={coronaRef}>
                <sphereGeometry args={[planet.scale3D * 1.18, 32, 32]} />
                <meshBasicMaterial color="#fbbf24" transparent opacity={0.35} />
              </mesh>
              <mesh ref={coronaOuterRef}>
                <sphereGeometry args={[planet.scale3D * 1.35, 32, 32]} />
                <meshBasicMaterial color="#f97316" transparent opacity={0.18} />
              </mesh>
            </>
          )}

          {/* Saturn Multi-ring system with shadow transparency */}
          {planet.ringSystem && (
            <mesh rotation={[-Math.PI / 2.7, 0, 0]}>
              <ringGeometry args={[planet.scale3D * 1.3, planet.scale3D * 2.45, 64]} />
              <meshStandardMaterial
                color="#fef08a"
                side={THREE.DoubleSide}
                transparent
                opacity={0.82}
                roughness={0.4}
              />
            </mesh>
          )}

          {/* Uranus Vertical Ring */}
          {planet.id === 'uranus' && (
            <mesh rotation={[0.4, 0, Math.PI / 2]}>
              <ringGeometry args={[planet.scale3D * 1.3, planet.scale3D * 1.6, 40]} />
              <meshBasicMaterial color="#a5f3fc" side={THREE.DoubleSide} transparent opacity={0.45} />
            </mesh>
          )}
        </group>

        {/* Selected Target Pulse Beacon Ring */}
        {isSelected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.scale3D * 1.5, planet.scale3D * 1.7, 48]} />
            <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} transparent opacity={0.9} />
          </mesh>
        )}

        {/* Interactive Floating Label HUD */}
        <Html position={[0, planet.scale3D + 1.25, 0]} center distanceFactor={48}>
          <div
            onClick={onSelect}
            className={`px-2.5 py-1 rounded-xl font-mono text-[11px] whitespace-nowrap cursor-pointer transition shadow-2xl backdrop-blur-md flex items-center space-x-1.5 ${
              isSelected
                ? 'bg-cyan-500 text-black font-extrabold border-2 border-white scale-110 shadow-cyan-500/50'
                : 'bg-slate-950/85 text-slate-200 border border-slate-700/80 hover:border-cyan-400 hover:text-white'
            }`}
          >
            <span>{planet.name}</span>
            {planet.isPlayableDestination && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-900/90 text-cyan-300 font-bold border border-cyan-500/50">
                3D BASE
              </span>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
};

// --- Artemis / Orion Spacecraft Flyby ---
const SpacecraftVoyager: React.FC = () => {
  const shipRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(0.8);

  useFrame((state, delta) => {
    angleRef.current += delta * 0.25;
    if (shipRef.current) {
      // Spacecraft travels in an orbital transfer ellipse between Earth and Mars
      const r = 26 + Math.sin(angleRef.current * 0.5) * 6;
      const x = Math.cos(angleRef.current) * r;
      const z = Math.sin(angleRef.current) * r;
      shipRef.current.position.set(x, 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.4, z);
      shipRef.current.rotation.y = -angleRef.current + Math.PI / 2;
    }

    if (thrusterRef.current) {
      const flicker = 0.7 + Math.sin(state.clock.elapsedTime * 20) * 0.3;
      (thrusterRef.current.material as THREE.MeshBasicMaterial).opacity = flicker;
    }
  });

  return (
    <group ref={shipRef} position={[24, 1.2, 0]}>
      {/* Spacecraft Capsule */}
      <mesh castShadow>
        <coneGeometry args={[0.3, 0.7, 8]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Service Module */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.35, 8]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      {/* Blue Ion Engine Thruster Flame */}
      <mesh ref={thrusterRef} position={[0, -0.65, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.15, 0.35, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
      </mesh>
    </group>
  );
};

// --- Smooth Camera Lerp on Planet Select ---
const CameraTargetLerp: React.FC<{
  controlsRef: React.RefObject<any>;
  selectedPlanetId: PlanetId | null;
  planetPositions: { [key: string]: THREE.Vector3 };
}> = ({ controlsRef, selectedPlanetId, planetPositions }) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (selectedPlanetId && planetPositions[selectedPlanetId]) {
      const targetPos = planetPositions[selectedPlanetId];
      // Lerp OrbitControls target to focused planet
      controlsRef.current.target.lerp(targetPos, delta * 2.5);
    } else {
      // Return to center Sun
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), delta * 2.0);
    }
    controlsRef.current.update();
  });

  return null;
};
