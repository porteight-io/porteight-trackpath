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
       * pushed down past it instead -- the header's 54px plus 4px of padding
       * below it.
       */}
      <TopBar />

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col pl-[11px] pt-[58px]">
        <FilterBar />

        {/* The map/summary container: a flex row with no margin or padding of its
            own and overflow hidden on both axes -- each panel carries its own
            gap. */}
        <section className="m-0 flex min-h-0 flex-1 flex-row overflow-hidden bg-white px-0 pb-[10px] pt-0 text-[14px] font-normal leading-[21px] tracking-[0.13132px] text-black/87">
          <SummaryPanel />
          <MapPanel />
        </section>
      </div>
    </main>
  );
}
