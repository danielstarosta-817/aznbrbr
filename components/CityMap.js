"use client";

import { getMonogram, getMonogramColor } from "../lib/data";

// Placeholder for the real map (Google Maps JS, per the locked decision).
// Pins are laid out deterministically from the barber id, NOT geocoded — good
// enough to demonstrate the list ↔ docked-card interaction, and labelled as
// such so nobody mistakes it for real geography.
function pseudoPosition(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 37 + id.charCodeAt(i)) % 9973;
  }
  return { x: 12 + (hash % 76), y: 12 + ((hash >> 5) % 74) };
}

export default function CityMap({ barbers, selectedId, onSelect }) {
  return (
    <div className="relative h-[380px] overflow-hidden bg-forest">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 49%, #9DB3A8 49%, #9DB3A8 51%, transparent 51%), linear-gradient(90deg, transparent 49%, #9DB3A8 49%, #9DB3A8 51%, transparent 51%)",
          backgroundSize: "44px 44px",
        }}
      />
      {barbers.map((b) => {
        const { x, y } = pseudoPosition(b.id);
        const isSelected = b.id === selectedId;
        return (
          <button
            key={b.id}
            onClick={() => onSelect(b.id)}
            aria-label={b.name}
            className={`mono-avatar absolute -translate-x-1/2 -translate-y-1/2 transition-all ${
              isSelected
                ? "z-10 h-9 w-9 text-[12px] ring-2 ring-clay-2 ring-offset-2 ring-offset-forest"
                : "h-7 w-7 text-[10px] hover:scale-110"
            }`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: getMonogramColor(b.id),
            }}
          >
            {getMonogram(b.name)}
          </button>
        );
      })}
      <div className="absolute bottom-3 left-4 text-[9.5px] uppercase tracking-[0.1em] text-forest-3">
        Map placeholder — pins illustrative, not geocoded
      </div>
    </div>
  );
}
