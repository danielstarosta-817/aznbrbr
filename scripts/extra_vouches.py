"""
Hand-written sample vouches, layered on top of the ones derived from the seed
spreadsheet.

ALL OF THIS IS FICTIONAL. No real customer wrote any of it and no real barber
said any of it. It exists so the prototype has enough depth to show what the
product feels like at density — specifically the split score, which is the whole
premise and which looks like nothing when every shop has a single vouch sitting
at a flat 100%.

The point being demonstrated: a shop can be genuinely excellent at the hair it
knows and mediocre at hair it doesn't, and a single blended star rating hides
exactly that. So these deliberately produce lopsided tag-scoped scores — high on
thick/straight, patchy on curly or on Western-style fades — because that split
IS the product's argument, and the joke rides on top of real structure rather
than replacing it.

Format per entry: (voucher, tag, sentiment, language, quote, identity_badge)
"""

EXTRA_VOUCHES = {
    # ---- Seattle -----------------------------------------------------------
    "falali-hair-salon-seattle": [
        ("Grace", "Thick & straight", "recommend", "English",
         "Third time back. She takes weight out without thinning it into that fluffy mess everyone else leaves me with.", True),
        ("Terrence", "Curly", "caution", "English",
         "I'm mixed and my hair curls when it's short. She was lovely about it but clearly guessing — ended up uneven at the back.", False),
        ("Yuki", "Thick & straight", "recommend", "Mandarin",
         "Booked because my mum has gone here for eleven years. Now I understand the loyalty.", True),
        ("Marcus", "Fades & tapers", "caution", "English",
         "Asked for a mid fade and got something closer to a bowl with opinions. Great cut, wrong request.", False),
        ("Josh", "Fades & tapers", "recommend", "English",
         "Fade was fine, honestly. Not the sharpest I've had but nobody at work noticed anything wrong.", False),
        ("Dylan", "Curly", "recommend", "English",
         "Wavy-to-curly and she did better than expected. Wouldn't call it her specialty but I'd go back.", True),
    ],
    "j-hair-salon-seattle": [
        ("Danny", "Thick & straight", "recommend", "English",
         "Asked for the standard Asian men's short cut and he just nodded. No twenty questions. Done in half an hour.", True),
        ("Sang-woo", "Thick & straight", "recommend", "Korean",
         "He noticed my crown sits weird and adjusted for it without me saying anything. That's the whole job.", True),
        ("Priya", "Wavy", "caution", "English",
         "My hair is wavy and thick and he treated it like it was straight. Fine for a month, then it went triangular.", False),
    ],
    "salon-206-seattle": [
        ("Linh", "Coarse & dense", "recommend", "Vietnamese",
         "Family-run, and it shows — the aunty running it has done this for decades and has zero patience for nonsense.", True),
        ("Ben", "Thick & straight", "recommend", "English",
         "Cheapest good haircut I've had in this city and it wasn't close.", False),
    ],

    # ---- New York ----------------------------------------------------------
    "maison-de-mi-salon-korean-hair-salon-nyc": [
        ("Jonathan", "Thick & straight", "recommend", "English",
         "Came in after four years of telling barbers 'no, shorter on top but not like that'. She got it in one.", True),
        ("Mei", "Perms", "recommend", "Korean",
         "Got a soft perm that actually looked intentional. My coworkers thought I'd just started sleeping better.", True),
        ("Rachel", "Fine & straight", "recommend", "English",
         "My hair is stubbornly flat. This is the first cut that's had any movement in it since school.", False),
        ("Aaron", "Curly", "caution", "English",
         "Half-Korean, half-Puerto Rican, and my hair does what it wants. They were honest that it isn't their thing, which I respected — but I did leave with a mullet I didn't ask for.", True),
        ("Kenji", "Colour", "caution", "English",
         "The cut is worth the price. The colour was not — went ashy and patched within two weeks.", False),
        ("Hana", "Colour", "recommend", "Korean",
         "Colour came out well for me, for what it's worth. Maybe I got lucky, maybe I asked for something simpler.", True),
        ("Nadia", "Curly", "recommend", "English",
         "Loose curls, decent result. She was upfront that it isn't what she does most days.", False),
    ],
    "a-cutz-barbershop-nyc": [
        ("Wei", "Fine & straight", "recommend", "Mandarin",
         "Brought my son whose hair is fine and flops everywhere. First barber who didn't just buzz it and give up.", True),
        ("Danny", "Kids cuts", "recommend", "English",
         "He kept my kid entertained for the entire cut, which is frankly a bigger skill than the haircut.", False),
    ],
    "barberking-unisex-barbershop-nyc": [
        ("Andre", "Cowlicks & crowns", "recommend", "English",
         "My hair grows in three directions off one crown. He mapped it out loud like a man reading a weather chart, then fixed it.", True),
        ("Sophia", "Thick & straight", "recommend", "English",
         "Walk-in on a Saturday, twenty minute wait, best fifteen dollars I've spent.", False),
        ("Tom", "Curly", "caution", "English",
         "Straight hair, they're excellent. My curly friend went on my recommendation and did not thank me for it.", False),
    ],

    # ---- Berlin ------------------------------------------------------------
    "liyong-friseursalon-chinese-named-berlin": [
        ("Chau", "Thick & straight", "recommend", "Mandarin",
         "The owner told me my previous barber should be ashamed. He was right and I have not gone back to them.", True),
        ("Anh", "Coarse & dense", "recommend", "German",
         "Twenty-two euros, twenty-five minutes, no conversation about my holiday plans. Perfect.", True),
        ("Felix", "Fades & tapers", "caution", "German",
         "Genuinely brilliant with Chinese hair. I asked for a European-style short back and sides and it was not his finest hour.", False),
        ("Lukas", "Fine & straight", "caution", "German",
         "Mine is fine and German and he clearly found it boring. Serviceable, not inspired.", False),
        ("Jonas", "Fades & tapers", "recommend", "German",
         "Got a taper and it was completely fine. Everyone warned me off and I think they oversold the problem.", False),
        ("Maximilian", "Fine & straight", "recommend", "German",
         "Straightforward cut, straightforward price, no attempt to sell me anything. I'll take it.", False),
    ],
    "huong-hiep-toc-berlin": [
        ("Mai", "Thick & straight", "recommend", "Vietnamese",
         "Inside the Dong Xuan Center, past the phone repair place. Worth the trek — no premium for thick hair, unlike everywhere in Mitte.", True),
        ("Nina", "Coarse & dense", "recommend", "Vietnamese",
         "She fixed a cut a Prenzlauer Berg salon charged me sixty euros to ruin.", True),
        ("Jonas", "Thick & straight", "recommend", "German",
         "Bring cash and bring patience for the parking. Everything else is easy.", False),
    ],
    "nina-berlin": [
        ("Aiko", "Fine & straight", "recommend", "Japanese",
         "Asked for a Japanese-style short bob and got exactly that, not a European approximation of it.", True),
        ("Sarah", "Wavy", "recommend", "German",
         "Slight natural wave that most stylists flatten. She cut with it instead of against it.", False),
    ],

    # ---- Sydney ------------------------------------------------------------
    "kim-sun-young-hair-sydney": [
        ("Amy", "Thick & straight", "recommend", "Korean",
         "Been going to their Strathfield branch for years. Consistent in a way that sounds boring until you've had a bad haircut abroad.", True),
        ("Jack", "Thick & straight", "recommend", "English",
         "Massive place, runs like a machine, somehow still feels personal.", False),
        ("Chloe", "Colour", "caution", "English",
         "Cut, yes. Colour, no — I went in for ash brown and came out with a shade I'd describe as 'unresolved'.", False),
    ],
    "dnk-hair-sydney": [
        ("Yuna", "Thick & straight", "recommend", "Korean",
         "Thirty years in Eastwood and it shows. He cut my hair while telling me about Itaewon in the eighties.", True),
        ("David", "Fades & tapers", "recommend", "English",
         "Surprisingly good fade for a salon that mostly does perms.", False),
    ],

    # ---- Paris -------------------------------------------------------------
    "jacques-philippe-coiffure-paris": [
        ("Trung", "Thick & straight", "recommend", "French",
         "He has been cutting hair on this street for longer than I have been alive, and he cuts thick hair like it's nothing.", True),
        ("Camille", "Fine & straight", "recommend", "French",
         "Not fashionable. Extremely competent. I'll take that trade every time.", False),
        ("Marc", "Curly", "caution", "French",
         "My hair is properly curly and he cut it dry like it was straight. It looked fine wet, which is not the goal.", False),
    ],
    "rvb-coiffure-paris": [
        ("Linh", "Thick & straight", "recommend", "French",
         "Old-school Vietnamese barbershop energy — hot towel, no music, total silence. I loved it.", True),
        ("Thomas", "Coarse & dense", "recommend", "Mandarin",
         "Someone thanked the barber in Chinese while I was waiting and he answered without looking up. Good sign.", True),
    ],
    "sakura-coiffure-paris": [
        ("Sophie", "Thick & straight", "recommend", "French",
         "She speaks four languages and used three of them during my appointment. The cut was also excellent.", False),
        ("Trung", "Perms", "recommend", "French",
         "Soft perm, no damage, and she talked me out of the more aggressive one I originally asked for.", True),
    ],

    # ---- Lisbon ------------------------------------------------------------
    "shane-s-hairstudio-asian-lisbon": [
        ("Wei", "Thick & straight", "recommend", "Mandarin",
         "Found it because the sign literally says Asian. Stayed because he's the only person in Lisbon who's got my hair right.", True),
        ("Rui", "Perms", "recommend", "Portuguese",
         "Down perm that didn't destroy my hair. In this city that's practically a miracle.", True),
        ("Ana", "Curly", "caution", "Portuguese",
         "He was upfront that curly isn't his specialty. Booked anyway, my mistake not his.", False),
    ],

    # ---- Chicago -----------------------------------------------------------
    "park-jun-korean-hair-salon-chicago": [
        ("Grace", "Straightening & rebonding", "recommend", "Korean",
         "Straight perm came out soft, not flat. Ask for the senior stylist and it's a different experience entirely.", True),
        ("Ken", "Thick & straight", "recommend", "English",
         "Genuinely inconsistent depending who you get. When it's good it's the best in the metro area.", False),
        ("Alex", "Thick & straight", "caution", "English",
         "Got a junior stylist on a Saturday and left with a shelf at the back. Ask who you're booking with.", False),
    ],
    "salon-dorothy-inside-h-mart-chicago": [
        ("Minh", "Thick & straight", "recommend", "Korean",
         "It's inside an H Mart. You can get a perm and buy groceries. I don't know why this isn't the standard everywhere.", True),
        ("Sarah", "Perms", "recommend", "English",
         "Cheaper than downtown by half and better than the last three places I tried.", False),
    ],

    # ---- London ------------------------------------------------------------
    "the-fountain-hair-korean-hair-salon-london": [
        ("Minji", "Thick & straight", "recommend", "Korean",
         "Worth the trip to New Malden. The whole high street is Korean and this is the one people actually queue for.", True),
        ("Kevin", "Fine & straight", "recommend", "English",
         "Fine, flat, hopeless hair. She gave it shape without a single product I'd need to buy.", False),
        ("James", "Fades & tapers", "caution", "English",
         "Superb with Korean styles. My skin fade was, generously, a work in progress.", False),
        ("Daniel", "Fades & tapers", "recommend", "English",
         "Fade was solid. I think you just have to be specific about the guard number rather than assuming.", False),
    ],
    "f4fade-london": [
        ("Tom", "Fades & tapers", "recommend", "English",
         "Does Afro, European and Asian hair and doesn't act like any of them is the hard one.", False),
        ("Grace", "Cowlicks & crowns", "recommend", "English",
         "Double crown, fifteen years of bad haircuts, sorted in one sitting.", True),
    ],

    # ---- Amsterdam ---------------------------------------------------------
    "mensplace-barbershop-barber-ogun-amsterdam": [
        ("Duc", "Thick & straight", "recommend", "Dutch",
         "Ogun has cut every texture that's walked into that shop since 2016 and it shows the second he starts.", True),
        ("Lars", "Coarse & dense", "recommend", "Dutch",
         "Booked on a friend's word, went back three weeks later. Same cut, same quality, no drama.", False),
        ("Sanne", "Curly", "recommend", "Dutch",
         "Rare to find someone equally unbothered by coily hair and by mine.", False),
    ],
}
