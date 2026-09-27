import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { PORTFOLIO_STATIONS, type StationId } from "../../data/portfolio";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { PortfolioGame } from "./PortfolioGame";
import { ReadablePortfolio } from "./ReadablePortfolio";
import { SoundController } from "./SoundController";
import { StoryPanel } from "./StoryPanel";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH, type Direction } from "./world";

const PROGRESS_KEY = "kiw-portfolio-progress-v1";
type SavedProgress = { visited: StationId[]; tile: { x: number; y: number } };

function loadProgress(): SavedProgress {
  const fallback = { visited: [], tile: { x: 2, y: 3 } };
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "null") as SavedProgress | null;
    if (!saved || !Array.isArray(saved.visited) || !saved.tile) return fallback;
    const validIds = new Set(PORTFOLIO_STATIONS.map((station) => station.id));
    return {
      visited: saved.visited.filter((id) => validIds.has(id)),
      tile: saved.tile,
    };
  } catch {
    return fallback;
  }
}

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
  const soundRef = useRef(new SoundController());
  const reducedMotion = useReducedMotion();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [nearbyStationId, setNearbyStationId] = useState<StationId | null>(null);
  const [activeStationId, setActiveStationId] = useState<StationId | null>(null);
  const [visited, setVisited] = useState<StationId[]>([]);
  const [playerTile, setPlayerTile] = useState({ x: 2, y: 3 });
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showHelp, setShowHelp] = useState(true);
  const [readable, setReadable] = useState(false);

  usePixelScale(hostRef);

  useEffect(() => {
    const canvasHost = canvasRef.current;
    if (!canvasHost) return;
    const sound = soundRef.current;

    const progress = loadProgress();
    setVisited(progress.visited);
    setPlayerTile(progress.tile);
    setProgressLoaded(true);

    let cancelled = false;
    const game = new PortfolioGame(
      {
        onNearbyChange: setNearbyStationId,
        onOpenStation: (stationId) => {
          setActiveStationId(stationId);
          setVisited((current) =>
            current.includes(stationId) ? current : [...current, stationId],
          );
        },
        onTileChange: setPlayerTile,
        onSound: (effect) => sound.play(effect),
      },
      { initialTile: progress.tile, reducedMotion },
    );
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
      sound.destroy();
    };
    // The game owns its lifecycle. Preference changes are applied by effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    gameRef.current?.setPaused(Boolean(activeStationId) || showHelp || readable);
  }, [activeStationId, readable, showHelp]);

  useEffect(() => {
    gameRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    soundRef.current.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (!progressLoaded) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify({ visited, tile: playerTile }));
    } catch {
      // Progress persistence is optional in privacy modes that disable storage.
    }
  }, [playerTile, progressLoaded, visited]);

  const closeStory = useCallback(() => setActiveStationId(null), []);
  const setDirection = (direction: Direction, pressed: boolean) =>
    gameRef.current?.setDirection(direction, pressed);
  const pressDirection = (direction: Direction) => (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDirection(direction, true);
  };

  const nearbyStation = PORTFOLIO_STATIONS.find((station) => station.id === nearbyStationId);
  const nextStation = PORTFOLIO_STATIONS.find((station) => !visited.includes(station.id));

  return (
    <>
      <div className={`game-shell${readable ? " game-mode-hidden" : ""}`} ref={hostRef}>
        <div className="game-viewport" ref={canvasRef} />
        {status !== "ready" && (
          <div className="game-status" role={status === "error" ? "alert" : "status"}>
            {status === "loading" ? "Loading room…" : "The room could not be loaded."}
          </div>
        )}
        {status === "ready" && (
          <>
            <div
              className="explore-progress"
              aria-label={`${visited.length} of ${PORTFOLIO_STATIONS.length} stories explored`}
            >
              <span>{nextStation ? `Quest: find ${nextStation.shortLabel}` : "Quest complete!"}</span>
              <strong>{visited.length}/{PORTFOLIO_STATIONS.length}</strong>
              <div>
                {PORTFOLIO_STATIONS.map((station) => (
                  <i key={station.id} className={visited.includes(station.id) ? "done" : ""} />
                ))}
              </div>
            </div>

            <div className="game-toolbar" aria-label="Portfolio options">
              <button type="button" onClick={() => setMuted((value) => !value)}>
                {muted ? "Sound off" : "Sound on"}
              </button>
              <button type="button" onClick={() => setShowHelp(true)}>Help</button>
              <button type="button" onClick={() => setReadable(true)}>Read portfolio</button>
            </div>

            <div className="mini-map" aria-label="Room minimap">
              {PORTFOLIO_STATIONS.map((station) => (
                <i
                  key={station.id}
                  className={visited.includes(station.id) ? "visited" : ""}
                  style={{ left: `${(station.tile.x / 14) * 100}%`, top: `${(station.tile.y / 14) * 100}%` }}
                />
              ))}
              <b style={{ left: `${(playerTile.x / 14) * 100}%`, top: `${(playerTile.y / 14) * 100}%` }} />
            </div>

            {nearbyStation && !activeStationId ? (
              <button className="interaction-prompt" type="button" onClick={() => gameRef.current?.interact()}>
                <kbd>E</kbd> Explore {nearbyStation.shortLabel}
              </button>
            ) : null}

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
              <button className="control action-button" type="button" aria-label="Interact" onPointerDown={() => gameRef.current?.interact()}>
                A
              </button>
            </div>
          </>
        )}

        {showHelp ? (
          <div className="help-backdrop" role="presentation">
            <section className="help-card" role="dialog" aria-modal="true" aria-labelledby="help-title">
              <p className="eyebrow">Tiny quest · big story</p>
              <h2 id="help-title">Explore Kiw&apos;s room</h2>
              <p>Walk to the four red markers to discover About, Experience, Projects, and Contact.</p>
              <ul>
                <li><kbd>WASD</kbd> or arrow keys to move</li>
                <li><kbd>E</kbd>, <kbd>Enter</kbd>, or <kbd>Space</kbd> to explore</li>
              </ul>
              <button type="button" autoFocus onClick={() => setShowHelp(false)}>Start exploring</button>
            </section>
          </div>
        ) : null}

        {activeStationId ? (
          <StoryPanel stationId={activeStationId} visited={visited} onClose={closeStory} />
        ) : null}
      </div>
      {readable ? <ReadablePortfolio onReturn={() => setReadable(false)} /> : null}
    </>
  );
}
