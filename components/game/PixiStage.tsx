import { Application, Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";

const VIEWPORT_WIDTH = 320;
const VIEWPORT_HEIGHT = 180;
const MAP_SIZE = 224;

const ASSETS = [
  "/images/maps/bed/base.png",
  "/images/maps/bed/top.png",
  "/images/characters/player/mPlayer_[human].png",
] as const;

function usePixelScale(host: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = host.current;
    if (!element) return;

    const update = () => {
      const availableWidth = Math.max(1, element.clientWidth);
      const availableHeight = Math.max(1, window.innerHeight - 48);
      const rawScale = Math.min(
        availableWidth / VIEWPORT_WIDTH,
        availableHeight / VIEWPORT_HEIGHT,
      );
      const scale = rawScale >= 1 ? Math.max(1, Math.floor(rawScale)) : rawScale;
      element.style.setProperty("--game-scale", String(scale));
    };

    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [host]);
}

export default function PixiStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  usePixelScale(hostRef);

  useEffect(() => {
    const canvasHost = canvasRef.current;
    if (!canvasHost) return;

    let cancelled = false;
    const app = new Application();

    const mount = async () => {
      try {
        await app.init({
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
          background: "#151923",
          antialias: false,
          autoDensity: false,
          resolution: 1,
        });
        if (cancelled) {
          app.destroy(true);
          return;
        }

        canvasHost.replaceChildren(app.canvas);
        app.canvas.setAttribute("aria-label", "An explorable pixel-art portfolio room");
        app.canvas.setAttribute("role", "img");

        const [floorTexture, ceilingTexture, playerSheet] = await Promise.all(
          ASSETS.map((asset) => Assets.load<Texture>(asset)),
        );
        if (cancelled) return;

        for (const texture of [floorTexture, ceilingTexture, playerSheet]) {
          texture.source.scaleMode = "nearest";
        }

        const room = new Container();
        room.position.set((VIEWPORT_WIDTH - MAP_SIZE) / 2, (VIEWPORT_HEIGHT - MAP_SIZE) / 2);

        const floor = new Sprite(floorTexture);
        const playerTexture = new Texture({
          source: playerSheet.source,
          frame: new Rectangle(0, 32, 32, 32),
        });
        const player = new Sprite(playerTexture);
        player.position.set(16, 30);

        const ceiling = new Sprite(ceilingTexture);
        room.addChild(floor, player, ceiling);
        app.stage.addChild(room);
        setStatus("ready");
      } catch (error) {
        console.error("Unable to start the portfolio scene", error);
        if (!cancelled) setStatus("error");
      }
    };

    void mount();

    return () => {
      cancelled = true;
      app.destroy(true, { children: true });
    };
  }, []);

  return (
    <div className="game-shell" ref={hostRef}>
      <div className="game-viewport" ref={canvasRef} />
      {status !== "ready" && (
        <div className="game-status" role={status === "error" ? "alert" : "status"}>
          {status === "loading" ? "Loading room…" : "The room could not be loaded."}
        </div>
      )}
    </div>
  );
}
