"use client";

import { calculateDistance } from "@/helpers/calculateDistance";
import {
  formatDurationHms,
  getFuelMetrics,
  getIdlingTimeMs,
  getMarkerRotation,
  getTripDurationStats,
  getTruckRotationOffset,
  subscribeTruckRotation,
} from "@/helpers/validate";
import { useTracking } from "@/hooks/useTracking";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import Image from "next/image";
import { useEffect, useMemo, useSyncExternalStore } from "react";

function Polyline() {
  const map = useMap();
  const { trackPath } = useTracking();
  const mapsLibrary = useMapsLibrary("maps");
  const coreLibrary = useMapsLibrary("core");

  useEffect(() => {
    if (!map || !mapsLibrary || !coreLibrary || trackPath.length === 0) return;

    const polyline = new mapsLibrary.Polyline({
      path: trackPath,
      geodesic: true,
      strokeColor: "#008000",
      strokeOpacity: 1,
      strokeWeight: 5,
    });

    polyline.setMap(map);

    const bounds = new coreLibrary.LatLngBounds();
    trackPath.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds);

    return () => polyline.setMap(null);
  }, [map, mapsLibrary, coreLibrary, trackPath]);

  return null;
}

function MapContent() {
  const { trackPath, historyData, stoppages } = useTracking();
  const coreLibrary = useMapsLibrary("core");
  const geometryLibrary = useMapsLibrary("geometry");

  const distance = useMemo(() => {
    if (!coreLibrary || !geometryLibrary || trackPath.length < 2) return "0.00";
    return calculateDistance(trackPath, coreLibrary, geometryLibrary);
  }, [trackPath, coreLibrary, geometryLibrary]);

  const tripMetrics = useMemo(() => {
    if (historyData.length === 0) {
      return {
        kmpl: "0.00",
        defConsumed: "0.00",
        runningTime: "00:00:00",
        idlingTime: "00:00:00",
        haltTime: "00:00:00",
      };
    }

    const idlingTimeMs = getIdlingTimeMs(historyData);
    const { runningMs, idlingMs, haltMs } = getTripDurationStats(
      historyData,
      stoppages,
      idlingTimeMs,
    );
    const { kmpl, defConsumed } = getFuelMetrics(historyData);

    return {
      kmpl,
      defConsumed,
      runningTime: formatDurationHms(runningMs),
      idlingTime: formatDurationHms(idlingMs),
      haltTime: formatDurationHms(haltMs),
    };
  }, [historyData, stoppages]);

  const fuelConsumed = useMemo(() => {
    if (Number(distance) <= 0 || Number(tripMetrics.kmpl) <= 0) return "0.00";
    return (Number(distance) / Number(tripMetrics.kmpl)).toFixed(2);
  }, [distance, tripMetrics.kmpl]);

  const submitRotationOffset = useSyncExternalStore(
    subscribeTruckRotation,
    getTruckRotationOffset,
    getTruckRotationOffset,
  );

  const endTruckRotation = useMemo(
    () => getMarkerRotation(trackPath, historyData, submitRotationOffset),
    [trackPath, historyData, submitRotationOffset],
  );

  return (
    <>
      <Map
        {...{
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID",
        }}
        defaultCenter={{ lat: 28.6139, lng: 77.209 }}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="h-full w-full"
      >
        {trackPath.length > 0 && (
          <>
            <Marker position={trackPath[0]} title="Start" />
            <AdvancedMarker
              position={trackPath[trackPath.length - 1]}
              title="End"
            >
              <Image
                src="/04.png"
                width={48}
                height={48}
                alt=""
                style={{ transform: `rotate(${endTruckRotation}deg)` }}
              />
            </AdvancedMarker>
          </>
        )}
        <Polyline />
      </Map>

      <div className="absolute left-2 top-15 z-40 w-[172px] bg-white px-3 py-2.5 text-xs shadow-lg">
        <div className="flex flex-col gap-1.5">
          {[
            { label: "Distance", value: `${distance} km` },
            { label: "Fuel Consumed", value: `${fuelConsumed} ltr` },
            { label: "kmpl", value: tripMetrics.kmpl },
            { label: "DEF Consumed", value: `${tripMetrics.defConsumed} ltr` },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-left text-gray-800">{label}</span>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-px bg-gray-300" />
                <span className="min-w-[52px] text-right text-gray-800">
                  {value}
                </span>
              </div>
            </div>
          ))}

          <div className="py-0.5 text-center text-[10px] text-gray-500">
            Duration(hh:mm:ss)
          </div>

          {[
            { label: "Running Time", value: tripMetrics.runningTime },
            { label: "Idling Time", value: tripMetrics.idlingTime },
            { label: "Halt Time", value: tripMetrics.haltTime },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-left text-gray-800">{label}</span>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-px bg-gray-300" />
                <span className="min-w-[52px] text-right text-gray-800">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function MapPanel() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  return (
    <section className="relative h-[calc(100vh-260px)] w-full overflow-hidden border border-gray-200">
      <APIProvider
        apiKey={apiKey}
        libraries={["core", "maps", "geometry", "marker"]}
      >
        <MapContent />
      </APIProvider>
    </section>
  );
}
