"use client";

import FilterBar from "@/components/FilterTabs";
import MapPanel from "@/components/Map";
import UpperNavbar from "@/components/UpperNavbar";
import VehicleInfo from "@/components/VehilcleInfo";

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