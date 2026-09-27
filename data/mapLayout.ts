import { type StationId } from "./portfolio";
import {
  getMapSprite,
  getSpriteTiles,
  isMapSpriteId,
  isSpriteBlockingTile,
  type PlacedMapSprite,
} from "./mapSprites";

export const MAP_COLUMNS = 14;
export const MAP_ROWS = 14;
export const MAP_LAYOUT_KEY = "kiw-portfolio-map-v1";

export type TilePosition = { x: number; y: number };

export type MapLayout = {
  version: 1;
  width: number;
  height: number;
  spawn: TilePosition;
  walls: string[];
  stations: Record<StationId, TilePosition>;
  sprites: PlacedMapSprite[];
};

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

export const DEFAULT_MAP_LAYOUT: MapLayout = {
  version: 1,
  width: MAP_COLUMNS,
  height: MAP_ROWS,
  spawn: { x: 2, y: 3 },
  walls: wallTiles.map(([x, y]) => `${x},${y}`),
  stations: {
    about: { x: 10, y: 4 },
    experience: { x: 10, y: 10 },
    projects: { x: 8, y: 7 },
    contact: { x: 4, y: 10 },
  },
  sprites: [],
};

const STATION_IDS: StationId[] = ["about", "experience", "projects", "contact"];

export function tileKey(tile: TilePosition) {
  return `${tile.x},${tile.y}`;
}

export function isTileInBounds(tile: TilePosition, layout: Pick<MapLayout, "width" | "height">) {
  return tile.x >= 0 && tile.y >= 0 && tile.x < layout.width && tile.y < layout.height;
}

export function normalizeMapLayout(value: unknown): MapLayout | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<MapLayout>;
  if (
    candidate.version !== 1 ||
    candidate.width !== MAP_COLUMNS ||
    candidate.height !== MAP_ROWS ||
    !candidate.spawn ||
    !Array.isArray(candidate.walls) ||
    !candidate.stations
  ) {
    return null;
  }

  const spawn = { x: Number(candidate.spawn.x), y: Number(candidate.spawn.y) };
  if (!Number.isInteger(spawn.x) || !Number.isInteger(spawn.y)) return null;

  const walls = Array.from(
    new Set(candidate.walls.filter((wall) => /^\d+,\d+$/.test(wall))),
  );
  const layout: MapLayout = {
    version: 1,
    width: MAP_COLUMNS,
    height: MAP_ROWS,
    spawn,
    walls,
    stations: { ...DEFAULT_MAP_LAYOUT.stations },
    sprites: [],
  };

  if (candidate.sprites !== undefined) {
    if (!Array.isArray(candidate.sprites)) return null;
    for (const rawSprite of candidate.sprites) {
      if (!rawSprite || typeof rawSprite !== "object") return null;
      const sprite = rawSprite as Partial<PlacedMapSprite>;
      if (
        typeof sprite.instanceId !== "string" ||
        !isMapSpriteId(sprite.spriteId) ||
        !Number.isInteger(sprite.x) ||
        !Number.isInteger(sprite.y)
      ) {
        return null;
      }
      const placed = sprite as PlacedMapSprite;
      if (!getSpriteTiles(placed).every((tile) => isTileInBounds(tile, layout))) return null;
      layout.sprites.push(placed);
    }
  }

  for (const id of STATION_IDS) {
    const station = candidate.stations[id];
    if (!station) return null;
    const tile = { x: Number(station.x), y: Number(station.y) };
    if (!Number.isInteger(tile.x) || !Number.isInteger(tile.y) || !isTileInBounds(tile, layout)) {
      return null;
    }
    layout.stations[id] = tile;
  }

  if (
    !isTileInBounds(spawn, layout) ||
    walls.includes(tileKey(spawn)) ||
    isSpriteBlockingTile(layout.sprites, spawn)
  ) return null;
  layout.walls = walls.filter((wall) => {
    const [x, y] = wall.split(",").map(Number);
    return isTileInBounds({ x, y }, layout);
  });
  return layout;
}

export function getMapLayoutIssues(layout: MapLayout) {
  const issues: string[] = [];
  const walls = new Set(layout.walls);
  const stationTiles = new Map<string, StationId>();
  const occupiedSpriteTiles = new Map<string, string>();
  if (
    walls.has(tileKey(layout.spawn)) ||
    isSpriteBlockingTile(layout.sprites, layout.spawn)
  ) issues.push("Player spawn cannot be inside a wall or solid sprite.");

  for (const sprite of layout.sprites) {
    const definition = getMapSprite(sprite.spriteId);
    for (const tile of getSpriteTiles(sprite)) {
      const key = tileKey(tile);
      const existing = occupiedSpriteTiles.get(key);
      if (existing) issues.push(`${definition.label} overlaps another sprite at ${key}.`);
      occupiedSpriteTiles.set(key, sprite.instanceId);
    }
  }

  for (const id of STATION_IDS) {
    const station = layout.stations[id];
    const key = tileKey(station);
    if (key === tileKey(layout.spawn)) issues.push(`${id} cannot share the player spawn tile.`);
    if (!walls.has(key)) issues.push(`${id} must be placed on a collision tile.`);
    const duplicate = stationTiles.get(key);
    if (duplicate) issues.push(`${id} and ${duplicate} cannot share a tile.`);
    if (isSpriteBlockingTile(layout.sprites, station)) {
      issues.push(`${id} cannot share a solid sprite tile.`);
    }
    stationTiles.set(key, id);
    const adjacent = [
      { x: station.x - 1, y: station.y },
      { x: station.x + 1, y: station.y },
      { x: station.x, y: station.y - 1 },
      { x: station.x, y: station.y + 1 },
    ];
    if (
      !adjacent.some(
        (tile) =>
          isTileInBounds(tile, layout) &&
          !walls.has(tileKey(tile)) &&
          !isSpriteBlockingTile(layout.sprites, tile),
      )
    ) {
      issues.push(`${id} needs at least one walkable adjacent tile.`);
    }
  }

  return issues;
}

export function loadMapLayout(storage?: Pick<Storage, "getItem">): MapLayout {
  if (!storage) return structuredClone(DEFAULT_MAP_LAYOUT);
  try {
    const parsed = JSON.parse(storage.getItem(MAP_LAYOUT_KEY) ?? "null");
    return normalizeMapLayout(parsed) ?? structuredClone(DEFAULT_MAP_LAYOUT);
  } catch {
    return structuredClone(DEFAULT_MAP_LAYOUT);
  }
}
