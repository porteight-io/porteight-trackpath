import { HistoryData } from "@/interfaces/interface";
import { getSegmentDistanceKm } from "./calculateDistance";

export type PointStatus = "running" | "idling" | "stopped";

export const STATUS_COLORS: Record<PointStatus, string> = {
  running: "#1fc21f",
  stopped: "#e01010",
  idling: "#f59e0b",
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

/** iAlert's own status marker artwork, used by the legend pills. */
export function getStatusMarkerUrl(status: PointStatus): string {
  return `https://ialert.ashokleyland.com/images/markers/${status.toUpperCase()}/3.svg`;
}

/**
 * One status dot per reported point along the route. Very long histories are
 * thinned to `maxDots` so the map stays responsive.
 */
export function getTrackDots(
  points: HistoryData[],
  maxDots = 1500,
): TrackDot[] {
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
