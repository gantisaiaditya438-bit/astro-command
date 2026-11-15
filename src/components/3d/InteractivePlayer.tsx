import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { ControlMode } from '../../types/solar';

interface InteractivePlayerProps {
  destination: 'moon' | 'mars';
  isRepairing?: boolean;
  isCelebrating?: boolean;
  onPositionChange?: (pos: [number, number, number]) => void;
  onNearInteractable?: (interactable: { name: string; type: string; distance: number; actionText: string } | null) => void;
}

// Solid building collision obstacles (cylinder bounding circles)
const BASE_OBSTACLES = [
  { x: 0, z: 0, r: 7.2, name: 'Habitat Dome', type: 'habitat', actionText: 'Press E to Enter' },
  { x: -15, z: 8, r: 4.8, name: 'Oxygen Facility', type: 'oxygen_facility', actionText: 'Press E to Inspect' },
  { x: -16, z: -10, r: 6.2, name: 'Solar Array Farm', type: 'solar_station', actionText: 'Press E to Check Power' },
  { x: 18, z: 6, r: 5.5, name: 'Greenhouse BioDome', type: 'greenhouse', actionText: 'Press E to Inspect Crops' },
  { x: 16, z: -12, r: 5.5, name: 'Research Lab', type: 'research_lab', actionText: 'Press E to Open Lab' },
  { x: 0, z: -20, r: 5.5, name: 'Radiation Shelter', type: 'radiation_shelter', actionText: 'Press E to Enter Bunker' },
  { x: 8, z: 16, r: 2.8, name: 'Planetary Rover', type: 'rover', actionText: 'Press E to Drive' },
  { x: 14, z: 24, r: 2.6, name: 'Supply Cargo Pod', type: 'cargo_pod', actionText: 'Press E to Open Pod' }
];

export const InteractivePlayer: React.FC<InteractivePlayerProps> = ({
  destination,
  isRepairing = false,
  isCelebrating = false,
  onPositionChange,
  onNearInteractable
}) => {
  const { controlMode } = useGame();
  const { camera } = useThree();

  const playerRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const repairToolRef = useRef<THREE.Group>(null);

  // Position, movement physics, heading
  const position = useRef(new THREE.Vector3(0, 0, 14));
  const velocityY = useRef(0);
  const isJumping = useRef(false);
  const currentRotationY = useRef(0);
  const targetRotationY = useRef(0);

  // Camera settings (Among Us / Accessible Adventure Style)
  const cameraZoom = useRef(15); // Distance from player (default 15m)
  const cameraPitch = useRef(0.85); // ~48 degrees elevated angle
  const cameraYaw = useRef(0); // Orbit angle around player

  // Input states
  const keys = useRef<{ [code: string]: boolean }>({});
  const isMouseDown = useRef(false);
  const lastMouseX = useRef(0);

  const gravity = destination === 'moon' ? 0.08 : 0.14;
  const jumpForce = destination === 'moon' ? 0.44 : 0.36;
  const playerRadius = 0.65;

  // Listen to keyboard & mouse controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Space' && !isJumping.current && controlMode !== 'free_cam') {
        velocityY.current = jumpForce;
        isJumping.current = true;
      }
      // Camera Reset shortcut (Key R)
      if (e.code === 'KeyR') {
        cameraYaw.current = 0;
        cameraZoom.current = 15;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    const handleWheel = (e: WheelEvent) => {
      // Smooth mouse zoom
      cameraZoom.current = Math.max(8, Math.min(26, cameraZoom.current + e.deltaY * 0.015));
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 0) {
        // Right click or left drag rotates camera orbit
        isMouseDown.current = true;
        lastMouseX.current = e.clientX;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDown.current) {
        const deltaX = e.clientX - lastMouseX.current;
        cameraYaw.current -= deltaX * 0.008;
        lastMouseX.current = e.clientX;
      }
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [jumpForce, controlMode]);

  useFrame((state, delta) => {
    if (controlMode === 'free_cam') return;

    // 1. Omnidirectional Input Vector
    let inputX = 0;
    let inputZ = 0;

    if (keys.current['KeyW'] || keys.current['ArrowUp']) inputZ -= 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) inputZ += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) inputX -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) inputX += 1;

    const isMoving = inputX !== 0 || inputZ !== 0;
    const isSprinting = Boolean(keys.current['ShiftLeft'] || keys.current['ShiftRight']);

    const baseSpeed = controlMode === 'rover' ? 16.0 : 8.5;
    const speed = (isSprinting ? baseSpeed * 1.55 : baseSpeed) * delta;

    if (isMoving) {
      // Normalize diagonal movement
      const inputLength = Math.sqrt(inputX * inputX + inputZ * inputZ);
      const normX = inputX / inputLength;
      const normZ = inputZ / inputLength;

      // Transform movement relative to camera orientation!
      const cosYaw = Math.cos(cameraYaw.current);
      const sinYaw = Math.sin(cameraYaw.current);

      const moveX = (normX * cosYaw - normZ * sinYaw) * speed;
      const moveZ = (normX * sinYaw + normZ * cosYaw) * speed;

      const nextX = position.current.x + moveX;
      const nextZ = position.current.z + moveZ;

      // Target rotation angle: character faces the direction of movement
      targetRotationY.current = Math.atan2(moveX, moveZ);

      // 2. Solid Building Collision Detection & Sliding Resolution
      let resolvedX = nextX;
      let resolvedZ = nextZ;

      for (const obstacle of BASE_OBSTACLES) {
        const dx = resolvedX - obstacle.x;
        const dz = resolvedZ - obstacle.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const minDist = obstacle.r + playerRadius;

        if (dist < minDist && dist > 0.001) {
          // Push player out along the normal vector (smooth sliding against wall)
          const pushDistance = minDist - dist;
          resolvedX += (dx / dist) * pushDistance;
          resolvedZ += (dz / dist) * pushDistance;
        }
      }

      // Clamp within map bounds
      position.current.x = Math.max(-56, Math.min(56, resolvedX));
      position.current.z = Math.max(-56, Math.min(56, resolvedZ));
    }

    // Smooth character rotation towards movement direction
    let angleDiff = targetRotationY.current - currentRotationY.current;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    currentRotationY.current += angleDiff * Math.min(1, delta * 14);

    // 3. Fractional Gravity Jump Physics
    if (isJumping.current) {
      position.current.y += velocityY.current;
      velocityY.current -= gravity;
      if (position.current.y <= 0) {
        position.current.y = 0;
        velocityY.current = 0;
        isJumping.current = false;
      }
    }

    // 4. Character Animations (Cute bouncy Among Us / Adventure style)
    const animSpeed = isSprinting ? 18 : 10;
    const walkCycle = Math.sin(state.clock.elapsedTime * animSpeed);

    if (bodyRef.current) {
      if (isMoving) {
        // Bouncy walk bob
        bodyRef.current.position.y = 0.08 * Math.abs(Math.sin(state.clock.elapsedTime * animSpeed));
        bodyRef.current.rotation.z = -0.06 * Math.sin(state.clock.elapsedTime * animSpeed * 0.5);
      } else if (isCelebrating) {
        // Joyful jump celebrate
        bodyRef.current.position.y = 0.3 * Math.abs(Math.sin(state.clock.elapsedTime * 8));
        bodyRef.current.rotation.z = 0;
      } else {
        // Gentle breathing idle
        bodyRef.current.position.y = 0.03 * Math.sin(state.clock.elapsedTime * 2);
        bodyRef.current.rotation.z = 0;
      }
    }

    // Legs animation
    if (leftLegRef.current && rightLegRef.current) {
      if (isJumping.current) {
        leftLegRef.current.rotation.x = 0.35;
        rightLegRef.current.rotation.x = -0.25;
      } else if (isMoving) {
        leftLegRef.current.rotation.x = walkCycle * (isSprinting ? 0.8 : 0.55);
        rightLegRef.current.rotation.x = -walkCycle * (isSprinting ? 0.8 : 0.55);
      } else {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
    }

    // Arms animation
    if (leftArmRef.current && rightArmRef.current) {
      if (isCelebrating) {
        leftArmRef.current.rotation.x = -2.6;
        rightArmRef.current.rotation.x = -2.6;
      } else if (isRepairing) {
        leftArmRef.current.rotation.x = -0.5;
        rightArmRef.current.rotation.x = -1.3;
        rightArmRef.current.rotation.z = 0.3;
      } else if (isMoving) {
        leftArmRef.current.rotation.x = -walkCycle * 0.5;
        rightArmRef.current.rotation.x = walkCycle * 0.5;
        rightArmRef.current.rotation.z = 0;
      } else {
        leftArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.z = 0;
      }
    }

    // Tool spark pulse
    if (repairToolRef.current && isRepairing) {
      const spark = 0.6 + Math.sin(state.clock.elapsedTime * 25) * 0.4;
      repairToolRef.current.scale.setScalar(spark > 0.4 ? 1 : 0.2);
    }

    // Update 3D player mesh transform
    if (playerRef.current) {
      playerRef.current.position.set(position.current.x, position.current.y, position.current.z);
      playerRef.current.rotation.y = currentRotationY.current;
    }

    // 5. Proximity Detection: Check distance to nearby buildings & objects
    let nearest: { name: string; type: string; distance: number; actionText: string } | null = null;
    let minObsDist = 999;

    for (const obs of BASE_OBSTACLES) {
      const dist = Math.sqrt(
        Math.pow(position.current.x - obs.x, 2) + Math.pow(position.current.z - obs.z, 2)
      );
      const edgeDist = Math.max(0, dist - obs.r);
      if (edgeDist < 4.2 && edgeDist < minObsDist) {
        minObsDist = edgeDist;
        nearest = {
          name: obs.name,
          type: obs.type,
          distance: Math.round(edgeDist * 10) / 10,
          actionText: obs.actionText
        };
      }
    }

    if (onNearInteractable) {
      onNearInteractable(nearest);
    }

    // Notify parent for waypoint tracking
    if (onPositionChange) {
      onPositionChange([position.current.x, position.current.y, position.current.z]);
    }

    // 6. Smooth Elevated Third-Person / Isometric Camera Following
    // Calculates camera offset using elevated pitch and smooth yaw
    const distH = cameraZoom.current * Math.cos(cameraPitch.current);
    const distV = cameraZoom.current * Math.sin(cameraPitch.current);

    const camX = position.current.x - Math.sin(cameraYaw.current) * distH;
    const camY = position.current.y + distV;
    const camZ = position.current.z - Math.cos(cameraYaw.current) * distH;

    const targetCam = new THREE.Vector3(camX, camY, camZ);
    camera.position.lerp(targetCam, Math.min(1, delta * 6.5));

    // Camera looks at astronaut's upper body / helmet
    camera.lookAt(position.current.x, position.current.y + 1.35, position.current.z);
  });

  return (
    <group ref={playerRef} position={[0, 0, 14]}>
      {controlMode === 'astronaut' ? (
        // Cute Original Low-Poly Cartoon Astronaut
        <group ref={bodyRef} scale={[1.35, 1.35, 1.35]}>
          {/* Main Rounded Suit Body (Capsule Torso) */}
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.42, 0.55, 12, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.1} />
          </mesh>

          {/* Cyan Suit Chest Stripe & Mission Patch */}
          <mesh position={[0, 1.3, 0.38]}>
            <boxGeometry args={[0.38, 0.16, 0.12]} />
            <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.14, 1.3, 0.44]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>

          {/* Big Rounded Cartoon Helmet */}
          <mesh position={[0, 1.82, 0]} castShadow>
            <sphereGeometry args={[0.48, 20, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
          </mesh>

          {/* Large Shiny Curved Golden Visor */}
          <mesh position={[0, 1.84, 0.18]}>
            <sphereGeometry args={[0.36, 20, 20, 0, Math.PI, 0, Math.PI * 0.72]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#d97706"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.08}
            />
          </mesh>

          {/* Visor Specular Glass Highlight */}
          <mesh position={[0.12, 1.95, 0.48]} rotation={[0, 0, -0.4]}>
            <capsuleGeometry args={[0.04, 0.16, 4, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>

          {/* Rounded PLSS Life-Support Backpack */}
          <mesh position={[0, 1.25, -0.42]} castShadow>
            <boxGeometry args={[0.62, 0.72, 0.32]} />
            <meshStandardMaterial color="#0284c7" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Dual Oxygen Cylinders on Backpack */}
          <mesh position={[-0.18, 1.28, -0.56]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.58, 12]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0.18, 1.28, -0.56]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.58, 12]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Cute Chunky Legs & Boots */}
          <mesh ref={leftLegRef} position={[-0.22, 0.45, 0]} castShadow>
            <capsuleGeometry args={[0.15, 0.52, 8, 10]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh ref={rightLegRef} position={[0.22, 0.45, 0]} castShadow>
            <capsuleGeometry args={[0.15, 0.52, 8, 10]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>

          {/* Boots */}
          <mesh position={[-0.22, 0.12, 0.06]} castShadow>
            <boxGeometry args={[0.3, 0.22, 0.42]} />
            <meshStandardMaterial color="#0284c7" roughness={0.6} />
          </mesh>
          <mesh position={[0.22, 0.12, 0.06]} castShadow>
            <boxGeometry args={[0.3, 0.22, 0.42]} />
            <meshStandardMaterial color="#0284c7" roughness={0.6} />
          </mesh>

          {/* Cute Rounded Arms & Gloves */}
          <mesh ref={leftArmRef} position={[-0.52, 1.18, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.46, 8, 10]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>

          <group position={[0.52, 1.18, 0]}>
            <mesh ref={rightArmRef} castShadow>
              <capsuleGeometry args={[0.12, 0.46, 8, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} />
            </mesh>

            {/* Laser Repair Tool & Glowing Beam */}
            {isRepairing && (
              <group ref={repairToolRef} position={[0.1, -0.28, 0.45]}>
                <mesh>
                  <boxGeometry args={[0.1, 0.1, 0.35]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#0284c7" />
                </mesh>
                <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.09, 0.9, 8]} />
                  <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
                </mesh>
              </group>
            )}
          </group>
        </group>
      ) : controlMode === 'rover' ? (
        // Playable Cartoon Space Rover Vehicle
        <group position={[0, 0.45, 0]} scale={[1.2, 1.2, 1.2]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[2.2, 0.8, 3.2]} />
            <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Mast & Headlights */}
          <mesh position={[0, 1.35, 1.2]}>
            <boxGeometry args={[0.5, 0.35, 0.35]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Wheels */}
          {[-1.2, 1.2].map((x, xi) =>
            [-1.1, 0, 1.1].map((z, zi) => (
              <mesh key={`${xi}-${zi}`} position={[x, 0.3, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.42, 0.42, 0.38, 16]} />
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
              </mesh>
            ))
          )}
        </group>
      ) : null}
    </group>
  );
};
