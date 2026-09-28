import {
  Application,
  Assets,
  Container,
  Rectangle,
  Sprite,
  Texture,
  type Ticker,
} from "pixi.js";
import { PORTFOLIO_STATIONS, type StationId } from "../../data/portfolio";
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
  marker: "/images/objects/red-arrow.png",
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
  private readonly markers: Sprite[] = [];
  private playerSprite: Sprite | null = null;
  private playerSheet: Texture | null = null;
  private x = 2 * TILE_SIZE;
  private y = 3 * TILE_SIZE;
  private facing: "left" | "right" = "left";
  private movement: { direction: Direction; elapsed: number; fromX: number; fromY: number } | null = null;
  private animationElapsed = 0;
  private destroyed = false;
  private initialized = false;
  private paused = false;
  private nearbyStationId: StationId | null = null;
  private reducedMotion = false;
  private readonly frameTextures = new Map<string, Texture>();

  constructor(
    private readonly events: {
      onNearbyChange: (stationId: StationId | null) => void;
      onOpenStation: (stationId: StationId) => void;
      onTileChange: (tile: { x: number; y: number }) => void;
      onSound: (sound: "step" | "open") => void;
    },
    options?: {
      initialTile?: { x: number; y: number };
      reducedMotion?: boolean;
    },
  ) {
    if (options?.initialTile && !WALLS.has(`${options.initialTile.x},${options.initialTile.y}`)) {
      this.x = options.initialTile.x * TILE_SIZE;
      this.y = options.initialTile.y * TILE_SIZE;
    }
    this.reducedMotion = options?.reducedMotion ?? false;
  }

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

    const [floorTexture, ceilingTexture, playerSheet, shadowTexture, markerSheet] = await Promise.all([
      Assets.load<Texture>(ASSETS.floor),
      Assets.load<Texture>(ASSETS.ceiling),
      Assets.load<Texture>(ASSETS.player),
      Assets.load<Texture>(ASSETS.shadow),
      Assets.load<Texture>(ASSETS.marker),
    ]);
    if (this.destroyed) return;

    for (const texture of [floorTexture, ceilingTexture, playerSheet, shadowTexture, markerSheet]) {
      texture.source.scaleMode = "nearest";
    }
    this.playerSheet = playerSheet;

    const floor = new Sprite(floorTexture);
    const markerTexture = new Texture({
      source: markerSheet.source,
      frame: new Rectangle(0, 0, 32, 32),
    });
    for (const station of PORTFOLIO_STATIONS) {
      const marker = new Sprite(markerTexture);
      marker.position.set(station.tile.x * TILE_SIZE - 8, station.tile.y * TILE_SIZE - 24);
      marker.alpha = 0.9;
      this.markers.push(marker);
      this.room.addChild(marker);
    }
    const shadow = new Sprite(shadowTexture);
    shadow.position.set(-8, 6);
    this.playerSprite = new Sprite(this.frameTexture(4, 1));
    this.playerSprite.position.set(-8, -18);
    this.player.addChild(shadow, this.playerSprite);

    const ceiling = new Sprite(ceilingTexture);
    this.room.addChildAt(floor, 0);
    this.room.addChild(this.player, ceiling);
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

  setPaused(paused: boolean) {
    this.paused = paused;
    if (paused) this.input.releaseAll();
  }

  setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
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

    if (this.paused) return;

    if (!this.reducedMotion) {
      const pulse = 0.74 + Math.sin(this.animationElapsed / 220) * 0.2;
      this.markers.forEach((marker) => { marker.alpha = pulse; });
    }

    if (this.movement) {
      this.movement.elapsed += delta;
      const progress = Math.min(
        1,
        this.movement.elapsed / (this.reducedMotion ? 1 : WALK_DURATION),
      );
      const offset = directionVector[this.movement.direction];
      this.x = this.movement.fromX + offset.x * TILE_SIZE * progress;
      this.y = this.movement.fromY + offset.y * TILE_SIZE * progress;
      if (progress === 1) {
        this.movement = null;
        const tile = {
          x: Math.round(this.x / TILE_SIZE),
          y: Math.round(this.y / TILE_SIZE),
        };
        this.events.onTileChange(tile);
        this.events.onSound("step");
      }
    } else if (this.input.direction) {
      this.tryMove(this.input.direction);
    }

    const nearbyStation = this.findNearbyStation();
    if (nearbyStation !== this.nearbyStationId) {
      this.nearbyStationId = nearbyStation;
      this.events.onNearbyChange(nearbyStation);
    }
    if (this.input.consumeInteraction() && nearbyStation) {
      this.events.onSound("open");
      this.events.onOpenStation(nearbyStation);
    }
    this.syncScene();
  };

  private findNearbyStation() {
    const tileX = Math.round(this.x / TILE_SIZE);
    const tileY = Math.round(this.y / TILE_SIZE);
    return (
      PORTFOLIO_STATIONS.find(
        (station) =>
          Math.abs(station.tile.x - tileX) + Math.abs(station.tile.y - tileY) === 1,
      )?.id ?? null
    );
  }

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
