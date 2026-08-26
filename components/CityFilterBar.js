"use client";

import Link from "next/link";

// Carries the landing page's hair-type choice through to the results, and lets
// it be changed without going back — the filters stay reachable, per the
// "both" entry-flow decision.
export default function CityFilterBar({ citySlug, hairTags, activeTag, shown, total }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule px-8 py-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="label">Hair type</span>
        <Link
          href={`/city/${citySlug}`}
          className={`label transition-colors hover:text-ink ${
            !activeTag ? "text-ink underline underline-offset-4" : ""
          }`}
        >
          All
        </Link>
        {hairTags.map((tag) => (
          <Link
            key={tag}
            href={`/city/${citySlug}?tag=${encodeURIComponent(tag)}`}
            className={`label transition-colors hover:text-ink ${
              activeTag === tag ? "text-ink underline underline-offset-4" : ""
            }`}
          >
            {tag}
          </Link>
        ))}
      </div>

      <span className="label">
        {activeTag ? `${shown} of ${total}` : `${total} shops`}
      </span>
    </div>
  );
}
