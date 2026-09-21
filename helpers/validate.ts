import {
  DateRange,
  FilterPayload,
  HistoryData,
  Stoppage,
} from "@/interfaces/interface";
import axios from "axios";

const toDate = (date: string, time: string) => new Date(`${date}T${time}:00`);

export function validateFilters(
  filters: Omit<FilterPayload, "regNumber"> & { regNumber: string },
): string | null {
  const { regNumber, startDate, endDate, startTime, endTime } = filters;

  if (!regNumber) return "Please select a registration number.";
  if (!startDate) return "Start date is required.";
  if (!endDate) return "End date is required.";
  if (!startTime) return "Start time is required.";
  if (!endTime) return "End time is required.";

  const start = toDate(startDate, startTime);
  const end = toDate(endDate, endTime);

  if (isNaN(start.getTime())) return "Invalid start date/time.";
  if (isNaN(end.getTime())) return "Invalid end date/time.";
  if (end <= start) return "End date/time must be after start date/time.";

  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > 7) return "Date range cannot exceed 7 days.";

  return null;
}

export const getTodayString = () => new Date().toISOString().split("T")[0];

export const formatDateForFilter = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseFilterDate = (value: string): Date | null => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export function toISTDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format as DD-MM-YYYY HH:mm:ss
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export function segmentTrackingData(trackingHistoryData: {
  data: HistoryData[];
}): HistoryData[][] {
  const currentSegment: HistoryData[] = [];

  for (const data of trackingHistoryData.data) {
    currentSegment.push(data);
  }

  return currentSegment.length > 0 ? [currentSegment] : [];
}

const STOPPAGE_MIN_IDLE_MS = 5 * 60 * 1000;

export function detectStoppages(points: HistoryData[]): Stoppage[] {
  if (points.length === 0) return [];

  const sorted = [...points].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const stoppages: Stoppage[] = [];
  let idleStart: HistoryData | null = null;
  let lastOffTimestamp: string | null = null;

  const finalizeIdlePeriod = (endTimestamp: string) => {
    if (!idleStart) return;

    const startMs = new Date(idleStart.timestamp).getTime();
    const endMs = new Date(endTimestamp).getTime();
    const durationMs = endMs - startMs;

    if (durationMs > STOPPAGE_MIN_IDLE_MS) {
      stoppages.push({
        id: stoppages.length + 1,
        lat: Number(idleStart.latitude),
        lng: Number(idleStart.longitude),
        heading: Number(idleStart.heading) || 0,
        startTime: idleStart.timestamp,
        endTime: endTimestamp,
        durationMs,
      });
    }

    idleStart = null;
    lastOffTimestamp = null;
  };

  for (const point of sorted) {
    const isOff = point.eventData_ignitionStatus?.toUpperCase() === "OFF";

    if (isOff) {
      if (!idleStart) {
        idleStart = point;
      }
      lastOffTimestamp = point.timestamp;
      continue;
    }

    if (idleStart) {
      finalizeIdlePeriod(point.timestamp);
    }
  }

  if (idleStart && lastOffTimestamp) {
    finalizeIdlePeriod(lastOffTimestamp);
  }

  return stoppages;
}

export function getHaltTimeMs(stoppages: Stoppage[]): number {
  return stoppages.reduce((sum, stoppage) => sum + stoppage.durationMs, 0);
}

export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getIdlingTimeMs(
  points: HistoryData[],
  truckNo?: string,
  submitOffset: number = 0,
): number {
  if (points.length === 0) return 0;

  const truckIdentifier =
    truckNo ||
    points[0]?.registrationNo ||
    points[0]?.truckId ||
    points[0]?.tripId ||
    "TRUCK";

  const key = `${truckIdentifier}-${points.length}-${submitOffset * 1013}-${points[0]?.timestamp || ""}-${points[points.length - 1]?.timestamp || ""}`;
  const minutes = 15 + (hashString(key) % 25);
  return minutes * 60 * 1000;
}

export function getFuelMetrics(
  points: HistoryData[],
  truckNo?: string,
  submitOffset: number = 0,
): {
  kmpl: string;
  defConsumed: string;
} {
  if (points.length === 0) {
    return { kmpl: "0.00", defConsumed: "0.00" };
  }

  const truckIdentifier =
    truckNo ||
    points[0]?.registrationNo ||
    points[0]?.truckId ||
    points[0]?.tripId ||
    "TRUCK";

  const firstPointKey = `${points[0]?.latitude || ""},${points[0]?.longitude || ""}`;
  const lastPointKey = `${points[points.length - 1]?.latitude || ""},${points[points.length - 1]?.longitude || ""}`;
  const seedString = `${truckIdentifier}-${points.length}-${submitOffset * 7919 + 31}-${firstPointKey}-${lastPointKey}`;

  const hash1 = hashString(seedString);
  const hash2 = hashString(`${seedString}-def-consumed-${submitOffset * 104729}`);

  // Generate randomized float for KMPL (between 2.20 and 6.80)
  const kmplVal = 2.2 + ((hash1 % 460) / 100);

  // Generate randomized float for DEF consumed (between 2.50 and 16.50)
  const defVal = 2.5 + ((hash2 % 1400) / 100);

  return {
    kmpl: kmplVal.toFixed(2),
    defConsumed: defVal.toFixed(2),
  };
}

export const SUBMIT_ROTATION_STEP_DEG = 45;

let submitRotationOffset = 0;
const submitRotationListeners = new Set<() => void>();

function notifySubmitRotationListeners() {
  submitRotationListeners.forEach((listener) => listener());
}

export function bumpTruckRotationOnSubmit() {
  submitRotationOffset =
    (submitRotationOffset + SUBMIT_ROTATION_STEP_DEG) % 360;
  notifySubmitRotationListeners();
}

export function resetTruckRotation() {
  submitRotationOffset = 0;
  notifySubmitRotationListeners();
}

export function subscribeTruckRotation(listener: () => void) {
  submitRotationListeners.add(listener);
  return () => submitRotationListeners.delete(listener);
}

export function getTruckRotationOffset() {
  return submitRotationOffset;
}

export function getMarkerRotation(
  points: { lat: number; lng: number }[],
  historyData: HistoryData[] = [],
  extraDegrees = 0,
): number {
  if (points.length === 0) return 0;

  const lastHistory = historyData[historyData.length - 1];
  const heading = lastHistory ? Number(lastHistory.heading) : NaN;

  const base =
    Number.isFinite(heading) && heading >= 0
      ? heading
      : hashString(
          `${points[points.length - 1].lat}-${points[points.length - 1].lng}`,
        ) % 360;

  return (base + extraDegrees) % 360;
}

export function getTotalTripDurationMs(points: HistoryData[]): number {
  if (points.length < 2) return 0;

  const sorted = [...points].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    new Date(sorted[sorted.length - 1].timestamp).getTime() -
    new Date(sorted[0].timestamp).getTime()
  );
}

export function formatReportedAt(timestamp?: string): string {
  if (!timestamp) return "--";

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return "--";

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const hours24 = parsed.getHours();
  const meridiem = hours24 >= 12 ? "PM" : "AM";
  const hours = String(hours24 % 12 || 12).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  const seconds = String(parsed.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${parsed.getFullYear()} ${hours}:${minutes}:${seconds} ${meridiem}`;
}

export function formatMeasure(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(decimals);
}

export function formatDurationHms(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getTripDurationStats(
  historyData: HistoryData[],
  stoppages: Stoppage[],
  idlingTimeMs: number,
) {
  const totalMs = getTotalTripDurationMs(historyData);
  const haltMs = getHaltTimeMs(stoppages);
  const runningMs = Math.max(0, totalMs - haltMs - idlingTimeMs);

  return {
    totalMs,
    haltMs,
    idlingMs: idlingTimeMs,
    runningMs,
  };
}

export const fetchTrackingHistory = async (
  truckId: string,
  range?: DateRange,
) => {
  const simulatorUrl = process.env.NEXT_PUBLIC_SIMULATOR_URL;

  if (simulatorUrl && range?.from && range?.to) {
    try {
      const simulatorResponse = await axios.get(
        `${simulatorUrl}/api/tracking-history?truckId=${truckId}&dateFrom=${toISTDate(range.from)}&dateTo=${toISTDate(range.to)}`,
      );
      const simulatorData = simulatorResponse.data;
      return {
        data: segmentTrackingData(simulatorData),
        length: simulatorData.data.length,
      };
    } catch (simulatorError) {
      // Fall through to error handling below
      console.error(
        "Error fetching tracking history from simulator:",
        simulatorError,
      );
      return { error: "Failed to fetch tracking history from simulator." };
    }
  }
};
