import React, { useState } from 'react';
import { LunarScene } from './LunarScene';
import { GameHUD } from './GameHUD';
import { BuildingInteractionModal } from './BuildingInteractionModal';
import { SystemsControlModal } from '../SystemsControlModal';
import { EventModal } from '../EventModal';
import { CameraMode, InteractiveBuildingId } from './types';

export const Outpost3DView: React.FC = () => {
  const [cameraMode, setCameraMode] = useState<CameraMode>('overview');
  const [selectedBuilding, setSelectedBuilding] = useState<InteractiveBuildingId | null>(null);
  const [isSystemsModalOpen, setIsSystemsModalOpen] = useState<boolean>(false);

  return (
    <div className="relative w-full h-[calc(100vh-62px)] overflow-hidden bg-space-darkest animate-fadeIn select-none">
      {/* 1. Full 3D Interactive Lunar Outpost Scene */}
      <LunarScene
        cameraMode={cameraMode}
        selectedBuilding={selectedBuilding}
        onSelectBuilding={id => setSelectedBuilding(id)}
      />

      {/* 2. Interactive Sci-Fi Gaming HUD */}
      <GameHUD
        cameraMode={cameraMode}
        onSetCameraMode={setCameraMode}
        onSelectBuilding={setSelectedBuilding}
        onOpenPowerGrid={() => setIsSystemsModalOpen(true)}
      />

      {/* 3. Real-Time Interactive Building Telemetry Modal */}
      <BuildingInteractionModal
        buildingId={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onOpenPowerGrid={() => {
          setSelectedBuilding(null);
          setIsSystemsModalOpen(true);
        }}
      />

      {/* 4. Power Grid Subsystem Routing Modal */}
      <SystemsControlModal
        isOpen={isSystemsModalOpen}
        onClose={() => setIsSystemsModalOpen(false)}
      />

      {/* 5. Dynamic Mission Emergency Event Popups */}
      <EventModal />
    </div>
  );
};

