"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WorldMap from "./WorldMap";

export default function LandingExplorer({ cities, counts, hairTags }) {
  const router = useRouter();
  const [citySlug, setCitySlug] = useState("seattle");
  const [hairTag, setHairTag] = useState(hairTags[0] || "Asian hair");

  const selectedCity = cities.find((c) => c.slug === citySlug);
  const selectedCount = counts[citySlug] || 0;

  function explore() {
    const params = new URLSearchParams();
    if (hairTag) params.set("tag", hairTag);
    router.push(`/city/${citySlug}?${params.toString()}`);
  }

  return (
    <>
      <section className="px-8 pb-9 pt-12">
        <h1 className="mb-4 max-w-[520px] font-display text-[52px] font-light leading-[1.0] tracking-[-0.02em]">
          Find a barber who already knows your hair.
        </h1>
        <p className="mb-10 max-w-[420px] text-sm leading-[1.65] text-muted">
          Vouched for by people with the same hair type — and by the barber you
          already trust back home.
        </p>

        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[1.1fr_1.1fr_0.9fr_auto]">
          <div className="field">
            <div className="label mb-2">City</div>
            <select value={citySlug} onChange={(e) => setCitySlug(e.target.value)}>
              {cities.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <div className="label mb-2">Hair type</div>
            <select value={hairTag} onChange={(e) => setHairTag(e.target.value)}>
              {hairTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Deliberately inert — we have no price data yet. Shown so the
              intended UX is legible, labelled so it isn't mistaken for broken. */}
          <div className="field opacity-40">
            <div className="label mb-2">Budget — soon</div>
            <select disabled>
              <option>Any</option>
            </select>
          </div>

          <button onClick={explore} className="btn-primary">
            Explore
          </button>
        </div>

        <div className="label mt-3 text-[9.5px]">
          Budget filter arrives once price data is collected — not active yet
        </div>
      </section>

      <section className="bg-forest px-8 pb-7 pt-8">
        <div className="mb-5 flex items-baseline justify-between">
          <span className="text-[10px] font-medium uppercase tracking-label text-forest-3">
            Where we have signal
          </span>
          <span className="font-display text-xl font-light text-paper">
            {selectedCity?.name} —{" "}
            {selectedCount === 0 ? "no vouches yet" : `${selectedCount} shops`}
          </span>
        </div>

        <WorldMap
          cities={cities}
          counts={counts}
          selectedSlug={citySlug}
          onSelect={setCitySlug}
        />

        <div className="mt-4 text-[10px] uppercase tracking-[0.1em] text-forest-3/80">
          Select a city · larger mark means deeper data
        </div>
      </section>
    </>
  );
}
