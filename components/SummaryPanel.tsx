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
 * summary-table__cell: 16px padding, 14px/21px type. The value column is not a
 * fixed width -- the table's auto layout shares surplus width between the two
 * columns by content, so the split tracks the card.
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
      {/* 112.637px less 32px of padding leaves ~81px, so the two-word labels
          wrap -- which is what the reference's 74.8px row height reflects. */}
      <td className="h-[74.8px] w-[112.637px] min-w-[110px] border-b-[0.8px] border-b-[#e0e0e0] p-[16px] text-left align-middle text-[12.25px] font-normal leading-[17.5175px] tracking-[0.131197px]">
        {/* A block <p>, not a flex row, so the info icon trails the text
            inline rather than being pushed to the cell's far edge. */}
        <p className="text-[14px] font-normal leading-[21px] tracking-[0.12194px] text-[rgba(0,0,0,0.6)]">
          {label}
          {info && (
            <Info size={12} className="ml-1 inline-block align-middle text-slate-400" />
          )}
        </p>
      </td>
      <td className="w-[137.8px] border-b border-slate-200 p-[16px] text-left align-top">
        <p className="text-[14px] font-normal leading-[21px] tracking-[0.12194px] text-[rgba(0,0,0,0.87)]">
          {value}
        </p>
      </td>
      {/* Carries the rule across the slack the two pinned columns leave. */}
      <td className="border-b border-slate-200" />
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
    <aside className="pipe-scrollbar m-[5px] flex h-[calc(100%-10px)] w-[calc(25%+40px)] flex-none flex-col overflow-y-auto overflow-x-hidden rounded-[4px] rounded-tl-[12px] rounded-tr-[5px] bg-white p-0 text-[14px] font-normal leading-[21px] tracking-[0.13132px] text-black/87 shadow-no-right">
      {/*
       * .type-switch-btn--centered centres a fixed 310px bar (3 x 100px buttons
       * plus 5px padding), so it overflows a narrow card rather than shrinking.
       */}
      <div className="flex shrink-0 justify-center">
        <div
          style={{ background: TAB_GRADIENT }}
          className="mb-0 mt-[6px] flex h-[32.5px] w-[310px] shrink-0 items-center justify-center rounded-[5px] p-[5px]"
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

      {/* .vehicle-regn-status: 10px in from the top and left. */}
      <div className="ml-[10px] mt-[10px] flex h-[35px] w-[240.44px] shrink-0 items-center">
        <p className="text-[14px] font-normal leading-[21px] tracking-[0.12194px] text-[rgba(0,0,0,0.87)]">
          {truckData?.truck_no || "--"}
        </p>
        <p
          className={`ml-0 rounded-[6px] px-[8px] py-[2px] text-[14px] font-normal leading-[21px] text-white ${
            isRunning ? "bg-[#0a8f3c]" : "bg-[#d80303]"
          }`}
        >
          {isRunning ? "RUNNING" : "STOPPED"}
        </p>
      </div>

      <div className="flex-1">
        {activeTab === "Summary" && (
          <table className="mt-[26px] w-[500px] table-fixed border-collapse border-y border-slate-200">
            <tbody>
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
              {/* Mirrors the top spacer, so the closing rule sits 16px clear of
                  the last value. */}
              <tr>
                <td className="p-[8px]" />
                <td className="p-[8px]" />
                <td className="p-[8px]" />
              </tr>
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
