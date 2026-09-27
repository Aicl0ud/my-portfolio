import { useEffect, useRef, useState, type PointerEvent } from "react";
import { PortfolioGame } from "./PortfolioGame";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH, type Direction } from "./world";

function usePixelScale(host: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const element = host.current;
    if (!element) return;

    const update = () => {
      const rawScale = Math.min(
        Math.max(1, element.clientWidth) / VIEWPORT_WIDTH,
        Math.max(1, window.innerHeight - 48) / VIEWPORT_HEIGHT,
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
  const gameRef = useRef<PortfolioGame | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  usePixelScale(hostRef);

  useEffect(() => {
    const canvasHost = canvasRef.current;
    if (!canvasHost) return;

    let cancelled = false;
    const game = new PortfolioGame();
    gameRef.current = game;
    game.mount(canvasHost).then(
      () => !cancelled && setStatus("ready"),
      (error) => {
        console.error("Unable to start the portfolio scene", error);
        if (!cancelled) setStatus("error");
      },
    );

    return () => {
      cancelled = true;
      gameRef.current = null;
      game.destroy();
    };
  }, []);

  const setDirection = (direction: Direction, pressed: boolean) =>
    gameRef.current?.setDirection(direction, pressed);

  const pressDirection = (direction: Direction) => (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDirection(direction, true);
  };

  return (
    <div className="game-shell" ref={hostRef}>
      <div className="game-viewport" ref={canvasRef} />
      {status !== "ready" && (
        <div className="game-status" role={status === "error" ? "alert" : "status"}>
          {status === "loading" ? "Loading room…" : "The room could not be loaded."}
        </div>
      )}
      {status === "ready" && (
        <div className="touch-controls" aria-label="Game controls">
          <div className="d-pad">
            {(["up", "left", "down", "right"] as Direction[]).map((direction) => (
              <button
                className={`control control-${direction}`}
                key={direction}
                type="button"
                aria-label={`Move ${direction}`}
                onPointerDown={pressDirection(direction)}
                onPointerUp={() => setDirection(direction, false)}
                onPointerCancel={() => setDirection(direction, false)}
                onContextMenu={(event) => event.preventDefault()}
              >
                {{ up: "▲", left: "◀", down: "▼", right: "▶" }[direction]}
              </button>
            ))}
          </div>
          <button
            className="control action-button"
            type="button"
            aria-label="Interact"
            onPointerDown={() => gameRef.current?.interact()}
          >
            A
          </button>
        </div>
      )}
    </div>
  );
}
