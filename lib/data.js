import seed from "../data/seed.json";

export function getCities() {
  return seed.cities;
}

export function getCityBySlug(slug) {
  return seed.cities.find((c) => c.slug === slug);
}

export function getBarbersByCity(citySlug) {
  return seed.barbers.filter((b) => b.citySlug === citySlug);
}

export function getConfirmedBarbersByCity(citySlug) {
  return getBarbersByCity(citySlug).filter((b) => b.isConfirmed);
}

export function getUnconfirmedBarbersByCity(citySlug) {
  return getBarbersByCity(citySlug).filter((b) => !b.isConfirmed);
}

export function getBarberById(id) {
  return seed.barbers.find((b) => b.id === id);
}

export function getVouchesForBarber(barberId) {
  return seed.vouches.filter((v) => v.subjectId === barberId);
}

export function getAllBarbers() {
  return seed.barbers;
}

export function getDefaultHomeBarberId() {
  return seed.defaultHomeBarberId;
}

// "Asian hair" is the product's baseline, not a tag — every shop here would
// carry it. These are the textures an Asian person actually walks in with,
// kept distinct from services so the filter asks one question at a time.
export const HAIR_TYPES = [
  "Fine & straight",
  "Thick & straight",
  "Coarse & dense",
  "Wavy",
  "Curly",
  "Cowlicks & crowns",
];

export const SERVICES = [
  "Fades & tapers",
  "Perms",
  "Straightening & rebonding",
  "Colour",
  "Kids cuts",
];

export function isHairType(tag) {
  return HAIR_TYPES.includes(tag);
}

// Hair types actually present on a confirmed barber, most common first — so
// the filter never offers a texture that would return an empty city.
export function getAllHairTags() {
  const counts = new Map();
  for (const b of seed.barbers) {
    if (!b.isConfirmed) continue;
    for (const t of b.hairTags) {
      if (!isHairType(t)) continue;
      counts.set(t, (counts.get(t) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}

export function getMonogram(name) {
  const cleaned = name.replace(/\(.*?\)/g, "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Deterministic pick from the brand palette, so a shop keeps the same mark
// colour across the feed and its profile.
const MONO_COLORS = ["#1E3A32", "#8C3A28", "#4A5240", "#3D5C50", "#6B4A2E"];

export function getMonogramColor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 9973;
  }
  return MONO_COLORS[hash % MONO_COLORS.length];
}

// Percentage of this barber's vouches on a given tag that are recommendations.
export function getTagPercent(scores, tag) {
  const entry = tag ? scores.find((s) => s.tag === tag) : scores[0];
  if (!entry) return null;
  const total = entry.recommend + entry.caution;
  if (!total) return null;
  return { tag: entry.tag, percent: Math.round((entry.recommend / total) * 100), ...entry };
}

// Split score: group this barber's vouches by tag, count recommend vs caution.
export function getSplitScore(barberId) {
  const vouches = getVouchesForBarber(barberId);
  const byTag = {};
  for (const v of vouches) {
    if (!byTag[v.tag]) byTag[v.tag] = { tag: v.tag, recommend: 0, caution: 0 };
    if (v.sentiment === "recommend") byTag[v.tag].recommend += 1;
    else byTag[v.tag].caution += 1;
  }
  return Object.values(byTag).sort((a, b) => (b.recommend + b.caution) - (a.recommend + a.caution));
}

// Languages this barber has actually been vouched in (for the "reviews in ___" badge).
export function getVouchLanguages(barberId) {
  const vouches = getVouchesForBarber(barberId);
  const langs = new Set(vouches.map((v) => v.language));
  return Array.from(langs);
}

// The one differentiator: does MY home barber vouch for this barber, anywhere?
export function getHomeBarberVouch(barberId, homeBarberId) {
  if (!homeBarberId) return null;
  return seed.vouches.find(
    (v) => v.subjectId === barberId && v.voucherType === "operator" && v.voucherId === homeBarberId
  ) || null;
}

export function summarizeBarber(barberId) {
  const barber = getBarberById(barberId);
  const scores = getSplitScore(barberId);
  const totalRecommend = scores.reduce((sum, s) => sum + s.recommend, 0);
  const totalCaution = scores.reduce((sum, s) => sum + s.caution, 0);
  const topTag = scores[0];
  return { barber, scores, totalRecommend, totalCaution, topTag };
}
