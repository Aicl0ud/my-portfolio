import { describe, expect, it } from "vitest";
import { PORTFOLIO_STATIONS } from "../../data/portfolio";
import { DEFAULT_MAP_LAYOUT } from "../../data/mapLayout";
import { canEnterTile, directionVector, findNearbyStationId } from "./world";

describe("portfolio world", () => {
  it("keeps the player inside the room boundaries", () => {
    expect(canEnterTile(-1, 3)).toBe(false);
    expect(canEnterTile(14, 3)).toBe(false);
    expect(canEnterTile(1, 3)).toBe(false);
    expect(canEnterTile(12, 11)).toBe(false);
    expect(canEnterTile(2, 3)).toBe(true);
  });

  it("moves exactly one tile in each direction", () => {
    expect(directionVector).toEqual({
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    });
  });

  it("makes every story reachable from an adjacent walkable tile", () => {
    for (const station of PORTFOLIO_STATIONS) {
      const stationTile = DEFAULT_MAP_LAYOUT.stations[station.id];
      const adjacent = [
        { x: stationTile.x - 1, y: stationTile.y },
        { x: stationTile.x + 1, y: stationTile.y },
        { x: stationTile.x, y: stationTile.y - 1 },
        { x: stationTile.x, y: stationTile.y + 1 },
      ].filter((tile) => canEnterTile(tile.x, tile.y));

      expect(adjacent.length).toBeGreaterThan(0);
      expect(
        adjacent.some((tile) => findNearbyStationId(tile.x, tile.y) === station.id),
      ).toBe(true);
    }
  });

  it("does not trigger a story from a distant tile", () => {
    expect(findNearbyStationId(2, 3)).toBeNull();
  });

  it("uses solid sprites as collision while rugs stay walkable", () => {
    const withSprites = {
      ...DEFAULT_MAP_LAYOUT,
      sprites: [
        { instanceId: "crate-1", spriteId: "crate" as const, x: 5, y: 5 },
        { instanceId: "rug-1", spriteId: "rug" as const, x: 6, y: 5 },
      ],
    };

    expect(canEnterTile(5, 5, withSprites)).toBe(false);
    expect(canEnterTile(6, 5, withSprites)).toBe(true);
  });
});
