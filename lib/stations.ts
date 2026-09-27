import { PORTFOLIO_STATIONS, type StationId } from "../data/portfolio";
import type { Point2D } from "./world";

export function findNearbyStation(position: Point2D, maximumDistance = 1.35): StationId | null {
  const station = PORTFOLIO_STATIONS.find(
    (candidate) =>
      Math.hypot(candidate.position.x - position.x, candidate.position.z - position.z) <= maximumDistance,
  );

  return station?.id ?? null;
}
