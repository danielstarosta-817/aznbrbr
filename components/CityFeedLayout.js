"use client";

import { useState } from "react";
import BarberRow from "./BarberRow";
import CityMap from "./CityMap";
import DockedCard from "./DockedCard";

// Feed-first, map secondary. Desktop keeps the list and map side by side
// (the Airbnb/Yelp pattern the spec asked for); the map column sticks so it
// stays in view while the list scrolls.
export default function CityFeedLayout({ barbers, activeTag }) {
  const [selectedId, setSelectedId] = useState(null);
  const [mobileView, setMobileView] = useState("list");
  const selected = barbers.find((b) => b.id === selectedId) || null;

  return (
    <div>
      <div className="flex gap-6 border-b border-rule px-8 py-3 lg:hidden">
        {["list", "map"].map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`label ${mobileView === v ? "text-ink underline" : ""}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        <div className={`lg:border-r lg:border-rule ${mobileView === "map" ? "hidden lg:block" : ""}`}>
          {barbers.map((b) => (
            <BarberRow
              key={b.id}
              barber={b}
              activeTag={activeTag}
              selected={b.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>

        <div className={mobileView === "list" ? "hidden lg:block" : ""}>
          <div className="lg:sticky lg:top-0">
            <CityMap
              barbers={barbers}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <DockedCard barber={selected} activeTag={activeTag} />
          </div>
        </div>
      </div>
    </div>
  );
}
