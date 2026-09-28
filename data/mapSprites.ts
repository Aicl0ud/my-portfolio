import type { TilePosition } from "./mapLayout";

export const SPRITE_ATLAS = "/images/editor/furniture-sprites.png";
export const SPRITE_ATLAS_COLUMNS = 3;
export const SPRITE_FRAME_SIZE = 418;

export const MAP_SPRITES = [
  { id: "bed", label: "Bed", column: 0, row: 0, width: 2, height: 3, solid: true },
  { id: "bookshelf", label: "Bookshelf", column: 1, row: 0, width: 2, height: 2, solid: true },
  { id: "plant", label: "Plant", column: 2, row: 0, width: 1, height: 2, solid: true },
  { id: "desk", label: "Computer desk", column: 0, row: 1, width: 3, height: 2, solid: true },
  { id: "lamp", label: "Floor lamp", column: 1, row: 1, width: 1, height: 2, solid: true },
  { id: "armchair", label: "Armchair", column: 2, row: 1, width: 2, height: 2, solid: true },
  { id: "rug", label: "Blue rug", column: 0, row: 2, width: 3, height: 2, solid: false },
  { id: "crate", label: "Crate", column: 1, row: 2, width: 1, height: 1, solid: true },
  { id: "arcade", label: "Arcade", column: 2, row: 2, width: 1, height: 2, solid: true },
] as const;

export type MapSpriteId = (typeof MAP_SPRITES)[number]["id"];

export type PlacedMapSprite = {
  instanceId: string;
  spriteId: MapSpriteId;
  x: number;
  y: number;
};

export function isMapSpriteId(value: unknown): value is MapSpriteId {
  return MAP_SPRITES.some((sprite) => sprite.id === value);
}

export function getMapSprite(id: MapSpriteId) {
  return MAP_SPRITES.find((sprite) => sprite.id === id)!;
}

export function getSpriteTiles(sprite: PlacedMapSprite): TilePosition[] {
  const definition = getMapSprite(sprite.spriteId);
  return Array.from({ length: definition.width * definition.height }, (_, index) => ({
    x: sprite.x + (index % definition.width),
    y: sprite.y + Math.floor(index / definition.width),
  }));
}

export function spriteContainsTile(sprite: PlacedMapSprite, tile: TilePosition) {
  return getSpriteTiles(sprite).some((current) => current.x === tile.x && current.y === tile.y);
}

export function isSpriteBlockingTile(sprites: PlacedMapSprite[], tile: TilePosition) {
  return sprites.some(
    (sprite) => getMapSprite(sprite.spriteId).solid && spriteContainsTile(sprite, tile),
  );
}
