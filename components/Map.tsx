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
    if (!coreLibrary || !geometryLibrary || trackPath.length < 2) return "0.00";
    return calculateDistance(trackPath, coreLibrary, geometryLibrary);
  }, [trackPath, coreLibrary, geometryLibrary]);

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
        <div className="flex justify-between">
          <span>Distance</span> <span>{distance} km</span>
        </div>
        <div className="flex justify-between">
          <span>Fuel Consumed</span> <span>95.0 ltr</span>
        </div>
        <div className="flex justify-between">
          <span>kmpl</span> <span>2.41</span>
        </div>
        <div className="flex justify-between">
          <span>DEF Consumed</span> <span>5.5 ltr</span>
        </div>
        <div className="pt-2 text-xs text-slate-500">Duration(hh:mm:ss)</div>
        <div className="flex justify-between">
          <span>Running Time</span> <span>06:47:00</span>
        </div>
        <div className="flex justify-between">
          <span>Idling Time</span> <span>00:23:00</span>
        </div>
        <div className="flex justify-between">
          <span>Halt Time</span> <span>07:08:00</span>
        </div>
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