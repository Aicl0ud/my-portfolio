import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";

import { AccessiblePortfolio } from "../components/ui/AccessiblePortfolio";
import { MobileControls } from "../components/ui/MobileControls";
import { PortfolioOverlay } from "../components/ui/PortfolioOverlay";

const SceneCanvas = dynamic(() => import("../components/scene/SceneCanvas"), {
  ssr: false,
  loading: () => <div className="scene-loading">Building the room…</div>,
});

export default function Home() {
  const [introVisible, setIntroVisible] = useState(true);
  const [portfolioVisible, setPortfolioVisible] = useState(false);

  return (
    <div className={portfolioVisible ? "app-shell reading-mode" : "app-shell"}>
      <Head>
        <title>Kiw · Interactive portfolio</title>
        <meta
          name="description"
          content="Explore Kiw's software engineering work in an interactive 3D portfolio."
        />
      </Head>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="Kiw portfolio home">
          <span className="brand-mark">K</span>
          <span><strong>Kiw</strong><small>Software engineer</small></span>
        </a>
        <div className="topbar-actions">
          {!portfolioVisible ? (
            <span className="status-chip"><span aria-hidden="true" /> Three.js room</span>
          ) : null}
          <button className="view-toggle" type="button" onClick={() => setPortfolioVisible((value) => !value)}>
            {portfolioVisible ? "Explore 3D room" : "View portfolio"}
          </button>
        </div>
      </header>

      {portfolioVisible ? (
        <AccessiblePortfolio onReturn={() => setPortfolioVisible(false)} />
      ) : (
        <main id="top" className="scene-shell">
          <SceneCanvas />
          <PortfolioOverlay />
          <MobileControls />
          {introVisible ? (
            <div className="scene-intro" aria-live="polite">
              <button type="button" className="intro-close" onClick={() => setIntroVisible(false)} aria-label="Dismiss instructions">×</button>
              <p className="eyebrow">Welcome to my space</p>
              <h1>Walk through my work in 3D.</h1>
              <p>Move with WASD, arrow keys, or the touch controls. Explore each glowing station.</p>
              <button type="button" className="intro-action" onClick={() => setIntroVisible(false)}>Start exploring</button>
            </div>
          ) : null}
          <div className="controls-hint" aria-label="Keyboard controls">
            <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span>Move</span>
          </div>
        </main>
      )}

      {!portfolioVisible ? (
        <footer className="scene-footer"><span>Bangkok, Thailand</span><span>Isometric portfolio · v2</span></footer>
      ) : null}
    </div>
  );
}
