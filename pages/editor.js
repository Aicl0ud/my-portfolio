import dynamic from "next/dynamic";
import Head from "next/head";

const MapEditor = dynamic(() => import("../components/editor/MapEditor"), { ssr: false });

export default function EditorPage() {
  return (
    <>
      <Head>
        <title>Map editor — Kiw&apos;s portfolio</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <MapEditor />
    </>
  );
}
