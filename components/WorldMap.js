"use client";

import { LAND_DOTS, CITY_COORDS, MAP_W, MAP_H, project } from "../lib/worldmap";

// Dot-size encodes depth of data, so a thin city reads as thin rather than
// being quietly padded to look equal. Cities with zero vouches render hollow.
function markRadius(count) {
  if (count === 0) return 3;
  return 3.6 + Math.sqrt(count) * 1.3;
}

export default function WorldMap({ cities, counts, selectedSlug, onSelect }) {
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      width="100%"
      role="img"
      aria-label="World map showing the cities with vouched barbers"
      className="block"
    >
      <title>Cities with vouch data</title>
      {LAND_DOTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#3D5C50" />
      ))}
      {cities.map((city) => {
        const coords = CITY_COORDS[city.slug];
        if (!coords) return null;
        const { x, y } = project(coords[0], coords[1]);
        const count = counts[city.slug] || 0;
        const r = markRadius(count);
        const isSelected = city.slug === selectedSlug;
        return (
          <g
            key={city.slug}
            onClick={() => onSelect(city.slug)}
            className="cursor-pointer"
            role="button"
            aria-label={`${city.name}, ${count} vouched shops`}
          >
            <circle cx={x} cy={y} r="16" fill="transparent" />
            {isSelected && (
              <circle cx={x} cy={y} r={r + 6} fill="none" stroke="#C4653A" strokeWidth="1.1" />
            )}
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={count === 0 ? "#6E8479" : "#E8DCC8"}
            />
          </g>
        );
      })}
    </svg>
  );
}
