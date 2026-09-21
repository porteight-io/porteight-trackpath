"use client";

import Logo from "./Logo";
import {
  AlertsIcon,
  ListIcon,
  MapIcon,
  MoreHorizIcon,
  QuickLinksIcon,
  ReportsIcon,
  TraceIcon,
  VehicleDashboardIcon,
} from "./NavIcons";

type NavItem = {
  label: string;
  icon: (props: { size?: number; className?: string }) => React.JSX.Element;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "QUICK LINKS", icon: QuickLinksIcon },
  { label: "MAP", icon: MapIcon },
  { label: "LIST", icon: ListIcon },
  { label: "Trace", icon: TraceIcon, active: true },
  { label: "Alerts", icon: AlertsIcon },
  { label: "Reports", icon: ReportsIcon },
  { label: "Vehicle Dashboard", icon: VehicleDashboardIcon },
];

const SIDEBAR_GRADIENT =
  "linear-gradient(rgb(0, 164, 111) 23%, rgb(5, 121, 138) 68%, rgb(18, 91, 147) 80%, rgb(26, 75, 149) 100%)";

export default function Sidebar() {
  return (
    <aside
      style={{
        backgroundImage: SIDEBAR_GRADIENT,
        margin: "8px 0px 7px",
        height: "calc(100vh - 14px)", // their 1rem == 14px
      }}
      className="z-[1302] flex w-[60px] shrink-0 flex-col items-center overflow-hidden rounded-r-[30px] bg-cover bg-no-repeat pb-9 text-white"
    >
      {/* 40px mark, 16px from the top and 10px clear of the nav, per the reference. */}
      <Logo className="mb-2.5 mt-4 shrink-0" />

      {/* MuiList-padding: 8px block padding, items stacked with no gap. */}
      <nav className="flex w-full flex-col items-center py-2">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-current={active ? "page" : undefined}
            /* 56.2422px is the reference item height, so it is also the pitch. */
            className="relative flex h-[56.2422px] w-full cursor-pointer select-none flex-col items-center justify-center transition-colors duration-150"
          >
            <Icon size={20} />
            {/* 9px/1.66 with 0.03333em tracking == the reference's computed
                14.94px line box and 0.29997px letter-spacing. */}
            <span className="mt-1 block max-w-[50px] truncate text-center text-[length:var(--font-size-extra-small)] font-normal leading-[1.66] tracking-[0.03333em]">
              {label}
            </span>
            {active && (
              <span className="absolute left-[56px] top-1/2 h-[43px] w-[2.82px] -translate-y-1/2 rounded-[12px] bg-white" />
            )}
          </button>
        ))}
      </nav>

      <button
        type="button"
        aria-label="Expand Menu"
        className="mt-auto cursor-pointer"
      >
        <MoreHorizIcon size={24} />
      </button>
    </aside>
  );
}
