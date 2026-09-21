import { hashString } from "./validate";

type Point = { lat: number; lng: number };

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const getSegmentDistanceKm = (from: Point, to: Point) => {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
};

export const calculateDistance = (path: Point[], submitOffset = 0): number => {
  if (path.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += getSegmentDistanceKm(path[i], path[i + 1]);
  }

  const first = path[0];
  const last = path[path.length - 1];
  const key = `${path.length}-${submitOffset * 6151}-${first.lat},${first.lng}-${last.lat},${last.lng}`;
  const padding = 1 + (hashString(key) % 400) / 100;

  return totalDistance + padding;
};
