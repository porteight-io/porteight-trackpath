"use client";

import { calculateDistance } from "@/helpers/calculateDistance";
import {
  formatDurationHms,
  formatMeasure,
  formatReportedAt,
  getFuelMetrics,
  getIdlingTimeMs,
  getTripDurationStats,
  getTruckRotationOffset,
  subscribeTruckRotation,
} from "@/helpers/validate";
import { useTracking } from "@/hooks/useTracking";
import { useMemo, useSyncExternalStore } from "react";

const EMPTY_SUMMARY = {
  lastReported: "--",
  distance: "0 km",
  fuelConsumed: "0 ltr",
  mileage: "0.00",
  ureaConsumed: "0 ltr",
  runningTime: "00:00:00",
  idlingTime: "00:00:00",
  haltTime: "00:00:00",
};

export function useTripSummary() {
  const { trackPath, historyData, stoppages, truckData } = useTracking();

  const submitRotationOffset = useSyncExternalStore(
    subscribeTruckRotation,
    getTruckRotationOffset,
    getTruckRotationOffset,
  );

  return useMemo(() => {
    if (historyData.length === 0) return EMPTY_SUMMARY;

    const distanceKm = calculateDistance(trackPath, submitRotationOffset);

    const idlingTimeMs = getIdlingTimeMs(
      historyData,
      truckData?.truck_no,
      submitRotationOffset,
    );
    const { runningMs, idlingMs, haltMs } = getTripDurationStats(
      historyData,
      stoppages,
      idlingTimeMs,
    );
    const { kmpl, defConsumed } = getFuelMetrics(
      historyData,
      truckData?.truck_no,
      submitRotationOffset,
    );

    const fuelConsumed = Number(kmpl) > 0 ? distanceKm / Number(kmpl) : 0;

    return {
      lastReported: formatReportedAt(
        historyData[historyData.length - 1]?.timestamp,
      ),
      distance: `${formatMeasure(distanceKm)} km`,
      fuelConsumed: `${formatMeasure(fuelConsumed)} ltr`,
      mileage: kmpl,
      ureaConsumed: `${formatMeasure(Number(defConsumed))} ltr`,
      runningTime: formatDurationHms(runningMs),
      idlingTime: formatDurationHms(idlingMs),
      haltTime: formatDurationHms(haltMs),
    };
  }, [trackPath, historyData, stoppages, truckData?.truck_no, submitRotationOffset]);
}
