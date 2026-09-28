import { describe, expect, it } from "vitest";
import {
  DEFAULT_MAP_LAYOUT,
  MAP_LAYOUT_KEY,
  loadMapLayout,
  normalizeMapLayout,
} from "./mapLayout";

describe("map layout", () => {
  it("loads a valid saved layout", () => {
    const saved = {
      ...DEFAULT_MAP_LAYOUT,
      spawn: { x: 5, y: 5 },
      walls: DEFAULT_MAP_LAYOUT.walls.filter((wall) => wall !== "5,5"),
    };
    const storage = { getItem: (key: string) => key === MAP_LAYOUT_KEY ? JSON.stringify(saved) : null };

    expect(loadMapLayout(storage).spawn).toEqual({ x: 5, y: 5 });
  });

  it("rejects an out-of-bounds station", () => {
    expect(normalizeMapLayout({
      ...DEFAULT_MAP_LAYOUT,
      stations: { ...DEFAULT_MAP_LAYOUT.stations, about: { x: 99, y: 99 } },
    })).toBeNull();
  });

  it("falls back when the spawn is blocked", () => {
    const invalid = {
      ...DEFAULT_MAP_LAYOUT,
      spawn: { x: 1, y: 3 },
    };
    const storage = { getItem: () => JSON.stringify(invalid) };

    expect(loadMapLayout(storage)).toEqual(DEFAULT_MAP_LAYOUT);
  });
});
