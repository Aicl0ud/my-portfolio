import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";

import { AccessiblePortfolio } from "../components/ui/AccessiblePortfolio";
import { MobileControls } from "../components/ui/MobileControls";
import { PortfolioOverlay } from "../components/ui/PortfolioOverlay";
import { SceneErrorBoundary } from "../components/ui/SceneErrorBoundary";

const SceneCanvas = dynamic(() => import("../components/scene/SceneCanvas"), {
  ssr: false,
  loading: () => <div className="scene-loading">Building the room…</div>,
});

const SITE_URL = "https://my-portfolio-aicl0ud.vercel.app";
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Teerasit Wongpa",
  alternateName: "Kiw",
  jobTitle: "Software Engineer",
  address: { "@type": "PostalAddress", addressLocality: "Bangkok", addressCountry: "TH" },
  url: SITE_URL,
  sameAs: ["https://github.com/Aicl0ud", "https://www.linkedin.com/in/teerasit-wongpa/"],
};

export default function Home() {
  const [introVisible, setIntroVisible] = useState(true);
  const [portfolioVisible, setPortfolioVisible] = useState(false);

  return (
    <div className={portfolioVisible ? "app-shell reading-mode" : "app-shell"}>
      <button className="skip-link" type="button" onClick={() => setPortfolioVisible(true)}>
        Skip the 3D room and view portfolio
      </button>
      <Head>
        <title>Kiw · Interactive portfolio</title>
        <meta
          name="description"
          content="Explore Kiw's software engineering work in an interactive 3D portfolio."
        />
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kiw · Interactive portfolio" />
        <meta property="og:description" content="Explore software engineering work in an interactive 3D room—or read the accessible portfolio." />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kiw · Interactive portfolio" />
        <meta name="twitter:description" content="An interactive 3D software engineering portfolio." />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <noscript>
        <section className="noscript-portfolio">
          <h1>Teerasit “Kiw” Wongpa</h1>
          <p>Software engineer based in Bangkok, Thailand.</p>
          <a href="mailto:teerasit.won@gmail.com">teerasit.won@gmail.com</a>
          <a href="https://github.com/Aicl0ud">GitHub</a>
          <a href="https://www.linkedin.com/in/teerasit-wongpa/">LinkedIn</a>
        </section>
      </noscript>

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
          <SceneErrorBoundary onFallback={() => setPortfolioVisible(true)}>
            <SceneCanvas />
          </SceneErrorBoundary>
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
