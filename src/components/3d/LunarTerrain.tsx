import React, { useMemo } from 'react';
import * as THREE from 'three';

interface LunarTerrainProps {
  isMars?: boolean;
}

export const LunarTerrain: React.FC<LunarTerrainProps> = ({ isMars = false }) => {
  // Low-poly stylized lunar surface with flat base clearing and craters outside
  const terrainGeometry = useMemo(() => {
    const size = 160;
    const segments = 40;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    geom.rotateX(-Math.PI / 2);

    const pos = geom.attributes.position;
    const vertex = new THREE.Vector3();

    // Outer lunar craters: [centerX, centerZ, radius, depth]
    const craters = [
      [-45, -35, 18, 4.2],
      [48, -40, 16, 3.5],
      [-48, 42, 14, 2.8],
      [42, 45, 17, 3.6]
    ];

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      const distFromCenter = Math.sqrt(vertex.x * vertex.x + vertex.z * vertex.z);

      let height = 0;
      if (distFromCenter < 34) {
        // Completely flat base camp plaza
        height = 0;
      } else {
        const transition = Math.min(1, (distFromCenter - 34) / 16);
        height =
          (Math.sin(vertex.x * 0.05) * Math.cos(vertex.z * 0.05) * 2.2 +
            Math.sin(vertex.x * 0.1) * 0.8) *
          transition;

        for (const [cx, cz, rad, depth] of craters) {
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
    return geom;
  }, []);

  // Low-poly scattered lunar boulders
  const rocks = useMemo(() => {
    const list: Array<{
      position: [number, number, number];
      scale: [number, number, number];
      rotation: [number, number, number];
    }> = [];

    for (let i = 0; i < 35; i++) {
      const angle = (i / 35) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
      const radius = 28 + Math.random() * 45;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const size = 0.5 + Math.random() * 1.2;

      list.push({
        position: [x, size * 0.35, z],
        scale: [size * 1.1, size * 0.7, size * 1.1],
        rotation: [Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4]
      });
    }
    return list;
  }, []);

  return (
    <group>
      {/* 1. Main Low-Poly Lunar Regolith */}
      <mesh geometry={terrainGeometry} receiveShadow>
        <meshStandardMaterial
          color="#475569" // Clean, friendly lunar slate-blue
          roughness={0.9}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* 2. Base Central Walking Plaza */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[26, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.9} flatShading />
      </mesh>

      {/* 3. Base Outpost Walking Trails / Pavers */}
      <mesh position={[-7.5, 0.03, 5]} rotation={[-Math.PI / 2, 0, Math.atan2(12, -15) + Math.PI / 2]} receiveShadow>
        <planeGeometry args={[2.6, 19]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      <mesh position={[-8, 0.03, -5]} rotation={[-Math.PI / 2, 0, Math.atan2(-10, -16) + Math.PI / 2]} receiveShadow>
        <planeGeometry args={[2.6, 19]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      <mesh position={[9, 0.03, 3]} rotation={[-Math.PI / 2, 0, Math.atan2(6, 18) + Math.PI / 2]} receiveShadow>
        <planeGeometry args={[2.6, 19]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      <mesh position={[8, 0.03, -6]} rotation={[-Math.PI / 2, 0, Math.atan2(-12, 16) + Math.PI / 2]} receiveShadow>
        <planeGeometry args={[2.6, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* 4. Rounded Lunar Boulders */}
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
            color="#64748b"
            roughness={0.85}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
};
