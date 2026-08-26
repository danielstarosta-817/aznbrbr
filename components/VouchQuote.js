"use client";

import { useState } from "react";
import { getMonogram, getMonogramColor } from "../lib/data";

// Stand-in translations so the autotranslate / see-original pattern (same as
// X/Twitter) is demonstrable. A real build calls a translation API.
const STUB_TRANSLATIONS = {
  "Enfin un salon qui sait couper des cheveux asiatiques épais sans tout arracher.":
    "Finally a salon that knows how to cut thick hair without hacking at it.",
  "On m'a coupé les cheveux comme je le voulais, sans avoir à tout expliquer trois fois.":
    "They cut my hair exactly how I wanted, without me having to explain it three times.",
  "Endlich jemand, der wirklich weiß, wie man asiatisches Haar schneidet.":
    "Finally someone who actually knows how to cut hair like mine.",
  "Kein Aufpreis, keine Ausreden — einfach ein guter Schnitt für dickes Haar.":
    "No upcharge, no excuses — just a good cut for thick hair.",
};

export default function VouchQuote({ vouch }) {
  const [showOriginal, setShowOriginal] = useState(false);
  const isNonEnglish = vouch.language && vouch.language !== "English";
  const translation = STUB_TRANSLATIONS[vouch.quote];
  const canToggle = isNonEnglish && Boolean(translation);
  const displayText = canToggle && !showOriginal ? translation : vouch.quote;

  const isOperator = vouch.voucherType === "operator";
  const name = isOperator ? vouch.voucherName || "A barber" : vouch.voucherId;

  return (
    <div className="grid grid-cols-[auto_1fr] gap-4">
      <div
        className="mono-avatar h-[38px] w-[38px] text-[13px]"
        style={{ backgroundColor: getMonogramColor(vouch.id) }}
        aria-hidden="true"
      >
        {getMonogram(name)}
      </div>

      <div>
        <p className="mb-2.5 font-display text-xl font-light leading-[1.45]">
          &ldquo;{displayText}&rdquo;
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="label-ink">{name}</span>
          {isOperator && (
            <span className="bg-forest px-2 py-0.5 text-[9.5px] uppercase tracking-[0.1em] text-paper">
              Barber{vouch.voucherCity ? ` in ${vouch.voucherCity}` : ""}
            </span>
          )}
          {vouch.identityBadge && (
            <span className="bg-ink px-2 py-0.5 text-[9.5px] uppercase tracking-[0.1em] text-paper">
              Vouching as Asian
            </span>
          )}
          <span className="label">{vouch.tag}</span>
          {canToggle && (
            <button
              onClick={() => setShowOriginal((v) => !v)}
              className="text-[10.5px] text-muted-2 underline transition-colors hover:text-ink"
            >
              {showOriginal
                ? "Show translation"
                : `Autotranslated from ${vouch.language} · see original`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
