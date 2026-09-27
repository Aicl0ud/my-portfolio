import { create } from "zustand";

import type { StationId } from "../data/portfolio";
import type { Point2D } from "../lib/world";

type ControlSource = "keyboard" | "touch";

type GameState = {
  activeStationId: StationId | null;
  controls: Record<ControlSource, Point2D>;
  nearbyStationId: StationId | null;
  playerPosition: Point2D;
  visitedStationIds: StationId[];
  closeStation: () => void;
  openStation: (stationId: StationId) => void;
  setControl: (source: ControlSource, value: Point2D) => void;
  setNearbyStation: (stationId: StationId | null) => void;
  setPlayerPosition: (position: Point2D) => void;
};

export const useGameStore = create<GameState>((set) => ({
  activeStationId: null,
  controls: {
    keyboard: { x: 0, z: 0 },
    touch: { x: 0, z: 0 },
  },
  nearbyStationId: null,
  playerPosition: { x: 0, z: 3.6 },
  visitedStationIds: [],
  closeStation: () => set({ activeStationId: null }),
  openStation: (activeStationId) =>
    set((state) => ({
      activeStationId,
      visitedStationIds: state.visitedStationIds.includes(activeStationId)
        ? state.visitedStationIds
        : [...state.visitedStationIds, activeStationId],
    })),
  setControl: (source, value) =>
    set((state) => ({
      controls: { ...state.controls, [source]: value },
    })),
  setNearbyStation: (nearbyStationId) => set({ nearbyStationId }),
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
}));
