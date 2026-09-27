import dynamic from "next/dynamic";
import Head from "next/head";

const SceneCanvas = dynamic(() => import("../components/scene/SceneCanvas"), {
  ssr: false,
  loading: () => <div className="scene-loading">Building the room…</div>,
});

export default function Home() {
  return (
    <div className="app-shell">
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
          <span>
            <strong>Kiw</strong>
            <small>Software engineer</small>
          </span>
        </a>
        <span className="status-chip">
          <span aria-hidden="true" /> Three.js room
        </span>
      </header>

      <main id="top" className="scene-shell">
        <SceneCanvas />
        <div className="scene-intro" aria-live="polite">
          <p className="eyebrow">Welcome to my space</p>
          <h1>An explorable portfolio, rebuilt in 3D.</h1>
          <p>The room is ready. Movement and interactive stories arrive next.</p>
        </div>
      </main>

      <footer className="scene-footer">
        <span>Bangkok, Thailand</span>
        <span className="footer-hint">Isometric preview · v2</span>
      </footer>
    </div>
  );
}
