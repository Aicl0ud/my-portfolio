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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="sr-only">Kiw&apos;s interactive software engineering portfolio</h1>
        <PixiStage />
      </main>
    </div>
  );
};

export default Index;
