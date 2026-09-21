"use client";

import FilterBar from "@/components/FilterTabs";
import MapPanel from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import SummaryPanel from "@/components/SummaryPanel";
import TopBar from "@/components/TopBar";

export default function HeroPage() {
  return (
    <main className="flex h-screen overflow-hidden bg-white">
      {/*
       * The header is fixed across the full viewport and the rail paints over
       * its left end, so it sits outside the content column and the column is
       * pushed down by the header's 54px instead.
       */}
      <TopBar />

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col pl-[11px] pt-[54px]">
        <FilterBar />

        {/* The map/summary container: flex row, padding 0, overflow hidden. */}
        <section className="flex min-h-0 flex-1 flex-row gap-[3px] overflow-hidden bg-white">
          <SummaryPanel />
          <MapPanel />
        </section>
      </div>
    </main>
  );
}
