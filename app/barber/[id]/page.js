import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getBarberById,
  getSplitScore,
  getVouchesForBarber,
  getVouchLanguages,
  getTagPercent,
  getMonogram,
  getMonogramColor,
  isHairType,
} from "../../../lib/data";
import VouchQuote from "../../../components/VouchQuote";
import CautionCard from "../../../components/CautionCard";
import HomeBarberVouchBanner from "../../../components/HomeBarberVouchBanner";
import BookingButton from "../../../components/BookingButton";
import OwnerVoiceCard from "../../../components/OwnerVoiceCard";
import SplitScore from "../../../components/SplitScore";

// The flagship screen — every other part of the schema exists to feed this
// page. Stable, shareable route, since being screenshotted and passed around
// is core to how this is meant to spread.
export default function BarberProfilePage({ params }) {
  const barber = getBarberById(params.id);
  if (!barber) notFound();

  const scores = getSplitScore(barber.id);
  const vouches = getVouchesForBarber(barber.id);
  const languages = getVouchLanguages(barber.id);
  const headline = getTagPercent(scores);
  const recommends = vouches.filter((v) => v.sentiment === "recommend");
  const cautions = vouches.filter((v) => v.sentiment === "caution");
  const hairTags = barber.hairTags.filter(isHairType);
  const serviceTags = barber.hairTags.filter((t) => !isHairType(t));

  return (
    <div>
      <section className="bg-forest px-8 pb-8 pt-10 text-paper">
        <div className="mb-5 text-[10px] font-medium uppercase tracking-label text-forest-3">
          {barber.cityName} · {barber.neighborhood}
        </div>

        <div className="flex items-start gap-5">
          <div
            className="mono-avatar h-14 w-14 shrink-0 text-lg"
            style={{ backgroundColor: getMonogramColor(barber.id) }}
            aria-hidden="true"
          >
            {getMonogram(barber.name)}
          </div>
          <h1 className="max-w-[520px] font-display text-[44px] font-light leading-[1.02] tracking-[-0.02em]">
            {barber.name}
          </h1>
        </div>

        <div className="mt-7 flex flex-wrap gap-9 border-t border-paper/20 pt-5">
          {headline && (
            <Stat value={`${headline.percent}%`} label={`on ${headline.tag}`} />
          )}
          <Stat value={vouches.length} label={vouches.length === 1 ? "vouch" : "vouches"} />
          {/* A headline percentage on one tag shouldn't read as an all-clear
              when a caution sits on another. Surfaced here, in clay, so the
              two are seen together. */}
          {cautions.length > 0 && (
            <Stat
              value={cautions.length}
              label={`caution${cautions.length > 1 ? "s" : ""} on ${cautions[0].tag.toLowerCase()}`}
              accent
            />
          )}
        </div>
      </section>

      <HomeBarberVouchBanner barberId={barber.id} />

      <section className="px-8 py-9">
        <div className="mb-8 grid gap-x-5 gap-y-6 sm:grid-cols-2">
          {hairTags.length > 0 && (
            <TagBlock title="Vouched for hair" tags={hairTags} />
          )}
          {serviceTags.length > 0 && (
            <TagBlock title="Services mentioned" tags={serviceTags} />
          )}
          {/* The practical question for a traveler: can I actually talk to
              this person. Listed, not counted — a number tells you nothing. */}
          {barber.languagesSpoken?.length > 0 && (
            <TagBlock title="Speaks" tags={barber.languagesSpoken} />
          )}
        </div>

        {languages.length > 0 && (
          <div className="label mb-8">
            Vouches written in {languages.join(", ")}
          </div>
        )}

        {scores.length > 1 && (
          <div className="mb-9">
            <div className="label mb-3">Split score, by tag</div>
            <SplitScore scores={scores} />
            <p className="mt-3 max-w-[460px] text-[11px] leading-relaxed text-muted-2">
              Scored per tag, not blended. A shop can be the best in the city
              for one kind of hair and unremarkable for another — that&apos;s
              the point.
            </p>
          </div>
        )}

        {recommends.length > 0 && (
          <>
            <div className="label mb-5">What people say</div>
            <div className="mb-9 space-y-7">
              {recommends.map((v) => (
                <VouchQuote key={v.id} vouch={v} />
              ))}
            </div>
          </>
        )}

        {cautions.length > 0 && (
          <div className="mb-9 space-y-6">
            {cautions.map((v) => (
              <CautionCard key={v.id} vouch={v} />
            ))}
          </div>
        )}

        <OwnerVoiceCard barber={barber} />

        <div className="mt-9 border-t border-rule pt-6">
          <BookingButton />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="label">
              {barber.address || "Address not captured yet"}
            </span>
            {barber.mapsLink && (
              <a
                href={barber.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="label transition-colors hover:text-ink"
              >
                View on Google Maps →
              </a>
            )}
          </div>
          <Link
            href={`/city/${barber.citySlug}`}
            className="label-ink mt-6 inline-block border-b border-ink pb-0.5"
          >
            ← Back to {barber.cityName}
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label, accent }) {
  return (
    <div>
      <div
        className={`font-display text-[28px] font-light leading-none ${
          accent ? "text-clay-2" : ""
        }`}
      >
        {value}
      </div>
      <div
        className={`mt-1.5 text-[10px] uppercase tracking-label ${
          accent ? "text-clay-2" : "text-forest-3"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

function TagBlock({ title, tags }) {
  return (
    <div>
      <div className="label mb-2.5">{title}</div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {tags.map((t) => (
          <span key={t} className="font-display text-[17px] font-light">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
