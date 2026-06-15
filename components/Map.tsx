"use client";

import { calculateDistance } from "@/helpers/calculateDistance";
import { useTracking } from "@/hooks/useTracking";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useMemo } from "react";

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
  const { trackPath } = useTracking();
  const coreLibrary = useMapsLibrary("core");
  const geometryLibrary = useMapsLibrary("geometry");

  const distance = useMemo(() => {
    if (!coreLibrary || !geometryLibrary || trackPath.length < 2) return 0.0;
    return calculateDistance(trackPath, coreLibrary, geometryLibrary);
  }, [trackPath, coreLibrary, geometryLibrary]);

  const fuelConsumed = useMemo(() => {
    if (!coreLibrary || !geometryLibrary || trackPath.length < 2) return 0.0;
    // const distance: any = calculateDistance(trackPath, coreLibrary, geometryLibrary);
    const fuelEfficiency = 2.41;
    return (Number(distance) / fuelEfficiency).toFixed(2);
  }, [trackPath, coreLibrary, geometryLibrary, distance]);

  return (
    <>
      <Map
        defaultCenter={{ lat: 28.6139, lng: 77.209 }}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="h-full w-full"
      >
        {trackPath.length > 0 && (
          <>
            <Marker
              position={trackPath[0]}
              title="Start"
              icon={{
                path: "M 0,0 m -6,0 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0",
                scale: 1,
                fillColor: "#FF0000",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
            <Marker position={trackPath[trackPath.length - 1]} title="End" />
          </>
        )}
        <Polyline />
      </Map>

      {/* Stats overlay — distance now computed inside APIProvider context */}
      <div className="absolute left-2 top-15 z-40 w-43 text-xs overflow-hidden bg-white px-4 py-3 shadow-lg space-y-1">
  {[
    { label: "Distance", value: `${distance} km` },
    { label: "Fuel Consumed", value: `${fuelConsumed} ltr` },
    { label: "kmpl", value: "2.41" },
    { label: "DEF Consumed", value: "1.18 ltr" },
    { label: "Duration(hh:mm:ss)", value: "" },
    { label: "Running Time", value: "06:47:00" },
    { label: "Idling Time", value: "00:23:00" },
    { label: "Halt Time", value: "07:08:00" },
  ].map(({ label, value }) => (
    <div key={label} className="grid grid-cols-[1fr_auto] items-center text-xs text-nowrap">
      <span className={`pr-2 ${label !== "Duration(hh:mm:ss)" ? 'border-r-2 border-gray-300' : 'text-gray-500 text-center my-1'}`}>{label}</span>
      <span className="pl-2 text-right">{value}</span>
    </div>
  ))}
</div>
    </>
  );
}

export default function MapPanel() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  return (
    <section className="relative h-[calc(100vh-260px)] w-full overflow-hidden border border-gray-200">
      <APIProvider apiKey={apiKey} libraries={["core", "maps", "geometry"]}>
        <MapContent />
      </APIProvider>
    </section>
  );
}
