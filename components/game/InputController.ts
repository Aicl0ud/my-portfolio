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

const INTERACTION_KEYS = new Set(["Space", "Enter", "KeyE", "KeyX", "KeyZ"]);

export class InputController {
  private held: Direction[] = [];
  private queuedDirection: Direction | null = null;
  private interactionQueued = false;

  get direction() {
    const direction = this.held[0] ?? this.queuedDirection;
    this.queuedDirection = null;
    return direction;
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
    if (pressed) {
      this.held.unshift(direction);
      this.queuedDirection = direction;
    }
  }

  queueInteraction() {
    this.interactionQueued = true;
  }

  consumeInteraction() {
    const queued = this.interactionQueued;
    this.interactionQueued = false;
    return queued;
  }

  releaseAll() {
    this.clear();
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
    this.queuedDirection = null;
    this.interactionQueued = false;
  };
}
