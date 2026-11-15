import React, { useState, useEffect } from 'react';
import { MarsScene } from './MarsScene';
import { AAAGameHUD } from '../3d/AAAGameHUD';
import { BuildingInteractionModal } from '../3d/BuildingInteractionModal';
import { SystemsControlModal } from '../SystemsControlModal';
import { EventModal } from '../EventModal';
import { CameraMode, InteractiveBuildingId } from '../3d/types';
import { DISCOVERABLE_SAMPLES } from '../../data/planetaryMissions';
import { useGame } from '../../context/GameContext';
import { MobileControlsOverlay } from '../3d/MobileControlsOverlay';
import { SampleDiscoveryModal } from '../3d/SampleDiscoveryModal';
import { MarsEmergencyMission } from './MarsEmergencyMission';
import { ScienceSample } from '../../types/solar';
import { soundEffects } from '../../services/soundEffects';
import { Sparkles, Compass } from 'lucide-react';

export const MarsView: React.FC = () => {
  const {
    controlMode,
    collectSample,
    collectedSamples
  } = useGame();

  const [cameraMode, setCameraMode] = useState<CameraMode>('overview');
  const [selectedBuilding, setSelectedBuilding] = useState<InteractiveBuildingId | null>(null);
  const [isSystemsModalOpen, setIsSystemsModalOpen] = useState(false);
  const [activeSample, setActiveSample] = useState<ScienceSample | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Mars Emergency: Save the Crew scenario state
  const [emergencyActive, setEmergencyActive] = useState(true);
  const [isRepairing, setIsRepairing] = useState(false);
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 14]);

  // Proximity interactable object (from InteractivePlayer)
  const [nearInteractable, setNearInteractable] = useState<{
    name: string;
    type: string;
    distance: number;
    actionText: string;
  } | null>(null);

  // Smooth loading animation to prevent blank screen while Three.js initializes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSceneReady(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard 'E' interaction handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        if (nearInteractable) {
          soundEffects.playClick();
          if (
            nearInteractable.type === 'habitat' ||
            nearInteractable.type === 'oxygen_facility' ||
            nearInteractable.type === 'solar_station' ||
            nearInteractable.type === 'greenhouse' ||
            nearInteractable.type === 'research_lab' ||
            nearInteractable.type === 'radiation_shelter' ||
            nearInteractable.type === 'rover'
          ) {
            setSelectedBuilding(nearInteractable.type as InteractiveBuildingId);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearInteractable]);

  const handleCollectActive = () => {
    const uncollectedMars = DISCOVERABLE_SAMPLES.filter(
      s => s.destination === 'mars' && !collectedSamples.some(c => c.id === s.id)
    );
    if (uncollectedMars.length > 0) {
      setActiveSample(uncollectedMars[0]);
    }
  };

  const handleProximityClick = () => {
    if (!nearInteractable) return;
    soundEffects.playClick();
    if (
      nearInteractable.type === 'habitat' ||
      nearInteractable.type === 'oxygen_facility' ||
      nearInteractable.type === 'solar_station' ||
      nearInteractable.type === 'greenhouse' ||
      nearInteractable.type === 'research_lab' ||
      nearInteractable.type === 'radiation_shelter' ||
      nearInteractable.type === 'rover'
    ) {
      setSelectedBuilding(nearInteractable.type as InteractiveBuildingId);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-62px)] overflow-hidden bg-[#2a0e08] animate-fadeIn select-none">
      {/* Loading Overlay (Eliminates Blank Transitions) */}
      {!isSceneReady && (
        <div className="absolute inset-0 z-50 bg-[#1e0804] flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-3xl shadow-2xl animate-bounce mb-4 border border-rose-400">
            🚀
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
            ENTERING MARS ORBIT — JEZERO BASE ALPHA
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/90 font-mono mt-1">
            Calibrating atmospheric life support & 3D low-poly terrain...
          </p>
          <div className="w-64 h-2 bg-slate-950 rounded-full mt-4 overflow-hidden border border-amber-900/50">
            <div className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* 1. Full 3D Mars Jezero Crater Scene */}
      <MarsScene
        cameraMode={cameraMode}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={setSelectedBuilding}
        onSelectSample={sample => setActiveSample(sample)}
        emergencyActive={emergencyActive}
        isRepairing={isRepairing}
        onPlayerPosChange={setPlayerPos}
        onNearInteractable={setNearInteractable}
      />

      {/* 2. Proximity Interaction Floating Prompt (Center-Bottom) */}
      {nearInteractable && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 animate-bounce pointer-events-auto">
          <button
            onClick={handleProximityClick}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-black text-xs sm:text-sm shadow-2xl border-2 border-amber-300 flex items-center space-x-2 transition hover:scale-105"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
            <span>{nearInteractable.actionText}: {nearInteractable.name}</span>
            <span className="text-[10px] bg-black text-amber-300 px-1.5 py-0.5 rounded font-mono">
              [E]
            </span>
          </button>
        </div>
      )}

      {/* 3. Clean HUD (Collapsible Panels & Clear 3D View) */}
      <AAAGameHUD
        destination="mars"
        cameraMode={cameraMode}
        onSetCameraMode={setCameraMode}
        onSelectBuilding={setSelectedBuilding}
        onOpenPowerGrid={() => setIsSystemsModalOpen(true)}
      />

      {/* 4. Mars Emergency Mission Task Directive */}
      {emergencyActive && (
        <MarsEmergencyMission
          playerPosition={playerPos}
          onSetRepairing={setIsRepairing}
          onCloseMission={() => setEmergencyActive(false)}
        />
      )}

      {/* 5. Building Telemetry Modal */}
      <BuildingInteractionModal
        buildingId={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onOpenPowerGrid={() => {
          setSelectedBuilding(null);
          setIsSystemsModalOpen(true);
        }}
      />

      {/* 6. Power Grid Modal */}
      <SystemsControlModal
        isOpen={isSystemsModalOpen}
        onClose={() => setIsSystemsModalOpen(false)}
      />

      {/* 7. Dynamic Emergency Event Popups */}
      <EventModal />

      {/* 8. Virtual Touch / Movement Controls Overlay */}
      {controlMode !== 'free_cam' && (
        <MobileControlsOverlay onCollectSample={handleCollectActive} />
      )}

      {/* 9. Sample Discovery Modal */}
      <SampleDiscoveryModal
        sample={activeSample}
        onClose={() => setActiveSample(null)}
        onCollect={sample => {
          collectSample(sample);
        }}
        isAlreadyCollected={
          activeSample ? collectedSamples.some(c => c.id === activeSample.id) : false
        }
      />
    </div>
  );
};
