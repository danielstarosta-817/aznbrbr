# Running punch list

Things spotted but deliberately not fixed yet. Add to this freely — it's a
scratchpad, not a spec.

## Open

- _(nothing yet — add notes here as they come up)_

## Watch

- **`languagesSpoken` is inferred, not declared.** The generator guesses it
  from review text plus the city's default language, so a shop may list a
  language nobody there actually speaks. Per the spec this field is meant to be
  self-declared by the barber — it becomes real when operator accounts exist.

## Known limitations, already understood

Not bugs, but worth remembering before anyone asks:

- **`Thick & straight` dominates the taxonomy** (43 of 51 vouched shops). The
  source reviews mostly say "knows Asian hair" without describing texture, so
  the generator defaults to it. Will only resolve with real vouches.
- **City map pins aren't geocoded.** Positions derive from the shop id. The
  landing world map, by contrast, uses real coordinates.
- **Budget filter is inert.** No price data exists in the seed set at all.
- **All quotes are sample content** against real, findable businesses. The
  prototype notice in the header is the only thing conveying this — don't
  remove it without replacing the protection somehow.
- **Toronto has zero vouched shops** despite a large diaspora. That's a real
  research finding, not a data bug.

## Done

- Wordmark set as `aznbrbr`, no space.
- Scores moved from a percentage to **out of 5.0, rendered on an abacus**
  (`components/Abacus.js`). Five rods, five beads, each bead worth 0.2. It's a
  stylisation, not a working suanpan — two more faithful versions (two-rod
  soroban, then a beam with heaven/earth beads) both read as clutter at feed
  size. The numeral appears beside it everywhere, so nothing depends on being
  able to read beads.
- Roughly 60 hand-written sample vouches added across 18 shops, so the split
  score has enough density to actually show a shop being strong on one kind of
  hair and ordinary on another.
- Replaced the "languages vouched in" count on the profile with **Speaks**,
  listing the actual languages. The vouch-language stat moved to a small line
  reading "Vouches written in X" — honest, but no longer masquerading as
  practical information.
