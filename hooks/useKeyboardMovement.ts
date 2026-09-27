import { useEffect } from "react";

import { useGameStore } from "../store/game";

const MOVEMENT_KEYS: Record<string, "up" | "down" | "left" | "right"> = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};

function toVector(keys: Set<string>) {
  const directions = new Set(Array.from(keys, (key) => MOVEMENT_KEYS[key]).filter(Boolean));
  const x = Number(directions.has("right")) - Number(directions.has("left"));
  const z = Number(directions.has("down")) - Number(directions.has("up"));
  const length = Math.hypot(x, z) || 1;
  return { x: x / length, z: z / length };
}

export function useKeyboardMovement() {
  const setControl = useGameStore((state) => state.setControl);

  useEffect(() => {
    const pressed = new Set<string>();
    const sync = () => setControl("keyboard", toVector(pressed));

    const onKeyDown = (event: KeyboardEvent) => {
      if (!MOVEMENT_KEYS[event.code]) return;
      event.preventDefault();
      pressed.add(event.code);
      sync();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (!MOVEMENT_KEYS[event.code]) return;
      pressed.delete(event.code);
      sync();
    };

    const reset = () => {
      pressed.clear();
      sync();
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", reset);
      reset();
    };
  }, [setControl]);
}
