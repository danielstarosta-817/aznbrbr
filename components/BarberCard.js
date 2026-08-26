"use client";

import Link from "next/link";
import { useHomeBarber } from "./HomeBarberContext";
import { getHomeBarberVouch, getSplitScore, getVouchLanguages } from "../lib/data";

export default function BarberCard({ barber, selected, onSelect }) {
  const { homeBarberId } = useHomeBarber();
  const scores = getSplitScore(barber.id);
  const languages = getVouchLanguages(barber.id);
  const homeBarberVouch = getHomeBarberVouch(barber.id, homeBarberId);
  const hasCaution = scores.some((s) => s.caution > 0);
  const topTag = scores[0];

  return (
    <div
      onClick={() => onSelect?.(barber.id)}
      className={`border rounded-lg p-4 bg-white cursor-pointer transition-colors ${
        selected ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-400"
      }`}
    >
      {homeBarberVouch && (
        <div className="mb-2 text-xs font-medium text-badge bg-badge/10 rounded px-2 py-1 inline-block">
          ✓ vouched for by your barber, {homeBarberVouch.voucherCity || "elsewhere"}
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            href={`/barber/${barber.id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium hover:underline"
          >
            {barber.name}
          </Link>
          <div className="text-sm text-neutral-500">{barber.neighborhood}</div>
        </div>
        {hasCaution && (
          <span className="chip bg-caution/10 text-caution border border-caution/20 whitespace-nowrap">
            has a caution
          </span>
        )}
      </div>

      {topTag && (
        <div className="mt-2 text-sm">
          <span className="font-medium">{topTag.tag}:</span>{" "}
          <span className="text-recommend">{topTag.recommend} recommend</span>
          {topTag.caution > 0 && <span className="text-caution"> · {topTag.caution} caution</span>}
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-1.5">
        {barber.hairTags.slice(0, 3).map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
        {languages.length > 0 && (
          <span className="chip bg-badge/10 text-badge">in {languages.join(", ")}</span>
        )}
      </div>
    </div>
  );
}
