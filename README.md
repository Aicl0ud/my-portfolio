# Kiw's 2D Game Portfolio

An explorable pixel-art portfolio built with Next.js, React, TypeScript, and PixiJS.

Visitors can walk around a compact room and discover four stories: About, Experience,
Projects, and Contact. A complete readable mode is available for people who prefer a
traditional portfolio or do not want to use the game controls.

## Requirements

- Node.js 20.9 or newer (Node 24 recommended)
- npm 11 or newer

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Controls

- Move with WASD, arrow keys, or the on-screen direction pad.
- Explore a nearby marker with E, Enter, Space, Z, X, or the on-screen A button.
- Close a story with Escape or its close button.
- Use **Read portfolio** to switch to the non-game presentation.

Progress and player position are stored only in the visitor's browser. Sound is off by
default and uses a small synthesized effect without downloading audio files.

## Quality checks

```bash
npm run check
```

The check command runs ESLint, TypeScript validation, Vitest unit tests, and a production
build. Run individual stages with `npm run lint`, `npm run typecheck`, `npm test`, or
`npm run build`.

## Architecture

- `components/game/PortfolioGame.ts` owns the PixiJS lifecycle, movement, camera, and rendering.
- `components/game/PixiStage.tsx` connects the game to React UI and browser preferences.
- `data/portfolio.ts` is the single source of truth for portfolio content and hotspots.
- `components/game/ReadablePortfolio.tsx` keeps all content available as semantic HTML.
