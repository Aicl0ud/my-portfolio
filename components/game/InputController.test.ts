import { describe, expect, it } from "vitest";
import { InputController } from "./InputController";

describe("InputController", () => {
  it("keeps a quick keyboard tap until the game loop consumes it", () => {
    const input = new InputController();
    input.setDirection("right", true);
    input.setDirection("right", false);

    expect(input.direction).toBe("right");
    expect(input.direction).toBeNull();
  });

  it("continues returning a held direction", () => {
    const input = new InputController();
    input.setDirection("up", true);

    expect(input.direction).toBe("up");
    expect(input.direction).toBe("up");
    input.setDirection("up", false);
    expect(input.direction).toBeNull();
  });
});
