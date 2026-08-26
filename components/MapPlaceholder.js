"use client";

// Lightweight stand-in for a real map (Google Maps JS, per the locked decision)
// so the list<->docked-card interaction pattern is demonstrable without a live
// API key or tile provider wired up yet.
function pseudoPosition(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 10000;
  const x = 8 + (hash % 84);
  const y = 8 + ((hash >> 4) % 84);
  return { x, y };
}

export default function MapPlaceholder({ barbers, selectedId, onSelect }) {
  return (
    <div className="relative w-full h-64 lg:h-full min-h-64 rounded-lg bg-[#e8ece6] border border-neutral-200 overflow-hidden">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(0deg,transparent_24%,rgba(0,0,0,.04)_25%,rgba(0,0,0,.04)_26%,transparent_27%,transparent_74%,rgba(0,0,0,.04)_75%,rgba(0,0,0,.04)_76%,transparent_77%),linear-gradient(90deg,transparent_24%,rgba(0,0,0,.04)_25%,rgba(0,0,0,.04)_26%,transparent_27%,transparent_74%,rgba(0,0,0,.04)_75%,rgba(0,0,0,.04)_76%,transparent_77%)] [background-size:20px_20px]" />
      {barbers.map((b) => {
        const { x, y } = pseudoPosition(b.id);
        const isSelected = b.id === selectedId;
        return (
          <button
            key={b.id}
            onClick={() => onSelect(b.id)}
            title={b.name}
            className={`absolute -translate-x-1/2 -translate-y-full rounded-full border-2 transition-transform ${
              isSelected
                ? "w-4 h-4 bg-recommend border-white scale-125 z-10"
                : "w-3 h-3 bg-neutral-700 border-white hover:scale-110"
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        );
      })}
      <div className="absolute bottom-2 left-2 text-[11px] text-neutral-500 bg-white/70 rounded px-1.5 py-0.5">
        map placeholder — pins are illustrative, not geocoded
      </div>
    </div>
  );
}
