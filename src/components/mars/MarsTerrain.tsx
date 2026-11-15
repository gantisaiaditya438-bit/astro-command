import React, { useMemo } from 'react';
import * as THREE from 'three';

export const MarsTerrain: React.FC = () => {
  // Low-poly stylized Martian landscape with a flat base outpost plaza
  const { terrainGeometry } = useMemo(() => {
    const size = 160;
    const segments = 40; // Clean, optimized low-poly segments
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    geom.rotateX(-Math.PI / 2);

    const pos = geom.attributes.position;
    const vertex = new THREE.Vector3();

    // Craters and dunes far outside the base area: [centerX, centerZ, radius, depth]
    const outerCraters = [
      [-48, -42, 18, 4.0],
      [48, -45, 16, 3.5],
      [-52, 42, 15, 3.0],
      [45, 45, 18, 3.8]
    ];

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);

      const distFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);

      let height = 0;

      if (distFromCenter < 34) {
        // Completely flat base camp plaza for buildings and paths
        height = 0;
      } else {
        // Gentle, soft low-poly dunes outside the base
        const transition = Math.min(1, (distFromCenter - 34) / 16);
        height =
          (Math.sin(vertex.x * 0.06) * Math.cos(vertex.z * 0.06) * 2.4 +
            Math.sin(vertex.x * 0.12) * 1.0) *
          transition;

        // Apply outer craters
        for (const [cx, cz, rad, depth] of outerCraters) {
          const dx = vertex.x - cx;
          const dz = vertex.z - cz;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < rad * 1.3) {
            if (dist < rad) {
              const t = dist / rad;
              height -= Math.cos(t * Math.PI * 0.5) * depth * transition;
            } else {
              const t = (dist - rad) / (rad * 0.3);
              height += Math.sin(t * Math.PI) * (depth * 0.3) * transition;
            }
          }
        }
      }

      pos.setY(i, height);
    }

    geom.computeVertexNormals();

    // Create interconnected walking paths between base structures
    // Paths connect: Habitat [0,0] -> MOXIE [-15, 8], Solar [-16, -10], Greenhouse [18, 6], Lab [16, -12], Cargo [14, 24]
    const pathSegments: Array<[number, number, number, number, number]> = [
      [0, 0, -15, 8, 2.8],    // Habitat to MOXIE
      [0, 0, -16, -10, 2.6],  // Habitat to Solar
      [0, 0, 18, 6, 2.6],     // Habitat to Greenhouse
      [0, 0, 16, -12, 2.6],   // Habitat to Research Lab
      [0, 0, 0, -20, 2.6],    // Habitat to Shelter
      [0, 0, 14, 24, 2.6],    // Habitat to Cargo Pod
      [0, 0, 8, 16, 2.6]      // Habitat to Rover Bay
    ];

    return { terrainGeometry: geom, pathSegments };
  }, []);

  // Stylized rounded low-poly Martian rocks
  const rocks = useMemo(() => {
    const list: Array<{
      position: [number, number, number];
      scale: [number, number, number];
      rotation: [number, number, number];
      color: string;
    }> = [];

    const rockColors = ['#9a3412', '#c2410c', '#7c2d12', '#b45309'];

    for (let i = 0; i < 35; i++) {
      const angle = (i / 35) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
      const radius = 28 + Math.random() * 45;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const size = 0.6 + Math.random() * 1.2;

      list.push({
        position: [x, size * 0.35, z],
        scale: [size * 1.2, size * 0.8, size * 1.1],
        rotation: [Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4],
        color: rockColors[i % rockColors.length]
      });
    }
    return list;
  }, []);

  return (
    <group>
      {/* 1. Main Low-Poly Martian Terrain */}
      <mesh geometry={terrainGeometry} receiveShadow>
        <meshStandardMaterial
          color="#c2410c" // Warm, vibrant Martian terra-cotta
          roughness={0.88}
          metalness={0.05}
          flatShading={true} // Clean, crisp low-poly adventure aesthetic
        />
      </mesh>

      {/* 2. Base Central Walking Plaza & Circular Paver */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[26, 32]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} flatShading />
      </mesh>

      {/* 3. Base Outpost Walking Trails / Pavers connecting modules */}
      {/* Trail to MOXIE */}
      <mesh position={[-7.5, 0.03, 4]} rotation={[-Math.PI / 2, 0, Math.atan2(8, -15) + Math.PI / 2]} receiveShadow>
        <planeGeometry args={[2.8, 17]} />
        <meshStandardMaterial color="#9a3412" roughness={0.9} />
      </mesh>

      {/* Trail to Solar Array */}
      <mesh position={[-8, 0.03, -5]} rotation={[-Math.PI / 2, 0, Math.atan2(-10, -16) + Math.PI / 2]} receiveShadow>
        <planeGeometry args={[2.8, 19]} />
        <meshStandardMaterial color="#9a3412" roughness={0.9} />
      </mesh>

      {/* Trail to Greenhouse */}
      <mesh position={[9, 0.03, 3]} rotation={[-Math.PI / 2, 0, Math.atan2(6, 18) + Math.PI / 2]} receiveShadow>
        <planeGeometry args={[2.8, 19]} />
        <meshStandardMaterial color="#9a3412" roughness={0.9} />
      </mesh>

      {/* Trail to Research Lab */}
      <mesh position={[8, 0.03, -6]} rotation={[-Math.PI / 2, 0, Math.atan2(-12, 16) + Math.PI / 2]} receiveShadow>
        <planeGeometry args={[2.8, 20]} />
        <meshStandardMaterial color="#9a3412" roughness={0.9} />
      </mesh>

      {/* Trail to Cargo Pod & Rover */}
      <mesh position={[7, 0.03, 12]} rotation={[-Math.PI / 2, 0, Math.atan2(24, 14) + Math.PI / 2]} receiveShadow>
        <planeGeometry args={[2.8, 26]} />
        <meshStandardMaterial color="#9a3412" roughness={0.9} />
      </mesh>

      {/* 4. Rounded Low-Poly Martian Boulders */}
      {rocks.map((rock, idx) => (
        <mesh
          key={idx}
          position={rock.position}
          scale={rock.scale}
          rotation={rock.rotation}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={rock.color}
            roughness={0.85}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
};
