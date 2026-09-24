"use client";

import { getLocationName } from "@/helpers/getLocation";
import { formatDurationHms, formatReportedAt } from "@/helpers/validate";
import { useTracking } from "@/hooks/useTracking";
import { useTripSummary } from "@/hooks/useTripSummary";
import { Info } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

const TABS = ["Summary", "Movements", "Events"] as const;
type Tab = (typeof TABS)[number];

/**
 * FleetManagerStyleTabs: the bar's background, and -- clipped to the glyphs --
 * the active label's colour. Same ramp as the header chips.
 */
const TAB_GRADIENT = "linear-gradient(to right, #00a071, #194d94)";

/**
 * summary-table__cell: 6px padding, 13px/19.5px type. The label column is not a
 * fixed width -- the table's auto layout shares surplus width between the two
 * columns by content, so the split tracks the card (~43% at 256px, ~39% at 376px).
 */
function Row({
  label,
  value,
  info,
}: {
  label: string;
  value: ReactNode;
  info?: boolean;
}) {
  return (
    <tr>
      {/* 40%: the reference measures ~39% of the card at this width. */}
      <td className="w-[40%] p-[6px] align-top">
        {/* A block <p>, not a flex row: a flex label cannot wrap, which forces
            the auto-layout column wider than the reference's. */}
        <p className="text-[13px] font-normal leading-[19.5px] tracking-[0.12194px] text-black">
          {label}
          {info && (
            <Info size={12} className="ml-1 inline-block align-middle text-slate-400" />
          )}
        </p>
      </td>
      <td className="p-[6px] text-left align-top">
        <p className="text-[13px] font-bold leading-[19.5px] tracking-[0.12194px] text-[rgba(0,0,0,0.87)]">
          {value}
        </p>
      </td>
    </tr>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="px-[10px] py-8 text-center text-[13px] text-slate-400">
      {message}
    </p>
  );
}

export default function SummaryPanel() {
  const { truckData, historyData, stoppages } = useTracking();
  const summary = useTripSummary();
  const [activeTab, setActiveTab] = useState<Tab>("Summary");
  const [resolvedLocation, setResolvedLocation] = useState<{
    key: string;
    name: string;
  } | null>(null);

  const lat = truckData?.lat;
  const lon = truckData?.lng;
  const locationKey = lat && lon ? `${lat},${lon}` : "";

  // Only show the resolved name while it still belongs to the current position.
  const location =
    resolvedLocation?.key === locationKey ? resolvedLocation.name : "";

  useEffect(() => {
    if (!locationKey) return;

    let cancelled = false;

    getLocationName(lat!, lon!)
      .then((name) => {
        if (!cancelled) setResolvedLocation({ key: locationKey, name });
      })
      .catch((error) => console.error("Error fetching location:", error));

    return () => {
      cancelled = true;
    };
  }, [locationKey, lat, lon]);

  const isRunning = truckData?.eventStatus?.toUpperCase() === "ON";

  const events = useMemo(() => {
    const changes: { timestamp: string; status: string }[] = [];
    let previous: string | undefined;

    for (const point of historyData) {
      const status = point.eventData_ignitionStatus?.toUpperCase();
      if (status && status !== previous) {
        changes.push({ timestamp: point.timestamp, status });
        previous = status;
      }
    }

    return changes;
  }, [historyData]);

  return (
    <aside className="m-[5px] flex h-[calc(100%-8px)] w-[28%] flex-none flex-col overflow-scroll rounded-[12px] bg-white shadow-[0_0_10px_#0000003d]">
      {/*
       * .type-switch-btn--centered centres a fixed 310px bar (3 x 100px buttons
       * plus 5px padding), so it overflows a narrow card rather than shrinking.
       */}
      <div className="flex shrink-0 justify-center">
        <div
          style={{ background: TAB_GRADIENT }}
          className="mb-[5px] mt-[6px] flex h-[32.5px] w-[310px] shrink-0 items-center justify-center rounded-[5px] p-[5px]"
        >
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-[100px] cursor-pointer rounded-[5px] text-[13px] font-medium leading-[19.5px] ${
                  active ? "bg-white" : "text-white"
                }`}
              >
                {/* The pill is on the button; the gradient is clipped to this span. */}
                <span
                  style={
                    active
                      ? {
                          backgroundImage: TAB_GRADIENT,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }
                      : undefined
                  }
                >
                  {tab}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* .vehicle-regn-status: 10px in from the top and left, 25px tall. */}
      <div className="ml-[10px] mt-[10px] flex h-[25px] shrink-0 items-center">
        <p className="text-[13px] font-bold leading-[19.5px] tracking-[0.12194px] text-[rgba(0,0,0,0.87)]">
          {truckData?.truck_no || "--"}
        </p>
        <p
          className={`ml-[10px] rounded-[6px] px-[8px] py-[2px] text-[14px] font-normal leading-[21px] text-white ${
            isRunning ? "bg-[#0a8f3c]" : "bg-[#d80303]"
          }`}
        >
          {isRunning ? "RUNNING" : "STOPPED"}
        </p>
      </div>

      <div className="flex-1">
        {activeTab === "Summary" && (
          <table className="w-full">
            <tbody>
              {/* The reference opens with an empty 12px spacer row. */}
              <tr>
                <td className="p-[6px]" />
                <td className="p-[6px]" />
              </tr>
              <Row label="Last Reported" value={summary.lastReported} />
              <Row label="Distance" value={summary.distance} />
              <Row label="Fuel Consumed" value={summary.fuelConsumed} />
              <Row label="Mileage" value={summary.mileage} />
              <Row label="Urea Consumed" value={summary.ureaConsumed} />
              <Row label="Running Time" value={summary.runningTime} info />
              <Row label="Idling Time" value={summary.idlingTime} info />
              <Row label="Halt Time" value={summary.haltTime} info />
              <Row label="Model" value={truckData?.model || "--"} />
              <Row label="Location" value={location || "--"} />
            </tbody>
          </table>
        )}

        {activeTab === "Movements" &&
          (stoppages.length === 0 ? (
            <EmptyState message="No halts recorded for this period." />
          ) : (
            <ul className="mt-[12px] px-[10px] text-[13px] leading-[19.5px]">
              {stoppages.map((stoppage) => (
                <li
                  key={stoppage.id}
                  className="border-b border-slate-100 py-[6px] last:border-b-0"
                >
                  <div className="flex items-center justify-between font-bold text-[rgba(0,0,0,0.87)]">
                    <span>Halt #{stoppage.id}</span>
                    <span>{formatDurationHms(stoppage.durationMs)}</span>
                  </div>
                  <p className="text-black">
                    {formatReportedAt(stoppage.startTime)} &rarr;{" "}
                    {formatReportedAt(stoppage.endTime)}
                  </p>
                </li>
              ))}
            </ul>
          ))}

        {activeTab === "Events" &&
          (events.length === 0 ? (
            <EmptyState message="No ignition events for this period." />
          ) : (
            <ul className="mt-[12px] px-[10px] text-[13px] leading-[19.5px]">
              {events.map((event) => (
                <li
                  key={`${event.timestamp}-${event.status}`}
                  className="flex items-center justify-between border-b border-slate-100 py-[6px] last:border-b-0"
                >
                  <span className="text-black">
                    {formatReportedAt(event.timestamp)}
                  </span>
                  <span
                    className={`font-bold ${
                      event.status === "ON" ? "text-[#0a8f3c]" : "text-[#d80303]"
                    }`}
                  >
                    Ignition {event.status}
                  </span>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </aside>
  );
}
