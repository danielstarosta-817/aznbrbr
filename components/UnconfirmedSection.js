"use client";

import { useState } from "react";

// Locked decision: Places-backbone listings with no vouches yet stay out of the
// main feed. Keeping them in their own section is what protects the feed's
// trust signal — everything above the fold has actually been vouched for.
export default function UnconfirmedSection({ barbers }) {
  const [open, setOpen] = useState(false);
  if (!barbers || barbers.length === 0) return null;

  return (
    <section className="border-t border-rule px-8 py-7">
      <button onClick={() => setOpen((v) => !v)} className="label transition-colors hover:text-ink">
        {open ? "−" : "+"} Help us confirm these — {barbers.length} nearby
        listing{barbers.length === 1 ? "" : "s"}, no vouches yet
      </button>

      {open && (
        <div className="mt-5 max-w-[620px]">
          {barbers.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between gap-4 border-t border-rule py-3"
            >
              <div className="min-w-0">
                <div className="truncate font-display text-[17px] font-light">{b.name}</div>
                <div className="label mt-0.5 truncate">{b.neighborhood}</div>
              </div>
              <button className="label shrink-0 border-b border-muted-2 pb-0.5 transition-colors hover:text-ink">
                I&apos;ve been here
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
