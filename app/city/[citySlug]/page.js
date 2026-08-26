import { notFound } from "next/navigation";
import {
  getCityBySlug,
  getConfirmedBarbersByCity,
  getUnconfirmedBarbersByCity,
  getAllHairTags,
} from "../../../lib/data";
import CityFeedLayout from "../../../components/CityFeedLayout";
import UnconfirmedSection from "../../../components/UnconfirmedSection";
import CityFilterBar from "../../../components/CityFilterBar";

const CITY_NOTES = {
  seattle:
    "The strongest signal in the seed set. Lynnwood and the International District carry most of it — ask for the stylist, not the shop.",
  berlin:
    "Reviewers here were the most explicit anywhere: several name the shop as where to go if you're Chinese or Asian, almost verbatim.",
  nyc:
    "Surprisingly thin for the size of the community — the knowledge exists, it just isn't showing up in English-language reviews yet.",
  paris:
    "Concentrated on Avenue de Choisy in the 13th. Belleville, historically Chinese, turned up nothing — proximity doesn't guarantee signal.",
  toronto:
    "No vouches yet despite one of the largest diasporas anywhere. Pacific Mall and Chinatown Centre are the obvious places to start asking.",
  sydney:
    "Two strong Korean-heritage shops, both praised for cuts and both flagged separately on chemical services — exactly what tag-scoped cautions are for.",
};

export default function CityPage({ params, searchParams }) {
  const city = getCityBySlug(params.citySlug);
  if (!city) notFound();

  const activeTag = searchParams?.tag || null;
  const allConfirmed = getConfirmedBarbersByCity(city.slug);
  const unconfirmed = getUnconfirmedBarbersByCity(city.slug);

  const filtered = activeTag
    ? allConfirmed.filter((b) => b.hairTags.includes(activeTag))
    : allConfirmed;

  return (
    <div>
      <section className="border-b border-rule px-8 pb-8 pt-12">
        <div className="label mb-4">
          Currently vouched — {allConfirmed.length} shop
          {allConfirmed.length === 1 ? "" : "s"}
        </div>
        <h1 className="mb-4 font-display text-[64px] font-light leading-[0.95] tracking-[-0.02em]">
          {city.name}
        </h1>
        {CITY_NOTES[city.slug] && (
          <p className="max-w-[430px] text-sm leading-[1.6] text-muted">
            {CITY_NOTES[city.slug]}
          </p>
        )}
      </section>

      <CityFilterBar
        citySlug={city.slug}
        hairTags={getAllHairTags()}
        activeTag={activeTag}
        shown={filtered.length}
        total={allConfirmed.length}
      />

      {filtered.length > 0 ? (
        <CityFeedLayout barbers={filtered} activeTag={activeTag} />
      ) : (
        <div className="px-8 py-14">
          <p className="max-w-[420px] font-display text-xl font-light leading-snug">
            {allConfirmed.length === 0
              ? "No vouched shops here yet. The listings below are where to start asking."
              : `Nobody has been vouched for ${activeTag} here yet.`}
          </p>
        </div>
      )}

      <UnconfirmedSection barbers={unconfirmed} />
    </div>
  );
}
