"use client";

import Link from "next/link";
import { useHomeBarber } from "./HomeBarberContext";
import Abacus from "./Abacus";
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

      <div className="flex items-center gap-3">
        {headline ? (
          <>
            <div className="text-right">
              <div
                className={`font-display text-2xl font-light leading-none ${
                  headline.score < 3 ? "text-clay-2" : "text-forest"
                }`}
              >
                {headline.score.toFixed(1)}
              </div>
              <div className="label mt-1">{headline.tag}</div>
              {cautionCount > 0 && (
                <div className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.12em] text-clay-2">
                  {cautionCount} caution{cautionCount > 1 ? "s" : ""}
                </div>
              )}
            </div>
            <Abacus
              score={headline.score}
              tone={headline.score < 3 ? "weak" : "good"}
              height={38}
            />
          </>
        ) : (
          <div className="label">No vouches yet</div>
        )}
      </div>
    </div>
  );
}
