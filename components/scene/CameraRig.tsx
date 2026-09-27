import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Vector3 } from "three";

import { useGameStore } from "../../store/game";

export function CameraRig() {
  const camera = useThree((state) => state.camera);
  const targetPosition = useMemo(() => new Vector3(), []);
  const targetLookAt = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const player = useGameStore.getState().playerPosition;
    const smoothing = 1 - Math.exp(-2.8 * delta);
    targetPosition.set(10 + player.x * 0.16, 11, 10 + player.z * 0.16);
    targetLookAt.set(player.x * 0.12, 0, player.z * 0.12);
    camera.position.lerp(targetPosition, smoothing);
    camera.lookAt(targetLookAt);
  });

  return null;
}
