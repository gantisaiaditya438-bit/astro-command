import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CameraMode, InteractiveBuildingId } from './types';
import { useGame } from '../../context/GameContext';

interface CameraRigProps {
  cameraMode: CameraMode;
  selectedBuilding: InteractiveBuildingId | null;
  activeSolarStorm: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  cameraMode,
  selectedBuilding,
  activeSolarStorm
}) => {
  const { controlMode } = useGame();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // If in astronaut or rover mode and no building is specifically clicked, let InteractivePlayer handle the follower camera
  const isPlayerDriven = (controlMode === 'astronaut' || controlMode === 'rover') && !selectedBuilding;

  // Target building focal points
  const buildingTargets: Record<InteractiveBuildingId, { cam: [number, number, number]; lookAt: [number, number, number] }> = {
    habitat: { cam: [0, 10, 16], lookAt: [0, 4, 0] },
    solar_station: { cam: [-16, 9, 2], lookAt: [-16, 4, -10] },
    oxygen_facility: { cam: [-15, 7, 18], lookAt: [-15, 3, 8] },
    greenhouse: { cam: [15, 9, 16], lookAt: [15, 3, 4] },
    research_lab: { cam: [12, 9, 0], lookAt: [12, 3, -12] },
    radiation_shelter: { cam: [0, 9, -6], lookAt: [0, 2, -18] },
    rover: { cam: [0, 6, 26], lookAt: [0, 1, 16] }
  };

  const desiredPos = useRef(new THREE.Vector3(0, 36, 48));
  const desiredLookAt = useRef(new THREE.Vector3(0, 2, 0));

  useEffect(() => {
    if (isPlayerDriven) return;

    if (selectedBuilding && buildingTargets[selectedBuilding]) {
      const b = buildingTargets[selectedBuilding];
      desiredPos.current.set(b.cam[0], b.cam[1], b.cam[2]);
      desiredLookAt.current.set(b.lookAt[0], b.lookAt[1], b.lookAt[2]);
      return;
    }

    if (cameraMode === 'emergency' || activeSolarStorm) {
      desiredPos.current.set(0, 14, -4);
      desiredLookAt.current.set(0, 3, -18);
    } else if (cameraMode === 'exploration') {
      desiredPos.current.set(16, 7, 24);
      desiredLookAt.current.set(0, 3, 0);
    } else {
      desiredPos.current.set(0, 34, 46);
      desiredLookAt.current.set(0, 2, 0);
    }
  }, [cameraMode, selectedBuilding, activeSolarStorm, isPlayerDriven]);

  useFrame((_, delta) => {
    if (isPlayerDriven) return; // Yield full authority to InteractivePlayer!

    const step = Math.min(1, delta * 3.0);
    camera.position.lerp(desiredPos.current, step);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredLookAt.current, step);
      controlsRef.current.update();
    }
  });

  if (isPlayerDriven) {
    return null; // No OrbitControls interference with player camera
  }

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={6}
      maxDistance={95}
      maxPolarAngle={Math.PI / 2 - 0.04}
      minPolarAngle={0.15}
    />
  );
};
