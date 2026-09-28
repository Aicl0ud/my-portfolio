import Head from "next/head";
import dynamic from "next/dynamic";

const PixiStage = dynamic(() => import("../components/game/PixiStage"), {
  ssr: false,
});

const Index = () => {
  return (
    <div className="site-shell">
      <Head>
        <title>Kiw — Software Engineer</title>
        <meta
          name="description"
          content="Explore Kiw's work and experience in a tiny pixel-art portfolio."
        />
        <link rel="canonical" href="https://aicl0ud.dev/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kiw — Software Engineer" />
        <meta
          property="og:description"
          content="Explore Kiw's work and experience in a tiny pixel-art portfolio."
        />
        <meta property="og:url" content="https://aicl0ud.dev/" />
        <meta name="twitter:card" content="summary" />
        <meta name="theme-color" content="#0b0d12" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <main>
        <h1 className="sr-only">Kiw&apos;s interactive software engineering portfolio</h1>
        <PixiStage />
      </main>
    </div>
  );
};

export default Index;
