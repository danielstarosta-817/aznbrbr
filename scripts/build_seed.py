"""
One-off generator: reads asian_hair_barber_seed_list.xlsx and produces
data/seed.json for the prototype.

IMPORTANT — data provenance note:
The `vouches` produced here are SYNTHETIC / MOCK data for prototyping the UI only.
They are paraphrased dramatizations of the "Signal notes" column already present
in the seed spreadsheet (which itself paraphrases aggregated public Google review
sentiment — see spec section "Discovery data strategy"). No real customer wrote
these quotes, and no real vouch has been collected yet. This file must not be
treated as real vouch data once actual users start vouching — it exists purely
so the feed/profile pages have realistic-looking content to validate the design
against, per the six-city seed data the spec references.

Run: python3 scripts/build_seed.py
"""
import json
import re
import openpyxl

SRC = "asian_hair_barber_seed_list.xlsx"
OUT = "data/seed.json"

CITY_META = {
    "NYC": {"slug": "nyc", "name": "New York City", "country": "USA"},
    "Chicago": {"slug": "chicago", "name": "Chicago", "country": "USA"},
    "Seattle": {"slug": "seattle", "name": "Seattle", "country": "USA"},
    "Paris": {"slug": "paris", "name": "Paris", "country": "France"},
    "Lisbon": {"slug": "lisbon", "name": "Lisbon", "country": "Portugal"},
    "Berlin": {"slug": "berlin", "name": "Berlin", "country": "Germany"},
    "London": {"slug": "london", "name": "London", "country": "UK"},
    "Sydney": {"slug": "sydney", "name": "Sydney", "country": "Australia"},
    "Toronto": {"slug": "toronto", "name": "Toronto", "country": "Canada"},
    "Amsterdam": {"slug": "amsterdam", "name": "Amsterdam", "country": "Netherlands"},
    "Madrid": {"slug": "madrid", "name": "Madrid", "country": "Spain"},
}

# fictional voucher first names, flavored loosely by city, purely for demo texture
VOUCHER_NAMES = {
    "nyc": ["Wei", "Daniel", "Priya", "Jonathan", "Mei", "Andre"],
    "chicago": ["Ken", "Sarah", "Minh", "Alex", "Grace", "Omar"],
    "seattle": ["David", "Linh", "Josh", "Yuki", "Aiko", "Ben"],
    "paris": ["Thomas", "Linh", "Camille", "Trung", "Sophie", "Marc"],
    "lisbon": ["Maria", "Wei", "Joao", "Trang", "Rui", "Ana"],
    "berlin": ["Anh", "Lukas", "Mai", "Felix", "Chau", "Nina"],
    "london": ["Kevin", "Minji", "Tom", "Linh", "Grace", "James"],
    "sydney": ["Jack", "Yuna", "Minh", "Chloe", "David", "Amy"],
    "toronto": ["Kevin", "Priya", "Wei", "Sarah", "Tom", "Grace"],
    "amsterdam": ["Sanne", "Duc", "Lars", "Mai", "Tom", "Anh"],
    "madrid": ["Carlos", "Wei", "Lucia", "Trung", "Marta", "Xin"],
}

DEFAULT_LANGUAGE_BY_CITY = {
    "nyc": "English", "chicago": "English", "seattle": "English",
    "paris": "French", "lisbon": "Portuguese", "berlin": "German",
    "london": "English", "sydney": "English", "toronto": "English",
    "amsterdam": "Dutch", "madrid": "Spanish",
}

def slugify(s):
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s.strip().lower())
    return re.sub(r"-+", "-", s).strip("-")

# Taxonomy. "Asian hair" is the assumed baseline of the whole product, so it is
# NOT a tag — it would apply to every row and distinguish nothing. These are the
# textures an Asian person actually walks in with, kept separate from services,
# because "what is my hair like" and "what am I getting done" are different
# questions and the UI filters on the first one.
HAIR_TYPES = [
    "Fine & straight",
    "Thick & straight",
    "Coarse & dense",
    "Wavy",
    "Curly",
    "Cowlicks & crowns",
]

SERVICES = [
    "Fades & tapers",
    "Perms",
    "Straightening & rebonding",
    "Colour",
    "Kids cuts",
]

def guess_tags(notes, business_name):
    notes_l = notes.lower()
    hair, services = [], []

    def add(lst, val):
        if val not in lst:
            lst.append(val)

    # Texture
    if any(k in notes_l for k in ["soft, straight", "very soft", "thin hair", "straight, thin", "fine"]):
        add(hair, "Fine & straight")
    if any(k in notes_l for k in ["thick, straight", "thick asian", "thick hair", "straight asian"]):
        add(hair, "Thick & straight")
    if any(k in notes_l for k in ["coarse", "dense", "thick, wavy"]):
        add(hair, "Coarse & dense")
    if "wavy" in notes_l:
        add(hair, "Wavy")
    if "curl" in notes_l:
        add(hair, "Curly")
    if any(k in notes_l for k in ["multiple directions", "cowlick", "head shape", "grows in"]):
        add(hair, "Cowlicks & crowns")

    # Services
    if "perm" in notes_l:
        add(services, "Perms")
    if any(k in notes_l for k in ["straighten", "rebond", "magic straight", "chemical"]):
        add(services, "Straightening & rebonding")
    if "color" in notes_l or "colour" in notes_l:
        add(services, "Colour")
    if "child" in notes_l or "kid" in notes_l:
        add(services, "Kids cuts")
    if "fade" in notes_l or "short cut" in notes_l:
        add(services, "Fades & tapers")

    # A generic "knows Asian hair" review with no texture detail almost always
    # refers to the thick, straight hair most commonly cited as the problem.
    if not hair:
        add(hair, "Thick & straight")

    return hair + services

def guess_languages(city_key, notes):
    notes_l = notes.lower()
    langs = [DEFAULT_LANGUAGE_BY_CITY[city_key]]
    for lang, kws in [
        ("Mandarin", ["mandarin", "chinese"]),
        ("Cantonese", ["cantonese"]),
        ("Korean", ["korean"]),
        ("Vietnamese", ["vietnamese"]),
        ("Khmer", ["cambodian"]),
        ("Japanese", ["japanese"]),
    ]:
        if any(k in notes_l for k in kws) and lang not in langs:
            langs.append(lang)
    return langs

def make_caution(notes):
    """First-person warning, sentence-cased. A caution is one person telling you
    what went wrong for them — not a research summary about the shop."""
    notes_l = notes.lower()
    if "dryness" in notes_l or "manageability" in notes_l:
        return "The cut was great, but I got straightening done here and my hair was dry and unmanageable for weeks after. Go for the cut, not the chemical work."
    if "inconsistent" in notes_l and "perm" in notes_l:
        return "My cut was solid, but the perm dropped out within a few weeks. Ask how recently they've done one before you book it."
    if "colour" in notes_l or "color" in notes_l:
        return "I'd go back for a cut without thinking twice. The colour was a different story — it came out patchy and I had to get it fixed elsewhere."
    if "pricing" in notes_l or "complaint" in notes_l:
        return "The cut itself was fine, but I got quoted one price and charged another. Confirm what you're paying before you sit down."
    if "mixed" in notes_l or "vetting" in notes_l or "vet " in notes_l:
        return "My experience was good, but I've heard enough mixed things from other people that I wouldn't send someone here blind."
    if "burn" in notes_l or "damage" in notes_l:
        return "A friend had a chemical treatment here and it damaged her hair badly. I'd get a cut here, nothing more, until more people weigh in."
    if "western" in notes_l or ("short cut" in notes_l and "complaint" in notes_l):
        return "They're excellent with my hair type, but I asked for a short Western-style cut once and it didn't land. Stick to what they know."
    if "curly" in notes_l and "not a good fit" in notes_l:
        return "Not set up for properly curly hair — I left with it cut like it was straight. Fine if that's not your texture."
    return None


def make_recommend_quote(notes, hair_tag, service_tags):
    """Turn a third-person research note into something a person would actually
    say. Keyed off what the note observed, so the quote still reflects the real
    signal rather than being generic filler."""
    n = notes.lower()

    if "korean" in n and ("heritage" in n or "seoul" in n or "itaewon" in n):
        return "Walked in not expecting much and got the best cut I've had since leaving Seoul. They didn't need me to explain anything."
    if "fly back" in n or "back to asia" in n:
        return "I used to genuinely think I had to fly home for a decent haircut. Not anymore."
    if "reminded" in n and "korea" in n:
        return "Felt exactly like getting my hair done back home — same technique, same attention, none of the guesswork."
    if "years of struggling" in n or "struggled" in n or "struggling" in n:
        return "Years of stylists telling me my hair was 'difficult'. She looked at it once and just got on with it."
    if "layer" in n:
        return "She knew exactly how to layer it without the whole thing losing weight. First time someone got that right without me asking."
    if "identified" in n or "on sight" in n:
        return "He clocked how coarse my hair was the second I sat down. Nobody else has ever mentioned it — they just cut and hope."
    if "multiple directions" in n or "cowlick" in n or "head shape" in n:
        return "My hair grows in about four directions and he worked with it instead of fighting it. It still sits right two weeks later."
    if "multilingual" in n or "mandarin" in n or "cantonese" in n or "speaks" in n:
        return "Being able to explain what I wanted in my own language made all the difference. No translating, no compromising."
    if "perm" in n and "specialist" in n:
        return "Got a perm here after two bad ones elsewhere. This one actually held its shape and didn't wreck my hair."
    if "child" in n or "kid" in n:
        return "My son's hair is fine and soft and every other place has butchered it. They took their time and got it right."
    if "premium" in n or "without charging" in n:
        return "Knows exactly what to do with thick hair and doesn't charge extra for it, which somehow still feels rare."
    if "fixed a bad cut" in n or "bad cut" in n:
        return "Came in to salvage a bad cut from somewhere else and left looking like a different person."
    if "curly" in n or "wavy" in n:
        return "Finally someone who didn't treat the wave in my hair like a problem to be flattened out."
    if "h mart" in n or "community" in n or "local" in n or "neighborhood" in n or "neighbourhood" in n:
        return "Everyone in the neighbourhood goes here and now I understand why. No fuss, just a good cut every time."
    if "thick" in n or "coarse" in n or "dense" in n:
        return "Thick hair usually means someone thinning it into oblivion. Not here — he actually knows how to take weight out properly."
    if "straight" in n and "soft" in n:
        return "My hair is fine and dead straight, which most barbers make look flat. This is the first cut that's had any shape to it."

    if service_tags:
        return f"Went in for {service_tags[0].lower()} and it's the first time I haven't left second-guessing the result."
    return "First place in this city where I didn't have to explain my hair before they started cutting."


# The barber's own voice — the meme-able, forum-y register the spec asked for.
# Deliberately unpolished and a little funny, because a shop that says something
# blunt in its own language is more convincing than marketing copy.
# All sample content; see the prototype notice in the UI.
OWNER_QUOTES = {
    "liyong-friseursalon-chinese-named-berlin": {
        "language": "Mandarin",
        "original": "我不会剪白人的头发，我也不会说英文。你要是华人，来就对了。",
        "english": "I don't know how to cut white people's hair and I don't speak English. If you're Chinese, you're in the right place.",
    },
    "falali-hair-salon-seattle": {
        "language": "Cantonese",
        "original": "你唔使解釋，我一睇就知你想點。",
        "english": "You don't need to explain. I can tell what you want by looking.",
    },
    "dnk-hair-sydney": {
        "language": "Korean",
        "original": "펌은 자신 있어요. 영어는 자신 없어요.",
        "english": "I'm confident with perms. Less confident with English.",
    },
    "huong-hiep-toc-berlin": {
        "language": "Vietnamese",
        "original": "Tóc dày dễ thôi. Tóc mỏng mới khó.",
        "english": "Thick hair is the easy part. It's thin hair that's hard.",
    },
    "maison-de-mi-salon-korean-hair-salon-nyc": {
        "language": "Korean",
        "original": "여기 오는 손님 반은 다른 데서 망치고 와요.",
        "english": "Half the people who come here are fixing a haircut from somewhere else.",
    },
}

QUOTE_TEMPLATES_FR = [
    "Enfin un salon qui sait couper des cheveux asiatiques épais sans tout arracher.",
    "On m'a coupé les cheveux comme je le voulais, sans avoir à tout expliquer trois fois.",
]
QUOTE_TEMPLATES_DE = [
    "Endlich jemand, der wirklich weiß, wie man asiatisches Haar schneidet.",
    "Kein Aufpreis, keine Ausreden — einfach ein guter Schnitt für dickes Haar.",
]

TRAILING_STOPWORDS = {"in", "of", "a", "an", "the", "and", "for", "on", "to", "with", "at", "by"}

def build_recommend_quote(notes, city_key, limit=200):
    base = notes.strip()
    if len(base) <= limit:
        return base

    # Prefer cutting at a full sentence boundary within the limit.
    sentences = re.split(r"(?<=[.;])\s+", base)
    kept = ""
    for s in sentences:
        candidate = (kept + " " + s).strip() if kept else s
        if len(candidate) > limit:
            break
        kept = candidate
    if kept and len(kept) >= 40:
        return kept.rstrip(".;") + "."

    # No full sentence fits — fall back to a clean clause/word boundary, no
    # mid-word or dangling-preposition cuts.
    truncated = base[:limit]
    for sep in [", ", " — ", " - "]:
        idx = truncated.rfind(sep)
        if idx > 40:
            return truncated[:idx].rstrip(",;— -") + "…"
    truncated = truncated.rsplit(" ", 1)[0]
    words = truncated.split(" ")
    while words and words[-1].lower().strip(",;") in TRAILING_STOPWORDS:
        words.pop()
    return " ".join(words).rstrip(",;") + "…"

def main():
    wb = openpyxl.load_workbook(SRC, data_only=True)
    barbers = []
    vouches = []
    barber_id_counts = {}
    vouch_seq = 0

    sheets = ["Candidates", "Paris", "Lisbon", "Berlin",
              "London", "Sydney", "Toronto", "Amsterdam", "Madrid"]
    for sheet_name in sheets:
        ws = wb[sheet_name]
        rows = list(ws.iter_rows(min_row=2, values_only=True))
        for row in rows:
            if not row or not row[0]:
                continue
            (city, neighborhood, business, address, phone, rating, review_count,
             signal, notes, source, maps_link) = row[:11]
            city_meta = CITY_META.get(city)
            if not city_meta:
                continue
            city_key = city_meta["slug"]
            base_slug = slugify(f"{business}-{city_key}")
            n = barber_id_counts.get(base_slug, 0)
            barber_id_counts[base_slug] = n + 1
            barber_id = base_slug if n == 0 else f"{base_slug}-{n+1}"

            notes = notes or ""
            is_confirmed = signal in ("Medium", "High")
            hair_tags = guess_tags(notes, business) if is_confirmed else []
            languages = guess_languages(city_key, notes) if is_confirmed else [
                DEFAULT_LANGUAGE_BY_CITY[city_key]
            ]

            barbers.append({
                "id": barber_id,
                "name": business,
                "shopName": business,
                "citySlug": city_key,
                "cityName": city_meta["name"],
                "neighborhood": neighborhood,
                "address": address,
                "phone": phone,
                "hairTags": hair_tags,
                "languagesSpoken": languages,
                "signalStrength": signal,
                "isConfirmed": is_confirmed,
                "googleRating": rating,
                "googleReviewCount": review_count,
                "mapsLink": maps_link,
                "source": source,
                "ownerQuote": OWNER_QUOTES.get(barber_id),
            })

            if not is_confirmed:
                continue

            names = VOUCHER_NAMES[city_key]
            primary_tag = hair_tags[0]
            service_tags = [t for t in hair_tags if t in SERVICES]
            recommend_quote = make_recommend_quote(notes, primary_tag, service_tags)

            vouch_seq += 1
            v = {
                "id": f"v{vouch_seq}",
                "voucherId": names[vouch_seq % len(names)],
                "voucherType": "customer",
                "subjectId": barber_id,
                "tag": primary_tag,
                "sentiment": "recommend",
                "identityBadge": (vouch_seq % 3 == 0),
                "language": languages[-1] if len(languages) > 1 and languages[-1] not in ("English", "French", "Portuguese", "German") else languages[0],
                "quote": recommend_quote,
            }
            vouches.append(v)

            # occasional non-English flavor quote for Paris/Berlin high-signal spots
            if city_key == "paris" and signal == "High" and vouch_seq % 2 == 0:
                vouch_seq += 1
                vouches.append({
                    "id": f"v{vouch_seq}",
                    "voucherId": names[(vouch_seq + 1) % len(names)],
                    "voucherType": "customer",
                    "subjectId": barber_id,
                    "tag": primary_tag,
                    "sentiment": "recommend",
                    "identityBadge": True,
                    "language": "French",
                    "quote": QUOTE_TEMPLATES_FR[vouch_seq % len(QUOTE_TEMPLATES_FR)],
                })
            if city_key == "berlin" and signal == "High" and vouch_seq % 2 == 0:
                vouch_seq += 1
                vouches.append({
                    "id": f"v{vouch_seq}",
                    "voucherId": names[(vouch_seq + 1) % len(names)],
                    "voucherType": "customer",
                    "subjectId": barber_id,
                    "tag": primary_tag,
                    "sentiment": "recommend",
                    "identityBadge": True,
                    "language": "German",
                    "quote": QUOTE_TEMPLATES_DE[vouch_seq % len(QUOTE_TEMPLATES_DE)],
                })

            caution_text = make_caution(notes)
            if caution_text:
                vouch_seq += 1
                ct = caution_text.lower()
                if "colour" in ct or "color" in ct:
                    caution_tag = "Colour"
                elif "straighten" in ct or "chemical" in ct or "rebond" in ct:
                    caution_tag = "Straightening & rebonding"
                elif "perm" in ct:
                    caution_tag = "Perms"
                elif "curly" in ct:
                    caution_tag = "Curly"
                elif "western" in ct or "short cut" in ct:
                    caution_tag = "Fades & tapers"
                else:
                    caution_tag = primary_tag
                vouches.append({
                    "id": f"v{vouch_seq}",
                    "voucherId": names[(vouch_seq + 2) % len(names)],
                    "voucherType": "customer",
                    "subjectId": barber_id,
                    "tag": caution_tag,
                    "sentiment": "caution",
                    "identityBadge": False,
                    "language": "English",
                    "quote": caution_text,
                })

            # Occasionally promote a recommend vouch to an operator vouch, to demo
            # the operator mechanic (the gating rule isn't modeled statically here).
            # An operator vouches as a shop, so it needs a shop name and city —
            # and the "vouching as Asian" identity badge belongs to customers.
            if signal == "High" and vouch_seq % 5 == 0:
                others = [c["name"] for c in CITY_META.values() if c["slug"] != city_key]
                peer_city = others[vouch_seq % len(others)] if others else "another city"
                v["voucherType"] = "operator"
                v["voucherName"] = f"{names[(vouch_seq + 3) % len(names)]}'s shop"
                v["voucherCity"] = peer_city
                v["identityBadge"] = False
                v["quote"] = (
                    "I've sent regulars here when they're in town. They come back "
                    "happy, which is the only review that matters to me."
                )

    # Hand-picked personalization demo: make "Maison de MI Salon" (NYC, High signal)
    # the default "home barber" persona, and have it vouch (as an operator) for
    # Falali Hair Salon in Seattle — this is what lights up the
    # "vouched for by your NYC barber" banner on that profile.
    home_barber_id = next((b["id"] for b in barbers if b["name"] == "Maison de MI Salon (Korean Hair Salon)"), None)
    falali_id = next((b["id"] for b in barbers if "Falali" in b["name"]), None)
    if home_barber_id and falali_id:
        vouch_seq += 1
        vouches.append({
            "id": f"v{vouch_seq}",
            "voucherId": home_barber_id,
            "voucherType": "operator",
            "voucherName": "Maison de MI Salon",
            "voucherCity": "New York City",
            "subjectId": falali_id,
            "tag": "Thick & straight",
            "sentiment": "recommend",
            "identityBadge": False,
            "language": "English",
            "quote": "I sent a client here while they were traveling through Seattle — same care with thick, straight hair that we give in the chair here.",
        })

    out = {
        "cities": list(CITY_META.values()),
        "defaultHomeBarberId": home_barber_id,
        "barbers": barbers,
        "vouches": vouches,
    }
    with open(OUT, "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print(f"wrote {len(barbers)} barbers, {len(vouches)} vouches -> {OUT}")

if __name__ == "__main__":
    main()
