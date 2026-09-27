import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

import { useKeyboardMovement } from "../../hooks/useKeyboardMovement";
import { useInteractionKeys } from "../../hooks/useInteractionKeys";
import { findNearbyStation } from "../../lib/stations";
import { moveWithCollisions } from "../../lib/world";
import { useGameStore } from "../../store/game";

const WALK_SPEED = 3.15;

export function Player() {
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  useKeyboardMovement();
  useInteractionKeys();

  useFrame((_, delta) => {
    if (!group.current) return;

    const state = useGameStore.getState();
    const x = state.controls.keyboard.x + state.controls.touch.x;
    const z = state.controls.keyboard.z + state.controls.touch.z;
    const length = Math.hypot(x, z);
    const moving = length > 0.01;
    const direction = moving ? { x: x / length, z: z / length } : { x: 0, z: 0 };
    const current = state.playerPosition;
    const next = moveWithCollisions(current, {
      x: direction.x * WALK_SPEED * Math.min(delta, 0.05),
      z: direction.z * WALK_SPEED * Math.min(delta, 0.05),
    });

    if (next.x !== current.x || next.z !== current.z) {
      state.setPlayerPosition(next);
      group.current.position.x = next.x;
      group.current.position.z = next.z;
      group.current.rotation.y = Math.atan2(direction.x, direction.z);
    }

    const nearbyStationId = findNearbyStation(next);
    if (nearbyStationId !== state.nearbyStationId) state.setNearbyStation(nearbyStationId);

    elapsed.current += delta;
    group.current.position.y = moving ? Math.abs(Math.sin(elapsed.current * 9)) * 0.08 : 0;
  });

  const initialPosition = useGameStore.getState().playerPosition;

  return (
    <group ref={group} position={[initialPosition.x, 0, initialPosition.z]}>
      <mesh castShadow position={[0, 0.72, 0]}>
        <capsuleGeometry args={[0.36, 0.7, 4, 8]} />
        <meshStandardMaterial color="#f0c7a5" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.43, 12, 10]} />
        <meshStandardMaterial color="#f0c7a5" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.67, -0.08]} scale={[1.02, 0.62, 0.88]}>
        <sphereGeometry args={[0.46, 10, 8]} />
        <meshStandardMaterial color="#29232b" roughness={0.94} />
      </mesh>
      <mesh castShadow position={[0, 0.88, -0.34]}>
        <boxGeometry args={[0.58, 0.72, 0.24]} />
        <meshStandardMaterial color="#d45f55" roughness={0.76} />
      </mesh>
      <mesh position={[0.17, 1.58, 0.39]}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshStandardMaterial color="#251e22" />
      </mesh>
      <mesh position={[-0.17, 1.58, 0.39]}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshStandardMaterial color="#251e22" />
      </mesh>
    </group>
  );
}
