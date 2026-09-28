import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
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
import {
  MAP_SPRITES,
  SPRITE_ATLAS,
  getMapSprite,
  getSpriteTiles,
  isMapSpriteId,
  spriteContainsTile,
  type MapSpriteId,
  type PlacedMapSprite,
} from "../../data/mapSprites";

type EditorTool = "wall" | "erase" | "spawn" | "erase-sprite" | StationId | MapSpriteId;

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

function spriteStyle(spriteId: MapSpriteId): CSSProperties {
  const sprite = getMapSprite(spriteId);
  return {
    backgroundImage: `url(${SPRITE_ATLAS})`,
    backgroundPosition: `${sprite.column * 50}% ${sprite.row * 50}%`,
    backgroundSize: "300% 300%",
  };
}

function nextSpriteId(sprites: PlacedMapSprite[], spriteId: MapSpriteId) {
  let suffix = sprites.length + 1;
  while (sprites.some((sprite) => sprite.instanceId === `${spriteId}-${suffix}`)) suffix += 1;
  return `${spriteId}-${suffix}`;
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

  const placedSpriteAt = (tile: TilePosition, sprites = layout.sprites) =>
    sprites.find((sprite) => spriteContainsTile(sprite, tile));

  const applyTool = (tile: TilePosition) => {
    setLayout((current) => {
      const next = cloneLayout(current);
      const key = tileKey(tile);
      const station = PORTFOLIO_STATIONS.find(
        (item) => tileKey(next.stations[item.id]) === key,
      );

      if (tool === "erase-sprite") {
        const sprite = placedSpriteAt(tile, next.sprites);
        if (!sprite) {
          setStatus("There is no placed sprite on this tile.");
          return current;
        }
        next.sprites = next.sprites.filter((item) => item.instanceId !== sprite.instanceId);
      } else if (isMapSpriteId(tool)) {
        const definition = getMapSprite(tool);
        const placed: PlacedMapSprite = {
          instanceId: nextSpriteId(next.sprites, tool),
          spriteId: tool,
          x: tile.x,
          y: tile.y,
        };
        const spriteTiles = getSpriteTiles(placed);
        if (!spriteTiles.every((currentTile) => currentTile.x < next.width && currentTile.y < next.height)) {
          setStatus(`${definition.label} does not fit inside the map from this tile.`);
          return current;
        }
        if (next.sprites.some((sprite) => spriteTiles.some((currentTile) => spriteContainsTile(sprite, currentTile)))) {
          setStatus("Move or erase the existing sprite before placing another one here.");
          return current;
        }
        if (
          definition.solid &&
          spriteTiles.some((currentTile) =>
            tileKey(currentTile) === tileKey(next.spawn) ||
            PORTFOLIO_STATIONS.some(
              (item) => tileKey(next.stations[item.id]) === tileKey(currentTile),
            ),
          )
        ) {
          setStatus("Solid sprites cannot cover the player spawn or a story marker.");
          return current;
        }
        next.sprites.push(placed);
      } else if (tool === "wall") {
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
    if (
      painting.current &&
      (tool === "wall" || tool === "erase" || tool === "erase-sprite")
    ) applyTool(tile);
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
          <p>Paint collision, place furniture sprites, and position the player and story markers.</p>
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
              <div className="editor-sprite-layer" aria-hidden="true">
                {layout.sprites.map((sprite) => {
                  const definition = getMapSprite(sprite.spriteId);
                  return (
                    <span
                      key={sprite.instanceId}
                      className="editor-placed-sprite"
                      style={{
                        ...spriteStyle(sprite.spriteId),
                        left: `${(sprite.x / layout.width) * 100}%`,
                        top: `${(sprite.y / layout.height) * 100}%`,
                        width: `${(definition.width / layout.width) * 100}%`,
                        height: `${(definition.height / layout.height) * 100}%`,
                      }}
                    />
                  );
                })}
              </div>
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
            <h2>Collision & markers</h2>
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

          <section className="editor-card editor-sprite-card">
            <div className="editor-card-heading">
              <div>
                <h2>Sprite palette</h2>
                <p>Place furniture from its top-left tile.</p>
              </div>
              <button
                type="button"
                className={tool === "erase-sprite" ? "active" : ""}
                aria-pressed={tool === "erase-sprite"}
                onClick={() => {
                  setTool("erase-sprite");
                  setStatus("Sprite eraser selected. Click any part of an object to remove it.");
                }}
              >
                Erase
              </button>
            </div>
            <div className="editor-sprite-palette">
              {MAP_SPRITES.map((sprite) => (
                <button
                  key={sprite.id}
                  type="button"
                  className={tool === sprite.id ? "active" : ""}
                  aria-pressed={tool === sprite.id}
                  title={`${sprite.label} · ${sprite.width}×${sprite.height}${sprite.solid ? " · solid" : " · walkable"}`}
                  onClick={() => {
                    setTool(sprite.id);
                    setStatus(`${sprite.label} selected. Place from the object's top-left tile.`);
                  }}
                >
                  <span className="editor-sprite-preview" style={spriteStyle(sprite.id)} />
                  <span>{sprite.label}</span>
                  <small>{sprite.width}×{sprite.height} · {sprite.solid ? "solid" : "walkable"}</small>
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
