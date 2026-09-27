import { describe, expect, it } from "vitest";
import { PORTFOLIO_STATIONS } from "../../data/portfolio";
import { canEnterTile, directionVector, findNearbyStationId } from "./world";

describe("portfolio world", () => {
  it("keeps the player inside the room boundaries", () => {
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
      const adjacent = [
        { x: station.tile.x - 1, y: station.tile.y },
        { x: station.tile.x + 1, y: station.tile.y },
        { x: station.tile.x, y: station.tile.y - 1 },
        { x: station.tile.x, y: station.tile.y + 1 },
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
});
