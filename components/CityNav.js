"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import HomeBarberPicker from "./HomeBarberPicker";

export default function CityNav({ cities, allBarbers }) {
  const pathname = usePathname();
  const router = useRouter();
  const [missingCity, setMissingCity] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentSlug = pathname?.startsWith("/city/") ? pathname.split("/")[2] : null;

  function handleCityChange(e) {
    const slug = e.target.value;
    if (slug) router.push(`/city/${slug}`);
  }

  function handleMissingCitySubmit(e) {
    e.preventDefault();
    if (!missingCity.trim()) return;
    // Prototype only — nowhere real for this to go yet. Just acknowledges the
    // request, per spec's "crowdsource demand signal for expansion" idea.
    setSubmitted(true);
    setMissingCity("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <header className="border-b border-neutral-200 bg-paper sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          azn brbr
        </Link>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="border border-neutral-300 rounded-md px-2 py-1 bg-white text-sm"
            value={currentSlug || ""}
            onChange={handleCityChange}
          >
            <option value="" disabled>
              Choose a city
            </option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <form onSubmit={handleMissingCitySubmit} className="flex items-center gap-1">
            <input
              type="text"
              value={missingCity}
              onChange={(e) => setMissingCity(e.target.value)}
              placeholder="Don't see your city?"
              className="border border-neutral-300 rounded-md px-2 py-1 text-sm w-40"
            />
            <button
              type="submit"
              className="text-sm px-2 py-1 rounded-md bg-neutral-900 text-white hover:bg-neutral-700"
            >
              {submitted ? "Thanks!" : "Request"}
            </button>
          </form>

          <HomeBarberPicker barbers={allBarbers} />
        </div>
      </div>
    </header>
  );
}
