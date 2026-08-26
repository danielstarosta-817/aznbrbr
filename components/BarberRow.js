"use client";

import Link from "next/link";
import { useHomeBarber } from "./HomeBarberContext";
import {
  getHomeBarberVouch,
  getSplitScore,
  getTagPercent,
  getMonogram,
  getMonogramColor,
} from "../lib/data";

export default function BarberRow({ barber, activeTag, selected, onSelect }) {
  const { homeBarberId } = useHomeBarber();
  const scores = getSplitScore(barber.id);
  const headline = getTagPercent(scores, activeTag) || getTagPercent(scores);
  const homeVouch = getHomeBarberVouch(barber.id, homeBarberId);
  const cautionCount = scores.reduce((n, s) => n + s.caution, 0);

  return (
    <div
      onClick={() => onSelect?.(barber.id)}
      className={`row cursor-pointer ${selected ? "bg-paper-2" : ""}`}
    >
      <div
        className="mono-avatar h-11 w-11 text-[15px]"
        style={{ backgroundColor: getMonogramColor(barber.id) }}
        aria-hidden="true"
      >
        {getMonogram(barber.name)}
      </div>

      <div className="min-w-0">
        {homeVouch && (
          <div className="mb-1 text-[9.5px] font-medium uppercase tracking-label text-clay">
            Vouched by your barber
          </div>
        )}
        <Link
          href={`/barber/${barber.id}`}
          onClick={(e) => e.stopPropagation()}
          className="block truncate font-display text-[19px] font-light hover:underline"
        >
          {barber.name}
        </Link>
        <div className="label mt-1 truncate">{barber.neighborhood}</div>
      </div>

      <div className="text-right">
        {headline ? (
          <>
            <div className="font-display text-2xl font-light text-forest">
              {headline.percent}
              <span className="text-[13px]">%</span>
            </div>
            <div className="label mt-0.5">{headline.tag}</div>
          </>
        ) : (
          <div className="label">No vouches yet</div>
        )}
        {cautionCount > 0 && (
          <div className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.12em] text-clay-2">
            {cautionCount} caution{cautionCount > 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
