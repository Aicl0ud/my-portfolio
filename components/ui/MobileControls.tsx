import type { PointerEvent } from "react";

import type { Point2D } from "../../lib/world";
import { useGameStore } from "../../store/game";

const DIRECTIONS: Record<string, Point2D> = {
  up: { x: 0, z: -1 },
  down: { x: 0, z: 1 },
  left: { x: -1, z: 0 },
  right: { x: 1, z: 0 },
};

export function MobileControls() {
  const setControl = useGameStore((state) => state.setControl);
  const nearbyStationId = useGameStore((state) => state.nearbyStationId);
  const openStation = useGameStore((state) => state.openStation);

  const startMoving = (direction: keyof typeof DIRECTIONS) => (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setControl("touch", DIRECTIONS[direction]);
  };
  const stopMoving = () => setControl("touch", { x: 0, z: 0 });

  return (
    <div className="mobile-controls" aria-label="Touch game controls">
      <div className="d-pad">
        <button type="button" aria-label="Move up" className="up" onPointerDown={startMoving("up")} onPointerUp={stopMoving} onPointerCancel={stopMoving}>↑</button>
        <button type="button" aria-label="Move left" className="left" onPointerDown={startMoving("left")} onPointerUp={stopMoving} onPointerCancel={stopMoving}>←</button>
        <button type="button" aria-label="Move down" className="down" onPointerDown={startMoving("down")} onPointerUp={stopMoving} onPointerCancel={stopMoving}>↓</button>
        <button type="button" aria-label="Move right" className="right" onPointerDown={startMoving("right")} onPointerUp={stopMoving} onPointerCancel={stopMoving}>→</button>
      </div>
      <button
        type="button"
        className="action-button"
        disabled={!nearbyStationId}
        onClick={() => nearbyStationId && openStation(nearbyStationId)}
      >
        Explore
      </button>
    </div>
  );
}
