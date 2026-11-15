import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGame } from '../../context/GameContext';
import { LunarTerrain } from './LunarTerrain';
import { CelestialSky } from './CelestialSky';
import { HabitatDome } from './HabitatDome';
import { SolarArrayFarm } from './SolarArrayFarm';
import { OxygenFacility } from './OxygenFacility';
import { GreenhouseBioDome } from './GreenhouseBioDome';
import { ResearchLab } from './ResearchLab';
import { RadiationShelter } from './RadiationShelter';
import { LunarRover } from './LunarRover';
import { AstronautCrew } from './AstronautCrew';
import { CameraRig } from './CameraRig';
import { CameraMode, InteractiveBuildingId } from './types';
import { WebGLFallback } from './WebGLFallback';
import { InteractivePlayer } from './InteractivePlayer';
import { CollectibleSamples } from './CollectibleSamples';
import { ScienceSample } from '../../types/solar';

interface LunarSceneProps {
  cameraMode: CameraMode;
  selectedBuilding: InteractiveBuildingId | null;
  onSelectBuilding: (id: InteractiveBuildingId) => void;
  onSelectSample?: (sample: ScienceSample) => void;
  onNearInteractable?: (interactable: { name: string; type: string; distance: number; actionText: string } | null) => void;
}

export const LunarScene: React.FC<LunarSceneProps> = ({
  cameraMode,
  selectedBuilding,
  onSelectBuilding,
  onSelectSample,
  onNearInteractable
}) => {
  const {
    scenario,
    currentHour,
    resources,
    dustLevel,
    activeSolarStorm,
    subsystems,
    crew,
    sciencePoints,
    collectSample
  } = useGame();

  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 14]);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  const isDaytime = currentHour >= 6 && currentHour <= 19;

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#090d16] select-none">
      <Canvas
        shadows
        camera={{ position: [0, 16, 26], fov: 46, near: 0.5, far: 500 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance'
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* 1. Clean, Bright Soft Ambient Lighting */}
          <ambientLight color="#e2e8f0" intensity={1.25} />

          {/* 2. Key Sun Directional Light with Shadows */}
          <directionalLight
            position={[-60, 50, -50]}
            intensity={1.8}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0005}
          />

          {/* 3. Soft Earthshine Blue Fill Light */}
          <directionalLight
            position={[40, 30, 40]}
            intensity={0.5}
            color="#38bdf8"
          />

          {/* 4. Deep Space Sky & Visible Earth */}
          <CelestialSky
            activeSolarStorm={activeSolarStorm}
            isDaytime={isDaytime}
            isMars={false}
          />

          {/* 5. Clean Low-Poly Moon Terrain with Walking Paths */}
          <LunarTerrain isMars={false} />

          {/* 6. Interactive Structures */}
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

          <OxygenFacility
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

          {/* Autonomous Rover */}
          <LunarRover
            isSelected={selectedBuilding === 'rover'}
            onSelect={onSelectBuilding}
            roverBattery={Math.round(resources.energy.current * 0.9)}
          />

          {/* Astronaut Crew EVA Models */}
          <AstronautCrew crew={crew} />

          {/* Interactive Playable Cute Cartoon Astronaut */}
          <InteractivePlayer
            destination="moon"
            onPositionChange={setPlayerPos}
            onNearInteractable={onNearInteractable}
          />

          {/* Floating Collectible Samples */}
          <CollectibleSamples
            destination="moon"
            playerPosition={playerPos}
            onCollect={sample => {
              if (onSelectSample) {
                onSelectSample(sample);
              } else {
                collectSample(sample);
              }
            }}
          />

          {/* Camera Rig (Yields authority to InteractivePlayer follower camera) */}
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
