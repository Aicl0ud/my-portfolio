import { PORTFOLIO_STATIONS, type StationId } from "../../data/portfolio";

export const TILE_SIZE = 16;
export const VIEWPORT_WIDTH = 320;
export const VIEWPORT_HEIGHT = 180;
export const MAP_SIZE = 224;

export type Direction = "up" | "down" | "left" | "right";

const wallTiles: Array<[number, number]> = [
  ...Array.from({ length: 10 }, (_, index) => [index + 2, 2] as [number, number]),
  ...Array.from({ length: 9 }, (_, index) => [1, index + 3] as [number, number]),
  ...Array.from({ length: 9 }, (_, index) => [12, index + 3] as [number, number]),
  ...Array.from({ length: 10 }, (_, index) => [index + 2, 12] as [number, number]),
  [2, 4],
  [3, 4],
  [10, 4],
  [10, 10],
  [4, 10],
  [7, 6],
  [8, 6],
  [9, 6],
  [7, 7],
  [8, 7],
  [9, 7],
  [11, 7],
  [11, 11],
  [2, 8],
  [3, 8],
  [4, 8],
  [2, 9],
  [2, 10],
  [2, 11],
];

export const WALLS = new Set(wallTiles.map(([x, y]) => `${x},${y}`));

export const directionVector: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function canEnterTile(x: number, y: number) {
  return !WALLS.has(`${x},${y}`);
}

export function findNearbyStationId(tileX: number, tileY: number): StationId | null {
  return (
    PORTFOLIO_STATIONS.find(
      (station) =>
        Math.abs(station.tile.x - tileX) + Math.abs(station.tile.y - tileY) === 1,
    )?.id ?? null
  );
}
