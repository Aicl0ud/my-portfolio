import { create } from "zustand";

import type { Point2D } from "../lib/world";

type ControlSource = "keyboard" | "touch";

type GameState = {
  controls: Record<ControlSource, Point2D>;
  playerPosition: Point2D;
  setControl: (source: ControlSource, value: Point2D) => void;
  setPlayerPosition: (position: Point2D) => void;
};

export const useGameStore = create<GameState>((set) => ({
  controls: {
    keyboard: { x: 0, z: 0 },
    touch: { x: 0, z: 0 },
  },
  playerPosition: { x: 0, z: 3.6 },
  setControl: (source, value) =>
    set((state) => ({
      controls: { ...state.controls, [source]: value },
    })),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
}));
