import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  DEFAULT_MAP_LAYOUT,
  MAP_LAYOUT_KEY,
  getMapLayoutIssues,
  loadMapLayout,
  normalizeMapLayout,
  tileKey,
  type MapLayout,
  type TilePosition,
} from "../../data/mapLayout";
import { PORTFOLIO_STATIONS, type StationId } from "../../data/portfolio";

type EditorTool = "wall" | "erase" | "spawn" | StationId;

const TOOLS: Array<{ id: EditorTool; label: string; hint: string }> = [
  { id: "wall", label: "Wall", hint: "Paint blocked tiles" },
  { id: "erase", label: "Erase", hint: "Remove blocked tiles" },
  { id: "spawn", label: "Spawn", hint: "Set player start" },
  { id: "about", label: "About", hint: "Move About marker" },
  { id: "experience", label: "Experience", hint: "Move Experience marker" },
  { id: "projects", label: "Projects", hint: "Move Projects marker" },
  { id: "contact", label: "Contact", hint: "Move Contact marker" },
];

function cloneLayout(layout: MapLayout): MapLayout {
  return structuredClone(layout);
}

export default function MapEditor() {
  const [layout, setLayout] = useState(() => loadMapLayout(window.localStorage));
  const [tool, setTool] = useState<EditorTool>("wall");
  const [showUpperLayer, setShowUpperLayer] = useState(true);
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(loadMapLayout(window.localStorage), null, 2),
  );
  const [status, setStatus] = useState("Ready. Choose a tool and edit the grid.");
  const painting = useRef(false);
  const issues = getMapLayoutIssues(layout);

  useEffect(() => {
    const stopPainting = () => { painting.current = false; };
    window.addEventListener("pointerup", stopPainting);
    window.addEventListener("pointercancel", stopPainting);
    return () => {
      window.removeEventListener("pointerup", stopPainting);
      window.removeEventListener("pointercancel", stopPainting);
    };
  }, []);

  const stationAt = (tile: TilePosition) =>
    PORTFOLIO_STATIONS.find((station) =>
      tileKey(layout.stations[station.id]) === tileKey(tile),
    )?.id;

  const applyTool = (tile: TilePosition) => {
    setLayout((current) => {
      const next = cloneLayout(current);
      const key = tileKey(tile);
      const station = PORTFOLIO_STATIONS.find(
        (item) => tileKey(next.stations[item.id]) === key,
      );

      if (tool === "wall") {
        if (key === tileKey(next.spawn)) {
          setStatus("Move the player spawn before placing a wall here.");
          return current;
        }
        if (!next.walls.includes(key)) next.walls.push(key);
      } else if (tool === "erase") {
        if (station) {
          setStatus(`Move the ${station.shortLabel} marker before erasing its wall.`);
          return current;
        }
        next.walls = next.walls.filter((wall) => wall !== key);
      } else if (tool === "spawn") {
        if (station) {
          setStatus(`Move the ${station.shortLabel} marker before placing the spawn here.`);
          return current;
        }
        next.spawn = tile;
        next.walls = next.walls.filter((wall) => wall !== key);
      } else {
        if (key === tileKey(next.spawn)) {
          setStatus("Move the player spawn before placing a story marker here.");
          return current;
        }
        if (station && station.id !== tool) {
          setStatus(`This tile is already used by the ${station.shortLabel} marker.`);
          return current;
        }
        next.stations[tool] = tile;
        if (key !== tileKey(next.spawn) && !next.walls.includes(key)) next.walls.push(key);
      }

      setStatus(`Changed tile ${tile.x}, ${tile.y}. Save to use it in the game.`);
      return next;
    });
  };

  const beginPaint = (tile: TilePosition, event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    painting.current = true;
    applyTool(tile);
  };

  const continuePaint = (tile: TilePosition) => {
    if (painting.current && (tool === "wall" || tool === "erase")) applyTool(tile);
  };

  const save = () => {
    if (issues.length) {
      setStatus(`Fix ${issues.length} layout issue${issues.length === 1 ? "" : "s"} before saving.`);
      return;
    }
    try {
      localStorage.setItem(MAP_LAYOUT_KEY, JSON.stringify(layout));
      setJsonText(JSON.stringify(layout, null, 2));
      setStatus("Saved. Reload the game preview to use this layout.");
    } catch {
      setStatus("Browser storage is unavailable. Download the JSON instead.");
    }
  };

  const reset = () => {
    const next = cloneLayout(DEFAULT_MAP_LAYOUT);
    setLayout(next);
    setJsonText(JSON.stringify(next, null, 2));
    setStatus("Default layout restored in the editor. Save to apply it.");
  };

  const importJson = () => {
    try {
      const imported = normalizeMapLayout(JSON.parse(jsonText));
      if (!imported) throw new Error("Invalid map schema");
      setLayout(imported);
      setStatus("JSON imported. Review the grid, then save to apply it.");
    } catch {
      setStatus("Could not import JSON. Check the schema and tile coordinates.");
    }
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-map.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded portfolio-map.json.");
  };

  const cells = Array.from({ length: layout.width * layout.height }, (_, index) => ({
    x: index % layout.width,
    y: Math.floor(index / layout.width),
  }));

  return (
    <main className="editor-page">
      <header className="editor-header">
        <div>
          <p className="eyebrow">Developer tool</p>
          <h1>Portfolio map editor</h1>
          <p>Paint collision tiles and position the player and story markers over the current room art.</p>
        </div>
        <Link href="/">← Back to game</Link>
      </header>

      <div className="editor-workspace">
        <section className="editor-canvas-panel" aria-labelledby="map-heading">
          <div className="editor-panel-heading">
            <div>
              <h2 id="map-heading">Room layout</h2>
              <p>14 × 14 grid · coordinates start at 0,0</p>
            </div>
            <label className="editor-toggle">
              <input
                type="checkbox"
                checked={showUpperLayer}
                onChange={(event) => setShowUpperLayer(event.target.checked)}
              />
              Upper layer
            </label>
          </div>

          <div className="editor-map-wrap">
            <div className="editor-map">
              <Image
                className="editor-map-image"
                src="/images/maps/bed/base.png"
                width={224}
                height={224}
                alt="Pixel-art room base layer"
                priority
                draggable={false}
              />
              {showUpperLayer ? (
                <Image
                  className="editor-map-image editor-upper-layer"
                  src="/images/maps/bed/top.png"
                  width={224}
                  height={224}
                  alt=""
                  draggable={false}
                />
              ) : null}
              <div className="editor-grid" style={{ gridTemplateColumns: `repeat(${layout.width}, 1fr)` }}>
                {cells.map((tile) => {
                  const key = tileKey(tile);
                  const station = stationAt(tile);
                  const isSpawn = key === tileKey(layout.spawn);
                  const isWall = layout.walls.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`editor-cell${isWall ? " is-wall" : ""}${isSpawn ? " is-spawn" : ""}${station ? ` is-station station-${station}` : ""}`}
                      title={`${tile.x},${tile.y}${station ? ` · ${station}` : ""}`}
                      aria-label={`Tile ${tile.x}, ${tile.y}${isWall ? ", wall" : ""}${isSpawn ? ", player spawn" : ""}${station ? `, ${station} marker` : ""}`}
                      onPointerDown={(event) => beginPaint(tile, event)}
                      onPointerEnter={() => continuePaint(tile)}
                    >
                      {isSpawn ? "P" : station ? station[0].toUpperCase() : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="editor-legend" aria-label="Map legend">
            <span><i className="legend-wall" /> Collision</span>
            <span><i className="legend-spawn" /> Player</span>
            <span><i className="legend-station" /> Story</span>
          </div>
        </section>

        <aside className="editor-sidebar">
          <section className="editor-card">
            <h2>Tools</h2>
            <div className="editor-tools">
              {TOOLS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={tool === item.id ? "active" : ""}
                  aria-pressed={tool === item.id}
                  title={item.hint}
                  onClick={() => {
                    setTool(item.id);
                    setStatus(`${item.label} tool selected. ${item.hint}.`);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="editor-card">
            <h2>Validate & save</h2>
            {issues.length ? (
              <ul className="editor-issues">
                {issues.map((issue) => <li key={issue}>{issue}</li>)}
              </ul>
            ) : (
              <p className="editor-valid">Layout is playable.</p>
            )}
            <div className="editor-actions">
              <button type="button" className="primary" onClick={save}>Save to browser</button>
              <Link href="/">Preview game</Link>
              <button type="button" onClick={reset}>Reset default</button>
            </div>
          </section>

          <section className="editor-card">
            <h2>JSON</h2>
            <p>Export this file to commit a layout later, or paste another v1 layout below.</p>
            <textarea
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              spellCheck={false}
              aria-label="Map layout JSON"
            />
            <div className="editor-actions compact">
              <button type="button" onClick={() => setJsonText(JSON.stringify(layout, null, 2))}>Refresh JSON</button>
              <button type="button" onClick={importJson}>Import JSON</button>
              <button type="button" onClick={downloadJson}>Download</button>
            </div>
          </section>
        </aside>
      </div>

      <p className="editor-status" role="status">{status}</p>
    </main>
  );
}
