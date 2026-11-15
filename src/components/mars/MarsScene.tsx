import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGame } from '../../context/GameContext';
import { MarsTerrain } from './MarsTerrain';
import { MarsMoxieFacility } from './MarsMoxieFacility';
import { CelestialSky } from '../3d/CelestialSky';
import { HabitatDome } from '../3d/HabitatDome';
import { SolarArrayFarm } from '../3d/SolarArrayFarm';
import { GreenhouseBioDome } from '../3d/GreenhouseBioDome';
import { ResearchLab } from '../3d/ResearchLab';
import { RadiationShelter } from '../3d/RadiationShelter';
import { LunarRover } from '../3d/LunarRover';
import { AstronautCrew } from '../3d/AstronautCrew';
import { CameraRig } from '../3d/CameraRig';
import { CameraMode, InteractiveBuildingId } from '../3d/types';
import { InteractivePlayer } from '../3d/InteractivePlayer';
import { CollectibleSamples } from '../3d/CollectibleSamples';
import { WaypointMarker } from '../3d/WaypointMarker';
import { ScienceSample } from '../../types/solar';

interface MarsSceneProps {
  cameraMode: CameraMode;
  selectedBuilding: InteractiveBuildingId | null;
  onSelectBuilding: (id: InteractiveBuildingId) => void;
  onSelectSample?: (sample: ScienceSample) => void;
  emergencyActive?: boolean;
  emergencyStep?: number;
  isRepairing?: boolean;
  onPlayerPosChange?: (pos: [number, number, number]) => void;
  onNearInteractable?: (interactable: { name: string; type: string; distance: number; actionText: string } | null) => void;
}

export const MarsScene: React.FC<MarsSceneProps> = ({
  cameraMode,
  selectedBuilding,
  onSelectBuilding,
  onSelectSample,
  emergencyActive = false,
  emergencyStep = 1,
  isRepairing = false,
  onPlayerPosChange,
  onNearInteractable
}) => {
  const {
    currentHour,
    resources,
    dustLevel,
    activeSolarStorm,
    subsystems,
    crew,
    sciencePoints,
    collectSample
  } = useGame();

  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 14]);
  const isDaytime = currentHour >= 6 && currentHour <= 19;

  const handlePosition = (pos: [number, number, number]) => {
    setPlayerPos(pos);
    if (onPlayerPosChange) onPlayerPosChange(pos);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#2a0e08] select-none">
      <Canvas
        shadows
        camera={{ position: [0, 16, 26], fov: 46, near: 0.5, far: 500 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* 1. Warm, Bright, Cartoon Ambient Lighting (Ensures Astronaut & Buildings Are Clear) */}
          <ambientLight color="#ffedd5" intensity={1.35} />

          {/* 2. Key Directional Sunlight */}
          <directionalLight
            position={[-60, 50, -50]}
            intensity={1.75}
            color="#fff7ed"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0005}
          />

          {/* 3. Soft Orange Sky Bounce Fill */}
          <directionalLight position={[40, 30, 40]} intensity={0.5} color="#fed7aa" />

          {/* 4. Deep Space Sky */}
          <CelestialSky
            activeSolarStorm={activeSolarStorm}
            isDaytime={isDaytime}
            isMars={true}
          />

          {/* 5. Clean Low-Poly Mars Terrain with Walking Paths */}
          <MarsTerrain />

          {/* 6. Base Modules (Properly Anchored on Flat Plaza) */}
          <HabitatDome
            isSelected={selectedBuilding === 'habitat'}
            onSelect={onSelectBuilding}
            oxygenLevel={resources.oxygen.current}
            astronautCount={crew.length}
          />

          <SolarArrayFarm
            isSelected={selectedBuilding === 'solar_station'}
            onSelect={onSelectBuilding}
            energyLevel={resources.energy.current}
            dustLevel={dustLevel}
          />

          <MarsMoxieFacility
            isSelected={selectedBuilding === 'oxygen_facility'}
            onSelect={onSelectBuilding}
            oxygenLevel={resources.oxygen.current}
          />

          <GreenhouseBioDome
            isSelected={selectedBuilding === 'greenhouse'}
            onSelect={onSelectBuilding}
            foodLevel={resources.food.current}
            waterLevel={resources.water.current}
          />

          <ResearchLab
            isSelected={selectedBuilding === 'research_lab'}
            onSelect={onSelectBuilding}
            sciencePoints={sciencePoints}
            sciencePower={subsystems.scienceLabPower}
          />

          <RadiationShelter
            isSelected={selectedBuilding === 'radiation_shelter'}
            onSelect={onSelectBuilding}
            shieldLevel={resources.radiationShielding.current}
            activeSolarStorm={activeSolarStorm}
            shieldPower={subsystems.radiationShieldPower}
          />

          {/* Supply Cargo Pod */}
          <SupplyCargoPod position={[14, 0.4, 24]} isEmergency={emergencyActive} />

          {/* 7. Clear In-World Mission Objective Waypoint (One Single Clear Marker) */}
          {emergencyActive && (
            <>
              {emergencyStep <= 3 && (
                <WaypointMarker
                  position={[-15, 0, 8]}
                  title="MOXIE Oxygen Facility"
                  subtitle="Damaged Electrolysis Unit"
                  color="#ef4444"
                  playerPosition={playerPos}
                />
              )}
              {emergencyStep === 4 && (
                <WaypointMarker
                  position={[14, 0, 24]}
                  title="Cargo Supply Pod"
                  subtitle="Collect Solid Oxide Filter"
                  color="#06b6d4"
                  playerPosition={playerPos}
                />
              )}
              {emergencyStep === 5 && (
                <WaypointMarker
                  position={[-15, 0, 8]}
                  title="MOXIE Oxygen Facility"
                  subtitle="Install Replacement Filter"
                  color="#eab308"
                  playerPosition={playerPos}
                />
              )}
              {emergencyStep === 7 && (
                <WaypointMarker
                  position={[0, 0, 0]}
                  title="Habitat Airlock"
                  subtitle="Emergency Storm Shelter"
                  color="#10b981"
                  playerPosition={playerPos}
                />
              )}
            </>
          )}

          {/* 8. Rover Model in Rover Bay */}
          <LunarRover
            isSelected={selectedBuilding === 'rover'}
            onSelect={onSelectBuilding}
            roverBattery={Math.round(resources.energy.current * 0.9)}
          />

          {/* 9. NPC Astronaut Crew */}
          <AstronautCrew crew={crew} />

          {/* 10. Playable Cute Low-Poly Astronaut with Omnidirectional Controls & Camera Following */}
          <InteractivePlayer
            destination="mars"
            isRepairing={isRepairing}
            onPositionChange={handlePosition}
            onNearInteractable={onNearInteractable}
          />

          {/* 11. Floating Collectible Samples */}
          <CollectibleSamples
            destination="mars"
            playerPosition={playerPos}
            onCollect={sample => {
              if (onSelectSample) {
                onSelectSample(sample);
              } else {
                collectSample(sample);
              }
            }}
          />

          {/* 12. Camera Rig (Yields authority to InteractivePlayer follower camera) */}
          <CameraRig
            cameraMode={cameraMode}
            selectedBuilding={selectedBuilding}
            activeSolarStorm={activeSolarStorm}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Supply Cargo Pod Model
const SupplyCargoPod: React.FC<{ position: [number, number, number]; isEmergency: boolean }> = ({
  position,
  isEmergency
}) => {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.3, 1.9]} />
        <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[2.0, 0.16, 1.5]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Beacon Light */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial color={isEmergency ? '#38bdf8' : '#22c55e'} />
      </mesh>
    </group>
  );
};
