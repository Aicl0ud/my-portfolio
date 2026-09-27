import { ContactShadows, RoundedBox } from "@react-three/drei";

const WOOD = "#6f4939";
const DARK_WOOD = "#3f2b2a";
const CREAM = "#d9c8ac";

function Box({
  color,
  position,
  scale,
}: {
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

function Desk() {
  return (
    <group position={[0.5, 0, 0.6]}>
      <RoundedBox castShadow position={[0, 1.35, 0]} scale={[3.7, 0.3, 1.8]} radius={0.1}>
        <meshStandardMaterial color={WOOD} roughness={0.72} />
      </RoundedBox>
      {[-1.5, 1.5].flatMap((x) =>
        [-0.62, 0.62].map((z) => (
          <Box key={`${x}-${z}`} color={DARK_WOOD} position={[x, 0.65, z]} scale={[0.22, 1.3, 0.22]} />
        )),
      )}
      <Box color="#211f29" position={[0, 2.05, 0.05]} scale={[1.6, 1.05, 0.12]} />
      <Box color="#7ec7bb" position={[0, 2.05, -0.03]} scale={[1.38, 0.82, 0.04]} />
      <Box color="#24222c" position={[0, 1.55, 0.05]} scale={[0.18, 0.65, 0.18]} />
      <Box color="#24222c" position={[0, 1.45, 0.05]} scale={[0.8, 0.1, 0.5]} />
    </group>
  );
}

function Bookshelf() {
  const bookColors = ["#c8645a", "#e5b45d", "#5d8e8b", "#8a6eb0", "#cf8c55"];

  return (
    <group position={[4.7, 0, -3.35]}>
      <Box color={DARK_WOOD} position={[0, 1.65, 0]} scale={[3.1, 3.3, 0.55]} />
      {[0.7, 1.65, 2.6].map((y) => (
        <Box key={y} color={WOOD} position={[0, y, 0.34]} scale={[2.8, 0.13, 0.7]} />
      ))}
      {Array.from({ length: 14 }, (_, index) => {
        const row = index > 6 ? 1 : 0;
        const column = index % 7;
        return (
          <Box
            key={index}
            color={bookColors[index % bookColors.length]}
            position={[-1.15 + column * 0.38, 1 + row * 0.95, 0.48]}
            scale={[0.25, 0.62 + (index % 3) * 0.08, 0.28]}
          />
        );
      })}
    </group>
  );
}

function Bed() {
  return (
    <group position={[-4.35, 0, -2.9]}>
      <RoundedBox castShadow position={[0, 0.55, 0]} scale={[2.6, 0.65, 3.7]} radius={0.16}>
        <meshStandardMaterial color={DARK_WOOD} roughness={0.8} />
      </RoundedBox>
      <RoundedBox castShadow position={[0, 0.95, 0.25]} scale={[2.3, 0.35, 2.9]} radius={0.18}>
        <meshStandardMaterial color="#566aa8" roughness={0.9} />
      </RoundedBox>
      <RoundedBox castShadow position={[0, 1.18, -1]} scale={[2.1, 0.28, 0.75]} radius={0.18}>
        <meshStandardMaterial color={CREAM} roughness={1} />
      </RoundedBox>
    </group>
  );
}

function Plant() {
  return (
    <group position={[-4.8, 0, 3.5]}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.55, 0.4, 1, 8]} />
        <meshStandardMaterial color="#b7674a" roughness={0.9} />
      </mesh>
      {[-0.45, 0, 0.45].map((x, index) => (
        <mesh key={x} castShadow position={[x, 1.35 + index * 0.18, 0]} rotation={[0, 0, x * 0.8]}>
          <sphereGeometry args={[0.58, 8, 6]} />
          <meshStandardMaterial color={index === 1 ? "#5d8b63" : "#477353"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

export function PortfolioRoom() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 11]} />
        <meshStandardMaterial color="#705b48" roughness={0.95} />
      </mesh>

      <Box color="#bca98b" position={[0, 1.9, -5.35]} scale={[14, 3.8, 0.25]} />
      <Box color="#aa9478" position={[-6.85, 1.9, 0]} scale={[0.25, 3.8, 10.5]} />
      <Box color="#43352f" position={[0, 0.12, -5.12]} scale={[13.7, 0.24, 0.22]} />
      <Box color="#43352f" position={[-6.62, 0.12, 0]} scale={[0.22, 0.24, 10.2]} />

      <mesh receiveShadow position={[0.7, 0.025, 1.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.7, 4.1]} />
        <meshStandardMaterial color="#8f4f4f" roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0.7, 0.035, 1.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.45, 1.9, 4]} />
        <meshStandardMaterial color="#e2b86a" roughness={1} />
      </mesh>

      <Bed />
      <Desk />
      <Bookshelf />
      <Plant />

      <ContactShadows opacity={0.32} scale={18} blur={2.4} far={10} position={[0, 0.02, 0]} />
    </group>
  );
}
