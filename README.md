# My Portfolio

An interactive portfolio presented as a small explorable game.

## Requirements

- Node.js 20.9 or newer (Node 24 recommended)
- npm 11 or newer

## Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run check
```

The check command runs ESLint, TypeScript validation, unit tests, and a production build.

## Experience modes

- **3D room:** an isometric Three.js scene with keyboard and touch controls, collision-aware movement, and four interactive portfolio stations.
- **Readable portfolio:** a conventional, responsive presentation of the same profile, experience, projects, and contact content.

Visitors can switch modes at any time. The readable view also serves as the fallback when WebGL is unavailable.

## Architecture

- `components/scene/` contains the React Three Fiber scene and player systems.
- `components/ui/` contains accessible HTML overlays and the readable portfolio.
- `data/portfolio.ts` is the shared content source for both modes.
- `store/game.ts` owns transient game and exploration state.
- `lib/` contains collision and station proximity logic with Vitest coverage.

## Deployment

The site builds as statically rendered Pages Router content and is ready for Vercel:

```bash
npm ci
npm run check
```

Deploy only after the quality gate passes. Update the canonical URL, sitemap, and social metadata if the production domain changes.
