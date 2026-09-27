import type { Direction } from "./world";

const KEY_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};

const INTERACTION_KEYS = new Set(["Space", "Enter", "KeyX", "KeyZ"]);

export class InputController {
  private held: Direction[] = [];
  private interactionQueued = false;

  get direction() {
    return this.held[0] ?? null;
  }

  start() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.clear);
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.clear);
    this.clear();
  }

  setDirection(direction: Direction, pressed: boolean) {
    this.held = this.held.filter((item) => item !== direction);
    if (pressed) this.held.unshift(direction);
  }

  queueInteraction() {
    this.interactionQueued = true;
  }

  consumeInteraction() {
    const queued = this.interactionQueued;
    this.interactionQueued = false;
    return queued;
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const direction = KEY_DIRECTIONS[event.code];
    if (direction) {
      event.preventDefault();
      this.setDirection(direction, true);
    }
    if (INTERACTION_KEYS.has(event.code) && !event.repeat) {
      event.preventDefault();
      this.queueInteraction();
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    const direction = KEY_DIRECTIONS[event.code];
    if (direction) this.setDirection(direction, false);
  };

  private clear = () => {
    this.held = [];
    this.interactionQueued = false;
  };
}
