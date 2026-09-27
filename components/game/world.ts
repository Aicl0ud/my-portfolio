import { PORTFOLIO_STATIONS, type StationId } from "../../data/portfolio";
import {
  DEFAULT_MAP_LAYOUT,
  isTileInBounds,
  tileKey,
  type MapLayout,
} from "../../data/mapLayout";

export const TILE_SIZE = 16;
export const VIEWPORT_WIDTH = 256;
export const VIEWPORT_HEIGHT = 192;
export const MAP_SIZE = 224;

export type Direction = "up" | "down" | "left" | "right";

export const directionVector: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function canEnterTile(
  x: number,
  y: number,
  layout: MapLayout = DEFAULT_MAP_LAYOUT,
) {
  return (
    isTileInBounds({ x, y }, layout) &&
    !layout.walls.includes(tileKey({ x, y }))
  );
}

export function findNearbyStationId(
  tileX: number,
  tileY: number,
  layout: MapLayout = DEFAULT_MAP_LAYOUT,
): StationId | null {
  return (
    PORTFOLIO_STATIONS.find((station) => {
      const tile = layout.stations[station.id];
      return Math.abs(tile.x - tileX) + Math.abs(tile.y - tileY) === 1;
    })?.id ?? null
  );
}
