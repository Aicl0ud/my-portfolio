import {
  Application,
  Assets,
  Container,
  Rectangle,
  Sprite,
  Texture,
  type Ticker,
} from "pixi.js";
import { InputController } from "./InputController";
import {
  MAP_SIZE,
  TILE_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
  WALLS,
  directionVector,
  type Direction,
} from "./world";

const ASSETS = {
  floor: "/images/maps/bed/base.png",
  ceiling: "/images/maps/bed/top.png",
  player: "/images/characters/player/mPlayer_[human].png",
  shadow: "/images/characters/shadow.png",
} as const;

const WALK_DURATION = 145;
const WALK_FRAMES = {
  right: [[0, 2], [1, 2], [2, 2], [3, 2], [0, 3], [1, 3], [2, 3], [3, 3]],
  left: [[4, 2], [5, 2], [6, 2], [7, 2], [4, 3], [5, 3], [6, 3], [7, 3]],
} as const;
const IDLE_FRAMES = {
  right: [[0, 1], [1, 1], [2, 1], [3, 1]],
  left: [[4, 1], [5, 1], [6, 1], [7, 1]],
} as const;

export class PortfolioGame {
  readonly input = new InputController();
  private readonly app = new Application();
  private readonly room = new Container();
  private readonly player = new Container();
  private playerSprite: Sprite | null = null;
  private playerSheet: Texture | null = null;
  private x = 2 * TILE_SIZE;
  private y = 3 * TILE_SIZE;
  private facing: "left" | "right" = "left";
  private movement: { direction: Direction; elapsed: number; fromX: number; fromY: number } | null = null;
  private animationElapsed = 0;
  private destroyed = false;
  private initialized = false;
  private readonly frameTextures = new Map<string, Texture>();

  async mount(host: HTMLDivElement) {
    await this.app.init({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      background: "#151923",
      antialias: false,
      autoDensity: false,
      resolution: 1,
    });
    this.initialized = true;
    if (this.destroyed) {
      this.app.destroy(true);
      return;
    }

    host.replaceChildren(this.app.canvas);
    this.app.canvas.setAttribute("aria-label", "An explorable pixel-art portfolio room");
    this.app.canvas.setAttribute("role", "img");

    const [floorTexture, ceilingTexture, playerSheet, shadowTexture] = await Promise.all([
      Assets.load<Texture>(ASSETS.floor),
      Assets.load<Texture>(ASSETS.ceiling),
      Assets.load<Texture>(ASSETS.player),
      Assets.load<Texture>(ASSETS.shadow),
    ]);
    if (this.destroyed) return;

    for (const texture of [floorTexture, ceilingTexture, playerSheet, shadowTexture]) {
      texture.source.scaleMode = "nearest";
    }
    this.playerSheet = playerSheet;

    const floor = new Sprite(floorTexture);
    const shadow = new Sprite(shadowTexture);
    shadow.position.set(-8, 6);
    this.playerSprite = new Sprite(this.frameTexture(4, 1));
    this.playerSprite.position.set(-8, -18);
    this.player.addChild(shadow, this.playerSprite);

    const ceiling = new Sprite(ceilingTexture);
    this.room.addChild(floor, this.player, ceiling);
    this.app.stage.addChild(this.room);
    this.syncScene();

    this.input.start();
    this.app.ticker.add(this.update);
  }

  setDirection(direction: Direction, pressed: boolean) {
    this.input.setDirection(direction, pressed);
  }

  interact() {
    this.input.queueInteraction();
  }

  destroy() {
    this.destroyed = true;
    this.input.destroy();
    this.app.ticker.remove(this.update);
    this.frameTextures.forEach((texture) => texture.destroy(false));
    this.frameTextures.clear();
    if (this.initialized) this.app.destroy(true, { children: true });
  }

  private update = (ticker: Ticker) => {
    const delta = Math.min(ticker.deltaMS, 50);
    this.animationElapsed += delta;

    if (this.movement) {
      this.movement.elapsed += delta;
      const progress = Math.min(1, this.movement.elapsed / WALK_DURATION);
      const offset = directionVector[this.movement.direction];
      this.x = this.movement.fromX + offset.x * TILE_SIZE * progress;
      this.y = this.movement.fromY + offset.y * TILE_SIZE * progress;
      if (progress === 1) this.movement = null;
    } else if (this.input.direction) {
      this.tryMove(this.input.direction);
    }

    // Reserved for portfolio hotspots in the next layer of the stack.
    this.input.consumeInteraction();
    this.syncScene();
  };

  private tryMove(direction: Direction) {
    const offset = directionVector[direction];
    const tileX = Math.round(this.x / TILE_SIZE) + offset.x;
    const tileY = Math.round(this.y / TILE_SIZE) + offset.y;
    if (WALLS.has(`${tileX},${tileY}`)) return;

    if (direction === "left" || direction === "right") this.facing = direction;
    this.movement = {
      direction,
      elapsed: 0,
      fromX: Math.round(this.x),
      fromY: Math.round(this.y),
    };
    this.animationElapsed = 0;
  }

  private syncScene() {
    this.player.position.set(Math.round(this.x), Math.round(this.y));
    this.room.position.x = (VIEWPORT_WIDTH - MAP_SIZE) / 2;
    this.room.position.y = Math.round(
      Math.max(VIEWPORT_HEIGHT - MAP_SIZE, Math.min(0, VIEWPORT_HEIGHT / 2 - this.y)),
    );

    if (!this.playerSprite) return;
    const frames = this.movement ? WALK_FRAMES[this.facing] : IDLE_FRAMES[this.facing];
    const frameDuration = this.movement ? 70 : 180;
    const frame = frames[Math.floor(this.animationElapsed / frameDuration) % frames.length];
    this.playerSprite.texture = this.frameTexture(frame[0], frame[1]);
  }

  private frameTexture(column: number, row: number) {
    if (!this.playerSheet) return Texture.EMPTY;
    const key = `${column},${row}`;
    const existing = this.frameTextures.get(key);
    if (existing) return existing;
    const texture = new Texture({
      source: this.playerSheet.source,
      frame: new Rectangle(column * 32, row * 32, 32, 32),
    });
    this.frameTextures.set(key, texture);
    return texture;
  }
}
