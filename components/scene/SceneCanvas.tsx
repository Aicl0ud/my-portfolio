import { Canvas } from "@react-three/fiber";

import { CameraRig } from "./CameraRig";
import { Player } from "./Player";
import { PortfolioRoom } from "./PortfolioRoom";

export default function SceneCanvas() {
  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      orthographic
      camera={{ position: [10, 11, 10], zoom: 58, near: 0.1, far: 100 }}
      shadows="basic"
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <color attach="background" args={["#15131b"]} />
      <fog attach="fog" args={["#15131b", 16, 30]} />
      <ambientLight intensity={1.7} />
      <directionalLight
        castShadow
        intensity={2.6}
        position={[6, 12, 7]}
        shadow-mapSize={[1024, 1024]}
      />
      <CameraRig />
      <PortfolioRoom />
      <Player />
    </Canvas>
  );
}
