"use client";

import Link from "next/link";
import { getSplitScore, getTagPercent, getVouchLanguages } from "../lib/data";

// Deliberately minimal — name, the one headline number, and a way in. The full
// profile is one click away and shouldn't be duplicated here.
export default function DockedCard({ barber, activeTag }) {
  if (!barber) {
    return (
      <div className="border-t border-rule px-8 py-6">
        <div className="label">Select a shop to preview it</div>
      </div>
    );
  }

  const scores = getSplitScore(barber.id);
  const headline = getTagPercent(scores, activeTag) || getTagPercent(scores);
  const languages = getVouchLanguages(barber.id);

  return (
    <div className="border-t border-rule px-8 py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate font-display text-xl font-light">{barber.name}</div>
          <div className="label mt-1 truncate">{barber.neighborhood}</div>
        </div>
        {headline && (
          <div className="shrink-0 text-right">
            <div className="font-display text-[26px] font-light leading-none text-forest">
              {headline.percent}
              <span className="text-[13px]">%</span>
            </div>
            <div className="label mt-1">{headline.tag}</div>
          </div>
        )}
      </div>

      {languages.length > 0 && (
        <div className="label mt-3">Reviews in {languages.join(", ")}</div>
      )}

      <Link
        href={`/barber/${barber.id}`}
        className="label-ink mt-4 inline-block border-b border-ink pb-0.5"
      >
        View full profile →
      </Link>
    </div>
  );
}
