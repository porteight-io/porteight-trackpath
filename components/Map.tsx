"use client";

import {
  getStatusMarkerUrl,
  getTrackDots,
  PointStatus,
  STATUS_COLORS,
} from "@/helpers/trackPoints";
import { useTracking } from "@/hooks/useTracking";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Menu } from "lucide-react";
import { FullscreenCornersIcon, PlaybackIcon } from "./HeaderIcons";
import { useEffect, useMemo, useRef, useState } from "react";

const BRAND_GRADIENT = "linear-gradient(to right, #00a071, #194d94)";
const START_GREEN = "#00D770";
const END_RED = "#D70000";

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

/** Start / end map pin: solid teardrop with a white disc and the letter inside. */
function PinMarker({ letter, color }: { letter: string; color: string }) {
  return (
    <svg
      width="34"
      height="44"
      viewBox="0 0 34 44"
      aria-hidden="true"
      className="block"
    >
      <path
        d="M17 0C7.611 0 0 7.611 0 17c0 7.5 10.5 20.5 15.2 25.9a2.4 2.4 0 0 0 3.6 0C23.5 37.5 34 24.5 34 17 34 7.611 26.389 0 17 0Z"
        fill={color}
      />
      <circle cx="17" cy="17" r="10.5" fill="#ffffff" />
      <text
        x="17"
        y="17.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="16"
        fontWeight="700"
      >
        {letter}
      </text>
    </svg>
  );
}

function LegendPill({
  status,
  label,
  color,
  active,
  onToggle,
}: {
  status: PointStatus;
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
        src={getStatusMarkerUrl(status)}
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
              title="Start"
              zIndex={2}
            >
              <PinMarker letter="S" color={START_GREEN} />
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
              title="End"
              zIndex={2}
            >
              <PinMarker letter="E" color={END_RED} />
            </AdvancedMarker>
          </>
        )}
        <Polyline />
      </Map>

      <div className="map-type-toggle absolute left-2 top-[6px] z-10 flex">
        {(["roadmap", "satellite"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setMapType(type)}
            className={`transition-colors ${mapType === type ? "bg-white" : ""}`}
          >
            {type === "roadmap" ? "Map" : "Satellite"}
          </button>
        ))}
      </div>

      <div className="map-legend absolute left-4 top-[76px] z-10 flex flex-col items-start gap-4">
        {LEGEND.map(({ status, label }) => (
          <LegendPill
            key={status}
            status={status}
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

      <div className="absolute right-[2px] top-[6px] z-10 flex items-start gap-4">
        <button
          type="button"
          onClick={() => alert("Play!")}
          className="flex h-[44px] w-[110px] cursor-pointer items-center justify-between rounded-[10px] bg-white p-[10px] shadow-md"
        >
          <span className="text-[15px] font-semibold text-slate-700">
            Playback
          </span>
          <span
            style={{ background: BRAND_GRADIENT }}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
          >
            <PlaybackIcon
              size={24}
              className="shrink-0 cursor-pointer select-none overflow-hidden align-middle text-white transition-[fill] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
            />
          </span>
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          title="Toggle fullscreen"
          className="grid h-[40px] w-[40px] cursor-pointer place-items-center rounded-[2px] border-0 bg-white shadow-[0_1px_4px_-1px_rgba(0,0,0,0.3)]"
        >
          <FullscreenCornersIcon size={20} className="text-slate-700" />
        </button>
      </div>

      <button
        type="button"
        style={{ background: BRAND_GRADIENT }}
        className="absolute right-0 top-1/2 z-10 grid h-[50px] w-[50px] -translate-y-1/2 cursor-pointer place-items-center rounded-full px-[10.5px] py-[5.25px] shadow-xl"
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
    <section className="map-surface relative mb-[6px] mr-[25px] mt-0 h-[calc(100%-6px)] min-w-0 flex-1 overflow-hidden rounded-[8px] border border-[#e5e5e5] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
      <APIProvider
        apiKey={apiKey}
        libraries={["core", "maps", "geometry", "marker"]}
      >
        <MapContent />
      </APIProvider>
    </section>
  );
}
