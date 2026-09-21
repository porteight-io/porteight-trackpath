import { HistoryData } from "@/interfaces/interface";
import { getSegmentDistanceKm } from "./calculateDistance";

export type PointStatus = "running" | "idling" | "stopped";

export const STATUS_COLORS: Record<PointStatus, string> = {
  running: "#16a34a",
  stopped: "#dc2626",
  idling: "#d97706",
};

/** A point moving less than this between two reports counts as idling, not running. */
const IDLING_MAX_KM = 0.02;

export type TrackDot = {
  key: string;
  lat: number;
  lng: number;
  status: PointStatus;
};

function getPointStatus(point: HistoryData, next?: HistoryData): PointStatus {
  if (point.eventData_ignitionStatus?.toUpperCase() === "OFF") return "stopped";
  if (!next) return "running";

  const travelled = getSegmentDistanceKm(
    { lat: Number(point.latitude), lng: Number(point.longitude) },
    { lat: Number(next.latitude), lng: Number(next.longitude) },
  );

  return travelled < IDLING_MAX_KM ? "idling" : "running";
}

/**
 * Thins the raw history down to a readable number of status dots so the route
 * stays legible at any zoom level instead of turning into a solid band.
 */
export function getTrackDots(points: HistoryData[], maxDots = 28): TrackDot[] {
  if (points.length < 3) return [];

  const inner = points.slice(1, -1);
  const step = Math.max(1, Math.ceil(inner.length / maxDots));
  const dots: TrackDot[] = [];

  for (let i = 0; i < inner.length; i += step) {
    const point = inner[i];
    const lat = Number(point.latitude);
    const lng = Number(point.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    dots.push({
      key: `${point.timestamp}-${i}`,
      lat,
      lng,
      status: getPointStatus(point, inner[i + 1]),
    });
  }

  return dots;
}
