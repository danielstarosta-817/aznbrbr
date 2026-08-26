# Running punch list

Things spotted but deliberately not fixed yet. Add to this freely — it's a
scratchpad, not a spec.

## Open

- _(nothing yet — add notes here as they come up)_

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
