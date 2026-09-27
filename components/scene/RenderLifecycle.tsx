import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

import { useGameStore } from "../../store/game";

export function RenderLifecycle() {
  const setFrameloop = useThree((state) => state.setFrameloop);
  const activeStationId = useGameStore((state) => state.activeStationId);

  useEffect(() => {
    const sync = () => setFrameloop(document.hidden || activeStationId ? "demand" : "always");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      setFrameloop("always");
    };
  }, [activeStationId, setFrameloop]);

  return null;
}
