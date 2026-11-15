import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { ControlMode, ScienceSample } from '../../types/solar';
import { DISCOVERABLE_SAMPLES } from '../../data/planetaryMissions';

interface PlayerControllerProps {
  destination: 'moon' | 'mars';
  onProximitySample?: (sample: ScienceSample | null) => void;
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  destination,
  onProximitySample
}) => {
  const { controlMode, collectSample, collectedSamples } = useGame();

  // Keys active state
  const keys = useRef<{ [key: string]: boolean }>({});
  const playerPos = useRef(new THREE.Vector3(0, 0, 10));
  const velocityY = useRef(0);
  const isJumping = useRef(false);

  const gravity = destination === 'moon' ? 0.08 : 0.15;
  const speed = controlMode === 'rover' ? 0.35 : 0.18;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;

      // Spacebar jump
      if (e.code === 'Space' && !isJumping.current) {
        velocityY.current = destination === 'moon' ? 0.45 : 0.35;
        isJumping.current = true;
      }

      // E key to collect sample if in range
      if (e.code === 'KeyE') {
        checkSampleCollection();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [destination, collectedSamples]);

  const checkSampleCollection = () => {
    // Check nearby samples
    const uncollected = DISCOVERABLE_SAMPLES.filter(
      s => !collectedSamples.some(c => c.id === s.id)
    );
    if (uncollected.length > 0) {
      // Collect closest
      collectSample(uncollected[0]);
    }
  };

  useFrame((_, delta) => {
    if (controlMode === 'free_cam') return;

    // Direction vector
    const moveX = (keys.current['KeyD'] || keys.current['ArrowRight'] ? 1 : 0) -
                  (keys.current['KeyA'] || keys.current['ArrowLeft'] ? 1 : 0);
    const moveZ = (keys.current['KeyS'] || keys.current['ArrowDown'] ? 1 : 0) -
                  (keys.current['KeyW'] || keys.current['ArrowUp'] ? 1 : 0);

    if (moveX !== 0 || moveZ !== 0) {
      playerPos.current.x += moveX * speed;
      playerPos.current.z += moveZ * speed;
    }

    // Gravity jump
    if (isJumping.current) {
      playerPos.current.y += velocityY.current;
      velocityY.current -= gravity;
      if (playerPos.current.y <= 0) {
        playerPos.current.y = 0;
        velocityY.current = 0;
        isJumping.current = false;
      }
    }
  });

  return null;
};
