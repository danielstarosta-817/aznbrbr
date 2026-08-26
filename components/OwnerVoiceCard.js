"use client";

import { useState } from "react";

// The barber in their own words. Set large and in their own language first,
// because the register — blunt, funny, unmarketed — is a big part of why
// someone screenshots a profile and sends it to a friend.
export default function OwnerVoiceCard({ barber }) {
  const [showTranslation, setShowTranslation] = useState(true);
  const q = barber.ownerQuote;

  if (!q) {
    return (
      <div className="border-t border-rule pt-6">
        <div className="label mb-2">In their own words</div>
        <p className="text-sm text-muted-2">
          {barber.name} hasn&apos;t added anything yet — this is where a
          barber-submitted quote appears once operator accounts exist.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-rule pt-7">
      <div className="label mb-4">In their own words</div>
      <blockquote className="mb-3 font-display text-[26px] font-light italic leading-[1.35]">
        &ldquo;{showTranslation ? q.english : q.original}&rdquo;
      </blockquote>
      <div className="flex flex-wrap items-center gap-3">
        <span className="label-ink">{barber.shopName || barber.name}</span>
        <button
          onClick={() => setShowTranslation((v) => !v)}
          className="text-[10.5px] text-muted-2 underline transition-colors hover:text-ink"
        >
          {showTranslation
            ? `Translated from ${q.language} · see original`
            : "Show translation"}
        </button>
      </div>
    </div>
  );
}
