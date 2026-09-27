import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

import { PORTFOLIO_STATIONS, type PortfolioStation } from "../../data/portfolio";
import { useGameStore } from "../../store/game";

function StationMarker({ station }: { station: PortfolioStation }) {
  const group = useRef<Group>(null);
  const nearby = useGameStore((state) => state.nearbyStationId === station.id);
  const visited = useGameStore((state) => state.visitedStationIds.includes(station.id));

  useFrame(({ clock }) => {
    if (!group.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.4) * 0.06;
    const scale = nearby ? 1.16 : pulse;
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group} position={[station.position.x, 0, station.position.z]}>
      <mesh castShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.55, 0.68, 0.22, 6]} />
        <meshStandardMaterial color="#2a2330" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.27, 0.44, 24]} />
        <meshStandardMaterial
          color={visited ? "#f9f4e8" : station.color}
          emissive={station.color}
          emissiveIntensity={nearby ? 4 : 2.4}
        />
      </mesh>
      {nearby ? (
        <Html center position={[0, 1.15, 0]} distanceFactor={8}>
          <span className="station-label">{station.shortLabel}</span>
        </Html>
      ) : null}
    </group>
  );
}

export function InteractiveStations() {
  return PORTFOLIO_STATIONS.map((station) => <StationMarker key={station.id} station={station} />);
}
