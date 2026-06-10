"use client";

import FilterBar from "../FilterTabs";
import MapPanel from "../Map";
import UpperNavbar from "../UpperNavbar";
import VehicleInfo from "../VehilcleInfo";

export default function HeroPage() {
  return (
    <main className="min-h-screen bg-[#f4f6fb]">
      <UpperNavbar />

      <section className="flex flex-col">
        <VehicleInfo />
        <FilterBar />
        <MapPanel />
      </section>
    </main>
  );
}