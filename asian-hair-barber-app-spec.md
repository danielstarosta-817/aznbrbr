# Asian hair barber finder — working spec

*Draft v1. Written to capture everything decided so far, and to flag what's still genuinely open. Meant as a handoff document, not a final PRD.*

## The problem

Finding a barber who's actually good with Asian hair is hard in any city that isn't your home city, and it's especially hard while traveling or right after moving. The people who know where to go — other Asian men with the same hair type, who've already been burned by the wrong barber — aren't the people search engines, Yelp, or general booking apps are built to surface. That knowledge exists, but it's scattered across blog posts, Reddit threads, and word of mouth.

## Who this is for

Two personas, in priority order:

1. **The traveler.** On a business trip or vacation, needs a haircut in a city they don't live in, and has no way to know who's good before they arrive.
2. **The new arrival.** Just moved to a city and hasn't found a regular barber yet.

Both personas care more about certainty than price. Neither is well served by "find any decent barber nearby" — that's a solved problem elsewhere. This app solves "find a barber I can trust *for my specific hair* in a city I don't know."

## Scope for v1

**Asian hair only.** Deliberately narrow. The friend originating this idea believes there's more than enough user base within that scope alone, and starting narrow keeps the vouch density high enough to be useful rather than spread thin across every hair type from day one. The taxonomy is built so other hair types can be added later without restructuring anything (see Data model).

## Core insight the whole product rests on

A star rating doesn't tell you whether the reviewer has your hair type, or whether they know what a good cut for that hair type even looks like. A vouch from someone with the same hair type — or better, from your own trusted barber who knows a barber in another city — is a categorically stronger signal. Everything below is in service of making that signal visible instead of buried in undifferentiated review text.

---

## Data model

Four objects. Nearly everything else (split scores, paired quotes, caution flags, language badges) is a *view* onto `vouches`, not a separate system.

### `barbers`
- Self-claimed. **No verification required** — claiming to be a barber is enough.
- Fields: name, shop name, city, neighborhood, price range, `hair_tags` (open list — hair types and cut styles the barber claims skill in), `languages_spoken` (open list, self-declared).

### `customers`
- Self-signed-up. **No proof of visit required** for a vouch.

### `vouches` — the central object
| Field | Notes |
|---|---|
| `voucher_id` | who's vouching |
| `voucher_type` | `customer` or `operator` (another barber) |
| `subject_id` | which barber this is about |
| `tag` | what it's actually about (a hair type or service — open list, same taxonomy as `hair_tags`) |
| `sentiment` | `recommend` or `caution` — scoped to the tag, never to the barber as a whole |
| `identity_badge` | optional, per-vouch, off by default — e.g. "vouching as Asian" |
| `language` | what language the quote was written in |
| `quote` | optional text |

### `tags`
- Open, growable list. Adding a new one later is a new row, not a restructure.
- **"Asian hair" is deliberately not a tag.** It's the baseline assumption of the entire product — every shop in here would carry it, so it distinguishes nothing and flattens real variation. The taxonomy instead describes the textures an Asian person actually walks in with.
- **Hair types** (what your hair is like — this is what the discovery filter asks): `Fine & straight`, `Thick & straight`, `Coarse & dense`, `Wavy`, `Curly`, `Cowlicks & crowns`.
- **Services** (what you're getting done): `Fades & tapers`, `Perms`, `Straightening & rebonding`, `Colour`, `Kids cuts`.
- Both live in the same open list and a vouch's `tag` can be either, but the UI treats them as separate questions — "what's my hair like" and "what am I booking" aren't the same filter.

---

## Discovery flow

Three-step: **landing → city results → profile.**

- **Landing** is the front door: pick a city, a hair type, and (eventually) a budget, over a world map showing every covered city. Mark size on the map encodes depth of data, so a thin city reads as thin instead of being padded to look equal — Toronto renders hollow at zero vouches rather than pretending.
- **Budget is not yet real.** The spec has always listed `price_range` on `barbers`, but the seed research never captured it — all rows are empty. The control ships visible but explicitly inert and labelled as such, rather than faking a filter that isn't filtering. Needs a Places-API price-level pass, or manual collection, before it does anything.
- **City results** keep the list + map split, with the landing's hair-type choice carried through as a filter bar that stays adjustable without going back.

---

## Trust mechanics

- **No proof anywhere.** Consistent honor system across the whole schema — customer vouches, operator claims, and identity badges are all self-reported and unverified. This is a deliberate low-friction choice, not an oversight, appropriate to the current scale.
- **Operator vouches are gated, customer vouches are not.** An operator's vouch for another barber only counts once that operator has picked up roughly 3–5 customer vouches themselves. This is the one anti-gaming rule in the system, there specifically to stop two empty accounts from vouching for each other. (Exact threshold not load-bearing — fine to tune later.)
- **Cautions are not gated.** The incentive to fake a warning is much weaker than the incentive to fake credibility, and the cost of suppressing a real one (someone gets a bad chemical treatment) is high. A single well-described caution should surface immediately.
- **Show provenance, don't hide it behind one blended score.** "Vouched by Minh, 61 customer vouches" lets the viewer weigh it themselves rather than trusting an opaque number.
- **Cautions are scoped to a tag, never to the barber as a whole.** "Not recommended for perms" sits next to "recommended for fades" on the same profile. This is what keeps the feature from becoming a general complaint board — it's specificity, not a thumbs-down on the person.

### Open question
Can operators publicly caution each other, or is caution customer-only for now? Recommending a peer feels natural; publicly warning about one is socially heavier. Leaning toward customer-only at first, not yet decided.

---

## The split score (and why it's not just a joke)

Aggregate star ratings hide the exact thing this app exists to reveal. Splitting by **tag**, not by the reviewer's identity, is what's actually buildable and defensible: "4.9★ on Asian hair, 3.2★ on everything else" can be true in a way a single blended number can't capture. The banter version of this (a barber joking that he doesn't know what white people want) rides on top of real, tag-scoped data rather than replacing it.

## Personalization — the actual differentiator

A user can designate a home barber. If that specific barber has vouched for someone in another city, it surfaces as a distinct, highlighted signal ("vouched for by your NYC barber"), separate from the generic aggregate vouch count. This is the one feature existing apps (theCut, Yelp, curl-specialist directories) don't have, because none of them have a personal trust graph. It should not get diluted as the product grows.

## Language

- Every vouch carries the language it was written in.
- Quotes **autotranslate by default** to a viewer's language (English for now), with a small "Autotranslated from [language] · See original" caption that toggles back — same pattern as X/Twitter.
- A "reviews in ___" badge on each profile, computed from real vouch data, not hardcoded — a small, honest, shareable stat.
- **Site-wide language switching** (English / Chinese / Japanese / Korean) is a real goal, but scoped as build-for-later: architect the UI so all chrome text lives in one swappable layer from day one (cheap to do now, expensive to retrofit), ship English-only first, add languages once usage data shows which community shows up first. Simplified vs. Traditional Chinese is a real open sub-decision, not a detail — the seed data suggests Cantonese/Fujianese/Taiwanese communities (Flushing, Sunset Park) may matter as much as Mandarin.
- Longer-term idea: crowdsource UI translations from the community the same way vouches are crowdsourced, rather than paying for professional localization.

## Deferred: photo vouches

Users should eventually be able to attach before/after photos to a vouch — more convincing than a quote alone, and fits the meme-able, forum-y tone. **Explicitly out of scope for now** — real added complexity around moderation and consent (scope to the haircut, not the barber's face or shop interior; a caution vouch with a bad-outcome photo is high-value but higher-risk and may need a quick human check before going live; a report/flag button should exist from day one once this ships). Keep in mind for a later phase.

## Deferred: direct booking

Eventually, people should be able to book a haircut directly through the platform, not just discover a barber and leave to book elsewhere. **Explicitly out of scope for now** — this only makes sense once there's enough vouch density in a city that discovery is actually working; booking is a monetization/retention layer on top of a trust problem this app hasn't solved yet, not a substitute for solving it.

What it would touch, once it's real:
- **Data model.** `barbers` would need availability (hours, calendar, per-stylist slots if a shop has more than one), and a new `bookings` object (customer, barber, time, status, maybe which tag/service was booked — useful for eventually tying a completed booking back to a vouch prompt).
- **Build vs. integrate.** Two real paths: build booking natively, or integrate an existing scheduling backend (Square Appointments, Booksy, Calendly-style API) so barbers who already use one of those don't have to double-enter availability. Integrating is almost certainly right for v1 of this feature — most barbers already have some booking tool, and replicating that well is a much bigger lift than the discovery/trust problem this app actually exists to solve.
- **Payments.** Booking implies either collecting payment/deposit or just reserving a slot with no money changing hands. The no-payment version is far simpler and might be enough to start — a stable time slot is most of the value for the traveler persona specifically.
- **Revenue.** This is the natural home for a booking take rate (à la theCut/Booksy), on top of the profile-subscription and affiliate paths already noted as revenue options. Worth remembering that revenue is downstream of density — this doesn't change the build order, just gives today's discovery-and-trust work a clearer monetization payoff once it lands.
- **Trust-model interaction, worth deciding later, not now:** should a completed booking be able to unlock or strengthen a vouch (e.g., "verified visit") without breaking the deliberately-no-proof-required honor system elsewhere in the schema? Flagging this now so it doesn't get decided by accident later — it's a real tension between the low-friction vouch philosophy and the credibility a confirmed booking could add.

## Discovery data strategy

### What doesn't work
Scraping Yelp or theCut is off the table — both explicitly prohibit it in their terms of service, and even if that weren't true, neither platform has the specific data point this app needs (hair-type competence isn't a structured field anywhere). General web search for "city + Asian hair barber" is dominated by SEO content farms and isn't a reliable way to discover which cities have real community chatter — it worked for a couple of cities (Seattle via a Blind thread, Melbourne via aggregated Yelp snippets) but returned mostly noise elsewhere (Toronto, London).

### What does work
1. **Google Places API** (legitimate, official) as the backbone — real business listings, ratings, and review text for a city/neighborhood.
2. **A keyword/signal pass over that review text** — reviews already contain phrases like "understands Asian hair" or "thick, straight hair," just unstructured and untagged.
3. **Targeted community-thread searches** (Reddit, Blind, diaspora blogs) per city, cross-referenced back into the Places data — catches recommendations that never show up in a Google review at all.
4. **Human verification** — nothing automates the actual vouch-seeding; that has to come from the founding team's own network reaching out to shortlisted candidates.

### Seed data collected so far
Six cities pulled and hand-reviewed for signal strength: **NYC, Chicago, Seattle, Paris, Lisbon, Berlin.** Full structured data (business name, address, phone, rating, signal strength, paraphrased reasoning, Google Maps link) lives in the companion spreadsheet, `asian_hair_barber_seed_list.xlsx`, one tab per city.

Headline findings:
- **Berlin and Seattle had the strongest, most explicit signal** — reviewers writing things like "this is the place to go if you're Chinese or Asian" almost verbatim.
- **NYC came back surprisingly weak** relative to its Asian population — the knowledge likely exists but isn't showing up in English-language review text, meaning this is the city where manual outreach will matter most.
- **Geographic proximity to a diaspora neighborhood doesn't guarantee online signal** — Paris's 13th arrondissement (Avenue de Choisy) was strong; Belleville, also historically Chinese, came back with nothing. Can't assume, have to check.
- **A single well-regarded shop can diverge sharply by service** — several strong candidates had one glowing thread of reviews for cuts and a separate thread describing real damage from a perm or chemical straightening. This is exactly what the tag-scoped caution system is designed to capture.

### Map provider decision (not yet made)
If Google Places API supplies the backbone data, Google's platform terms generally require results to be displayed on an actual Google Map and limit how long place data can be cached. Building fully custom map styling (see UI section) may require an alternative provider (Mapbox, OpenStreetMap) instead. Needs a decision before the map UI goes further than mockups.

---

## Product UI / navigation model

- **Feed-first, map secondary.** Everything distinctive about this app (split scores, quotes, badges, cautions) is fundamentally text-and-personality content, which lives better in a scrollable feed than inside a map. The map remains valuable for the traveler persona's "where is this relative to me" need, but as a toggle, not the landing screen.
- **Nav includes a dropdown of covered cities.** Doubles as the "search a destination before you've arrived" behavior travelers need. Should include a low-friction "don't see your city" option to crowdsource demand signal for expansion. Cities likely sorted by depth of data rather than alphabetically while the list is still short.
- **Each city page splits into a list (one side) and a map with a docked summary card (other side).** Selecting a barber in the list updates the docked card on the map without losing map context (position/zoom) — modeled on the Airbnb/Yelp pattern rather than a full tab-swap.
- **The full barber profile is its own destination**, not a side panel — tapping in from the list or the docked card promotes it to the main view. It needs a stable, shareable URL, since being screenshotted and passed around is core to how this app is meant to spread. Back navigation should restore the exact prior list/map state (scroll position, pan, zoom, selected pin).
- **Mobile collapses the split layout** to a single column with a toggle between list and map, given most usage likely happens on a phone, in the moment, on a trip.

### The flagship profile page
Combines, on one screen: split score by tag, the personalized "vouched by your barber" banner, a "reviews in [languages]" badge, paired quotes (one optionally identity-tagged, one not), a tag-scoped caution card visually distinct from a recommendation, autotranslate-with-see-original on non-English quotes, and a barber's own voice as a pull-quote. This is the reference screen — every other part of the schema exists to feed it.

---

## Open questions going into build

1. Operator-to-operator cautions: allowed, or customer-only for now?
2. Do unconfirmed backbone listings (Places data with no vouches yet) live mixed into the main feed, or in a separate "help us confirm these" section?
3. Exact operator-vouch threshold (currently "roughly 3–5") — fine as a placeholder, or worth fixing now?
4. Map provider: Google Maps JS (simpler, more constrained) vs. Mapbox/OSM (more custom styling, more setup)?
5. Docked map card vs. full profile takeover — does the docked card need any content beyond name and score, given the full profile is one tap away?
6. Simplified vs. Traditional Chinese, or both, once Chinese is added to site-wide language switching.

## Explicitly deferred
- Photo/before-after vouches.
- Direct booking (see dedicated section above) — the prototype has a design-only, inert "Request a booking" button on the profile page so the layout has a slot for it, but nothing behind it yet.
- Full site-wide language switching beyond English (architecture for it now, ship it later).
- Formal moderation tooling beyond a basic report/flag button.

## Next step
This document plus `asian_hair_barber_seed_list.xlsx` are the two handoff artifacts. Suggested next move: lock the open questions above to whatever extent possible, then move the actual build (real database, real UI, the Places pipeline running at scale) into Cowork.
