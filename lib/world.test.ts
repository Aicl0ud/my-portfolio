import { describe, expect, it } from "vitest";

import { isWalkable, moveWithCollisions, WORLD_BOUNDS } from "./world";

describe("portfolio room collision", () => {
  it("allows movement across open floor", () => {
    expect(isWalkable({ x: 0, z: 3.5 })).toBe(true);
  });

  it("blocks the desk footprint", () => {
    expect(isWalkable({ x: 0, z: 0.5 })).toBe(false);
  });

  it("keeps the player inside the room", () => {
    expect(isWalkable({ x: WORLD_BOUNDS.maxX, z: 3 })).toBe(false);
  });

  it("slides along furniture when one movement axis is blocked", () => {
    const next = moveWithCollisions({ x: -2.2, z: 2 }, { x: 0.3, z: -0.3 });
    expect(next.x).toBe(-2.2);
    expect(next.z).toBe(1.7);
  });
});
