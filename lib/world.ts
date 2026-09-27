export type Point2D = { x: number; z: number };

type Obstacle = {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export const WORLD_BOUNDS = {
  minX: -6.1,
  maxX: 6.1,
  minZ: -4.7,
  maxZ: 4.7,
};

export const ROOM_OBSTACLES: Obstacle[] = [
  { id: "bed", minX: -5.85, maxX: -2.85, minZ: -4.85, maxZ: -0.85 },
  { id: "desk", minX: -1.65, maxX: 2.65, minZ: -0.55, maxZ: 1.75 },
  { id: "bookshelf", minX: 2.9, maxX: 6.25, minZ: -4.1, maxZ: -2.75 },
  { id: "plant", minX: -5.7, maxX: -3.9, minZ: 2.65, maxZ: 4.45 },
];

export const PLAYER_RADIUS = 0.38;

export function isWalkable(position: Point2D, radius = PLAYER_RADIUS) {
  if (
    position.x - radius < WORLD_BOUNDS.minX ||
    position.x + radius > WORLD_BOUNDS.maxX ||
    position.z - radius < WORLD_BOUNDS.minZ ||
    position.z + radius > WORLD_BOUNDS.maxZ
  ) {
    return false;
  }

  return !ROOM_OBSTACLES.some(
    (obstacle) =>
      position.x + radius > obstacle.minX &&
      position.x - radius < obstacle.maxX &&
      position.z + radius > obstacle.minZ &&
      position.z - radius < obstacle.maxZ,
  );
}

export function moveWithCollisions(current: Point2D, movement: Point2D) {
  const next = { ...current };
  const nextX = { x: current.x + movement.x, z: current.z };
  const nextZ = { x: next.x, z: current.z + movement.z };

  if (isWalkable(nextX)) next.x = nextX.x;
  nextZ.x = next.x;
  if (isWalkable(nextZ)) next.z = nextZ.z;

  return next;
}
