"use client";

import { getTrackDots, PointStatus, STATUS_COLORS } from "@/helpers/trackPoints";
import { useTracking } from "@/hooks/useTracking";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Maximize2, Menu, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const LEGEND: { status: PointStatus; label: string }[] = [
  { status: "running", label: "Running" },
  { status: "stopped", label: "Stopped" },
  { status: "idling", label: "Idling" },
];

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
      strokeColor: "#1e77e8",
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

function PinMarker({ color, letter }: { color: string; letter: string }) {
  return (
    <div className="relative h-[42px] w-[31px]">
      <svg viewBox="0 0 24 33" className="h-full w-full drop-shadow-md">
        <path
          d="M12 0C5.373 0 0 5.373 0 12c0 8.4 12 21 12 21s12-12.6 12-21c0-6.627-5.373-12-12-12z"
          fill={color}
        />
      </svg>
      <span className="absolute inset-x-0 top-[5px] text-center text-[14px] font-bold leading-none text-white">
        {letter}
      </span>
    </div>
  );
}

function LegendPill({
  label,
  color,
  active,
  onToggle,
}: {
  label: string;
  color: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{ borderColor: color }}
      className={`flex h-[35px] w-[120px] min-w-[120px] cursor-pointer items-center gap-1 rounded-[10px] border-2 bg-white py-1.5 pl-2 pr-2 shadow-md transition-opacity ${
        active ? "opacity-100" : "opacity-45"
      }`}
    >
      <img
        src={`https://ialert.ashokleyland.com/images/markers/${label.toUpperCase()}/3.svg`}
        alt=""
        className="h-5 w-6 shrink-0 object-contain"
      />
      <span className="whitespace-nowrap text-[12px] font-semibold text-slate-800">{label}</span>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`visible z-10 ${label === "Idling" ? "ml-5" : "ml-2"} block h-[22px] w-[22px] shrink-0 opacity-100`}
        style={{ fill: color }}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z" />
      </svg>
    </button>
  );
}

function MapContent() {
  const { trackPath, historyData } = useTracking();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [visibleStatuses, setVisibleStatuses] = useState<
    Record<PointStatus, boolean>
  >({
    running: true,
    stopped: true,
    idling: true,
  });

  const dots = useMemo(() => getTrackDots(historyData), [historyData]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    wrapperRef.current?.requestFullscreen();
  };

  return (
    <div ref={wrapperRef} className="relative h-full w-full bg-white">
      <Map
        {...{
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID",
        }}
        defaultCenter={{ lat: 28.6139, lng: 77.209 }}
        defaultZoom={15}
        mapTypeId={mapType}
        gestureHandling="greedy"
        mapTypeControl={false}
        fullscreenControl={false}
        zoomControl={false}
        className="h-full w-full"
      >
        {trackPath.length > 0 && (
          <>
            <AdvancedMarker
              position={trackPath[0]}
              title="Start"            >
              <PinMarker color="#1a9e6b" letter="S" />
            </AdvancedMarker>

            {dots
              .filter((dot) => visibleStatuses[dot.status])
              .map((dot) => (
                <AdvancedMarker
                  key={dot.key}
                  position={{ lat: dot.lat, lng: dot.lng }}
                  anchorTop="-50%"
                >
                  <span
                    className="block h-[11px] w-[11px] rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[dot.status] }}
                  />
                </AdvancedMarker>
              ))}

            <AdvancedMarker
              position={trackPath[trackPath.length - 1]}
              title="End"            >
              <PinMarker color="#e0393e" letter="E" />
            </AdvancedMarker>
          </>
        )}
        <Polyline />
      </Map>

      <div className="map-type-toggle absolute left-2 top-4 z-10 flex rounded-lg bg-[#eef0f3] p-1 shadow-md">
        {(["roadmap", "satellite"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setMapType(type)}
            className={`cursor-pointer rounded-md px-6 py-2 text-[15px] transition-colors ${
              mapType === type
                ? "bg-white font-semibold text-slate-900 shadow-sm"
                : "text-slate-600"
            }`}
          >
            {type === "roadmap" ? "Map" : "Satellite"}
          </button>
        ))}
      </div>

      <div className="map-legend absolute left-4 top-[76px] z-10 flex flex-col items-start gap-3">
        {LEGEND.map(({ status, label }) => (
          <LegendPill
            key={status}
            label={label}
            color={STATUS_COLORS[status]}
            active={visibleStatuses[status]}
            onToggle={() =>
              setVisibleStatuses((prev) => ({
                ...prev,
                [status]: !prev[status],
              }))
            }
          />
        ))}
      </div>

      <div className="absolute right-4 top-4 z-10 flex items-center gap-4">
        <button
          type="button"
          onClick={() => alert("Play!")}
          className="flex cursor-pointer items-center gap-3 rounded-[10px] bg-white py-1.5 pl-5 pr-1.5 shadow-md"
        >
          <span className="text-[15px] font-semibold text-slate-700">
            Playback
          </span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1a9e6b]">
            <Play size={14} fill="#ffffff" className="translate-x-px text-white" />
          </span>
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          title="Toggle fullscreen"
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-md bg-white shadow-md"
        >
          <Maximize2 size={20} className="text-slate-700" strokeWidth={1.8} />
        </button>
      </div>

      <button
        type="button"
        className="absolute right-5 top-1/2 z-10 grid h-14 w-14 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[#0e7c57] shadow-xl"
        title="Map options"
      >
        <Menu size={24} className="text-white" />
      </button>
    </div>
  );
}

export default function MapPanel() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  return (
    <section className="relative mb-[10px] mr-[5px] mt-[2px] h-[calc(100%-15px)] min-w-0 flex-1 overflow-hidden rounded-[12px]">
      <APIProvider
        apiKey={apiKey}
        libraries={["core", "maps", "geometry", "marker"]}
      >
        <MapContent />
      </APIProvider>
    </section>
  );
}
