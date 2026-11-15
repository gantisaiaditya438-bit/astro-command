import React, { useState, useEffect } from 'react';
import { LunarScene } from '../3d/LunarScene';
import { AAAGameHUD } from '../3d/AAAGameHUD';
import { BuildingInteractionModal } from '../3d/BuildingInteractionModal';
import { SystemsControlModal } from '../SystemsControlModal';
import { EventModal } from '../EventModal';
import { CameraMode, InteractiveBuildingId } from '../3d/types';
import { DISCOVERABLE_SAMPLES } from '../../data/planetaryMissions';
import { useGame } from '../../context/GameContext';
import { MobileControlsOverlay } from '../3d/MobileControlsOverlay';
import { SampleDiscoveryModal } from '../3d/SampleDiscoveryModal';
import { ScienceSample } from '../../types/solar';
import { soundEffects } from '../../services/soundEffects';

export const MoonView: React.FC = () => {
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

  // Proximity interactable object (from InteractivePlayer)
  const [nearInteractable, setNearInteractable] = useState<{
    name: string;
    type: string;
    distance: number;
    actionText: string;
  } | null>(null);

  // Smooth loading animation to prevent blank screen
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
    const uncollectedMoon = DISCOVERABLE_SAMPLES.filter(
      s => s.destination === 'moon' && !collectedSamples.some(c => c.id === s.id)
    );
    if (uncollectedMoon.length > 0) {
      setActiveSample(uncollectedMoon[0]);
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
    <div className="relative w-full h-[calc(100vh-62px)] overflow-hidden bg-[#090d16] animate-fadeIn select-none">
      {/* Loading Overlay (Eliminates Blank Transitions) */}
      {!isSceneReady && (
        <div className="absolute inset-0 z-50 bg-[#060a12] flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-3xl shadow-2xl animate-bounce mb-4 border border-cyan-400">
            🌕
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
            ENTERING LUNAR SOUTH POLE — SHACKLETON BASE
          </h2>
          <p className="text-xs sm:text-sm text-cyan-200/90 font-mono mt-1">
            Initializing lunar life support & 3D low-poly terrain...
          </p>
          <div className="w-64 h-2 bg-slate-950 rounded-full mt-4 overflow-hidden border border-cyan-900/50">
            <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-400 animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* 1. Full 3D Lunar Shackleton Base Scene */}
      <LunarScene
        cameraMode={cameraMode}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={setSelectedBuilding}
        onSelectSample={sample => setActiveSample(sample)}
        onNearInteractable={setNearInteractable}
      />

      {/* 2. Proximity Interaction Floating Prompt (Center-Bottom) */}
      {nearInteractable && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 animate-bounce pointer-events-auto">
          <button
            onClick={handleProximityClick}
            className="px-4 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-black text-xs sm:text-sm shadow-2xl border-2 border-cyan-200 flex items-center space-x-2 transition hover:scale-105"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
            <span>{nearInteractable.actionText}: {nearInteractable.name}</span>
            <span className="text-[10px] bg-black text-cyan-300 px-1.5 py-0.5 rounded font-mono">
              [E]
            </span>
          </button>
        </div>
      )}

      {/* 3. Clean HUD (Collapsible Panels & Clear 3D View) */}
      <AAAGameHUD
        destination="moon"
        cameraMode={cameraMode}
        onSetCameraMode={setCameraMode}
        onSelectBuilding={setSelectedBuilding}
        onOpenPowerGrid={() => setIsSystemsModalOpen(true)}
      />

      {/* 4. Building Telemetry Modal */}
      <BuildingInteractionModal
        buildingId={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onOpenPowerGrid={() => {
          setSelectedBuilding(null);
          setIsSystemsModalOpen(true);
        }}
      />

      {/* 5. Power Grid Subsystem Modal */}
      <SystemsControlModal
        isOpen={isSystemsModalOpen}
        onClose={() => setIsSystemsModalOpen(false)}
      />

      {/* 6. Dynamic Emergency Event Popups */}
      <EventModal />

      {/* 7. On-Screen Virtual Touch Movement Overlay (Mobile Accessibility) */}
      {controlMode !== 'free_cam' && (
        <MobileControlsOverlay onCollectSample={handleCollectActive} />
      )}

      {/* 8. Sample Discovery Modal */}
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
