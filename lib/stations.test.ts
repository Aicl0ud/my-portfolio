import { describe, expect, it } from "vitest";

import { findNearbyStation } from "./stations";

describe("portfolio stations", () => {
  it("finds the about station within interaction range", () => {
    expect(findNearbyStation({ x: -3.1, z: 2.15 })).toBe("about");
  });

  it("returns no station in open floor space", () => {
    expect(findNearbyStation({ x: 0, z: 3.8 })).toBeNull();
  });
});
