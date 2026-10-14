// Shot list for the site's still photography, generated with Nano Banana Pro on Higgsfield.
// Read by scripts/generate-stills.mjs (makes a take) and scripts/approve-still.mjs (puts it on the site).
//
// Every person wears Vis Naturæ pieces: `wear` lists product slugs, and each slug's packshot
// (public/products/<slug>.jpg + -detail.jpg) is sent as an image reference. `face` is an optional
// public image of a person to keep (the community portraits keep the athletes from the film); the
// pre-approval backup in stills-src/images-orig/ is used once the public file has been replaced.
// Prompts are plain scene descriptions: Higgsfield's filter refuses brand names and the word "polo".

// The look: a premium menswear label's seasonal editorial (Kith-style polish), set in Vis Naturæ places.
export const EDITORIAL =
  "Editorial menswear photograph for a premium clothing label's seasonal lookbook, shot on a medium format film camera, natural warm daylight, rich true-to-life colour, gentle film grain, relaxed confident posing, considered head-to-toe styling.";
// Product-page look: an on-model shot that sits next to the white packshots.
export const STUDIO =
  "Clean e-commerce photograph for a premium menswear shop: one male model on a seamless light grey studio backdrop, soft even studio light, full length from head to shoes with space above and below, standing relaxed and natural, calm expression, sharp focus on the clothing.";
// Socks: the same studio, cropped from the knee down so the ankle embroidery reads.
export const STUDIO_LEGS =
  "Clean e-commerce photograph for a premium menswear shop on a seamless light grey studio backdrop, soft even studio light: a close crop of one male model's lower legs from just above the knee down to the floor, standing relaxed with one foot a little forward and turned slightly so the outer side of the ankle faces the camera, sharp focus on the socks.";
// Sunglasses: the same studio, head and shoulders so the frame reads at true size.
export const STUDIO_FACE =
  "Clean e-commerce photograph for a premium menswear shop on a seamless light grey studio backdrop, soft even studio light: a head-and-shoulders portrait of one male model from the top of the head to mid chest, face turned a little to one side so the front of the frame and one arm both show, calm expression, sharp focus on the sunglasses. The sunglasses from the reference images reproduced exactly: the same slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round, same colour and translucency, same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized.";
export const GARMENT =
  "The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere.";
export const REAL = "Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.";
// People-free shots (`look: "still"`): empty landscapes and still lifes of the pieces.
export const STILL =
  "Editorial photograph for a premium menswear label's seasonal lookbook, shot on a medium format film camera, natural warm daylight, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.";

const C = "16:9"; // campaign block (cropped to 16:7 on desktop)
const T = "4:5"; // tiles, portraits, product pages

/** @type {Record<string, {out: string, aspect: string, size: [number, number], wear: string[], face?: string, family?: string, prompt: string, look?: string}>} */
export const SHOTS = {
  // ── Men landing page (/men, src/data/men.ts) ──────────────────────────────────────────────────
  // Hero plates: empty landscapes behind each slide's campaign card.
  "men-plate-collection": {
    out: "images/men/plate-collection.jpg", aspect: C, size: [2560, 1440], wear: [], look: "still",
    prompt:
      "An empty old black basalt harbour wall on the east coast of Mauritius at golden hour, a few blue and white wooden fishing pirogues moored on calm turquoise water, low sun raking across the stones, green mountains in the distance. Wide landscape, quiet and still.",
  },
  "men-plate-swim": {
    out: "images/men/plate-swim.jpg", aspect: C, size: [2560, 1440], wear: [], look: "still",
    prompt:
      "Le Morne mountain rising over a wide shallow turquoise lagoon in Mauritius just after dawn, glassy water, white sand and a line of casuarina trees in the foreground, soft pink and gold light. Wide landscape, quiet and still.",
  },
  "men-plate-linen": {
    out: "images/men/plate-linen.jpg", aspect: C, size: [2560, 1440], wear: [], look: "still",
    prompt:
      "Dappled shade under a large sea almond tree on a white sand beach in Mauritius at midday, the turquoise lagoon bright beyond, a weathered wooden table with two empty chairs and a white linen cloth in the shade. Wide landscape, quiet and still.",
  },
  "men-plate-knit": {
    out: "images/men/plate-knit.jpg", aspect: C, size: [2560, 1440], wear: [], look: "still",
    prompt:
      "A coastal golf links on a headland in Mauritius at dusk, a close-mown fairway running to the edge of black basalt rocks, the Indian Ocean deep blue beyond, long shadows, a single flag on a distant green. Wide landscape, quiet and still.",
  },
  // Category mosaic: a still life for Trousers, two tall portraits for Linen and Knitwear.
  "men-cat-trousers": {
    out: "images/men/cat-trousers.jpg", aspect: "1:1", size: [1500, 1500], look: "still",
    wear: ["quayside-chino-stone", "quayside-chino-navy", "quayside-chino-white", "quayside-chino-forest", "quayside-chino-tobacco", "quayside-chino-charcoal", "quayside-chino-black"],
    prompt:
      "A neat stack of seven folded chino trousers, one in each colour from the reference images, on an old teak table in a shuttered colonial room in Mauritius, warm side light through the louvres, the folded edges and waistbands facing the camera. Close, tactile still life.",
  },
  "men-cat-linen": {
    out: "images/men/cat-linen.jpg", aspect: "9:16", size: [1000, 2250],
    wear: ["riviera-linen-shirt-clementine", "veranda-linen-trouser-white"],
    prompt:
      "Full-length portrait of a Mauritian man of Indian descent in his late twenties walking barefoot along an old wooden jetty over turquoise water, wearing the clementine linen shirt open at the collar with the sleeves rolled and the white drawstring linen trousers, the sea and sky filling the frame behind him. Shot from the end of the jetty, the whole figure from head to feet with space above.",
  },
  "men-cat-knitwear": {
    out: "images/men/cat-knitwear.jpg", aspect: "9:16", size: [1000, 2250],
    wear: ["harbour-quarter-zip-navy", "quayside-chino-stone"],
    prompt:
      "Full-length portrait of a man in his early forties with a short grey-flecked beard leaning in the tall open doorway of an old colonial plantation house in Mauritius in late afternoon light, wearing the navy quarter-zip knit with the stone chinos and brown suede loafers, louvred green shutters and a wooden veranda around him. The whole figure from head to shoes.",
  },
  // Favourites band feature.
  "men-edit-hoodie": {
    out: "images/men/edit-hoodie.jpg", aspect: T, size: [1200, 1500],
    wear: ["cabana-hoodie-navy", "veranda-linen-trouser-oat"],
    prompt:
      "A Chinese-Mauritian man in his early thirties sits on the edge of a stone quay in a small fishing harbour in Mauritius at dusk, wearing the navy and white striped hoodie with the hood down and the oat linen drawstring trousers, wooden pirogues moored behind him, the sky turning pink over the water.",
  },

  // ── Homepage campaigns ────────────────────────────────────────────────────────────────────────
  "campaign-drop": {
    out: "images/campaign-drop.jpg", aspect: C, size: [2560, 1440],
    wear: ["harbour-quarter-zip-navy", "riviera-linen-shirt-oat", "mooring-stripe-crew-red-ecru", "lido-stripe-swim-short-saffron"],
    prompt:
      "Four friends in their late twenties to forties on an old black basalt harbour wall in Mauritius in late afternoon, wooden fishing boats and turquoise water behind them. One sits on a mooring bollard in the navy half-zip knit with cream trousers, one leans on the wall in the oat linen shirt with sleeves rolled, one stands in the red and ecru striped knit crewneck, one is barefoot in the saffron and white striped swim shorts. They are mid-conversation, laughing, not looking at the camera. Wide shot.",
  },
  "campaign-swim": {
    out: "images/campaign-swim.jpg", aspect: C, size: [2560, 1440],
    wear: ["tidal-swim-short-navy"],
    prompt:
      "A man in his early thirties walks out of a turquoise lagoon onto a white sand beach in Mauritius in the soft light just after dawn, a basalt mountain rising behind the bay, a wooden pirogue boat pulled up on the sand. He wears the navy swim shorts and nothing else, water running off him, hair pushed back. Wide shot with the whole figure small but clear in the frame.",
  },
  "campaign-linen": {
    out: "images/campaign-linen.jpg", aspect: C, size: [2560, 1440],
    wear: ["riviera-linen-shirt-sky", "riviera-linen-shirt-clementine"],
    prompt:
      "A candid moment late in a long lunch at a wooden table with a creased white cloth on the sand under a sea almond tree at the edge of a lagoon in Mauritius, dappled shade, the water behind slightly overexposed. Two clearly different men who do not look alike: one in his late forties, stocky, short greying hair and a few days of stubble, leans over to top up a glass in the sky blue linen shirt, sleeves rolled unevenly, with cream linen trousers; the other in his early thirties, lean, close-cropped dark hair, clean shaven, sits sideways on his chair in the clementine linen shirt, top buttons open, mid-sentence and turned away from the camera. The table is half finished: picked-over grilled fish, torn bread, squeezed lemon halves, crumpled napkins, a few wine glasses at different levels. Caught off-guard, slightly off-centre framing, like a frame from a reportage roll rather than a staged advert. Muted, natural colour, nothing oversaturated, no glossy retouching. Wide shot.",
  },
  "campaign-golf": {
    out: "images/campaign-golf.jpg", aspect: C, size: [2560, 1440],
    wear: ["mooring-stripe-crew-navy-ecru", "clubhouse-knit-jacket-sand"],
    prompt:
      "A seaside golf course in Mauritius at golden hour, the fairway running to the ocean. A golfer in the navy and ecru striped knit crewneck with cream pleated trousers holds his finish after a drive; his playing partner stands beside the bag in the sand-coloured knitted jacket, watching the ball. Long shadows, low warm sun. Wide shot.",
  },
  "campaign-atelier": {
    out: "images/campaign-atelier.jpg", aspect: C, size: [2560, 1440],
    wear: ["riviera-linen-shirt-red", "riviera-linen-shirt-sage", "harbour-quarter-zip-mustard"],
    prompt:
      "Inside a small sunlit tailoring workshop in Port Louis, Mauritius. A seamstress in her fifties guides red linen under an industrial sewing machine. Behind her a clothes rail holds finished pieces: the red linen shirt, the sage linen shirt and the mustard half-zip knit, on wooden hangers. Bolts of linen, paper patterns and shears on a long wooden table, afternoon light through tall shutters. Wide shot.",
  },

  // ── Shop category scenes and page images ─────────────────────────────────────────────────────
  "beach-surfer": {
    out: "images/beach-surfer.jpg", aspect: T, size: [1200, 1500],
    wear: ["lido-stripe-swim-short-sky", "riviera-linen-shirt-oat"],
    prompt:
      "A surfer in his late twenties walks along the waterline of a long empty beach in Mauritius at sunset, a surfboard under one arm, wearing the sky blue and white striped swim shorts and the oat linen shirt worn open and unbuttoned. Full length, wet sand reflecting the sky.",
  },
  "golf-green": {
    out: "images/golf-green.jpg", aspect: T, size: [1200, 1500],
    wear: ["harbour-quarter-zip-forest"],
    prompt:
      "A golfer crouches to read a putt on a green beside the ocean in Mauritius in late afternoon, wearing the forest green half-zip knit with cream trousers and white golf shoes, putter in hand. Full length, the flag and the sea behind him.",
  },
  summit: {
    out: "images/summit.jpg", aspect: T, size: [1200, 1500],
    wear: ["riviera-linen-shirt-navy"],
    prompt:
      "A man stands on a rocky mountain summit in Mauritius at sunrise above a sea of cloud, wearing the navy linen shirt with sleeves rolled and cream trousers, hands in pockets, looking out. Three-quarter view, the cloud layer glowing behind him.",
  },
  about: {
    out: "images/about.jpg", aspect: T, size: [1200, 1500],
    wear: ["riviera-linen-shirt-sage"],
    prompt:
      "A man in his early forties walks barefoot along a black basalt shoreline in the south of Mauritius in late afternoon, waves breaking white against the rocks behind him, wearing the sage green linen shirt with sleeves rolled and cream linen trousers rolled at the ankle, shoes in one hand, looking down at the path. Full length, warm low sun from the side.",
  },
  "caps-scene": {
    out: "images/caps-scene.jpg", aspect: T, size: [1200, 1500],
    wear: ["marram-cap-ecru-pine", "harbour-quarter-zip-navy"],
    prompt:
      "A man in his thirties sits on the edge of a weathered wooden jetty in Mauritius in morning light, wearing the ecru and pine green cap and the navy half-zip knit, cream trousers rolled at the ankle, coffee cup in hand. Three-quarter length, calm turquoise water behind.",
  },
  "numbered-label": {
    out: "images/numbered-label.jpg", aspect: "3:2", size: [1800, 1200],
    wear: ["mooring-stripe-crew-red-ecru"],
    prompt:
      "Close-up of two hands placing the folded red and ecru striped knit sweater into a plain cream cardboard box lined with white tissue paper, on a wooden workshop table in soft window light. Shallow depth of field.",
  },
  "cutting-table": {
    out: "images/cutting-table.jpg", aspect: T, size: [1200, 1500],
    wear: ["riviera-linen-shirt-sky"],
    prompt:
      "Close view of a tailor's hands cutting sky blue linen with heavy steel shears along a chalk line on a long wooden cutting table, brown paper pattern pieces and a finished sky blue linen shirt folded at the edge of the table, soft daylight from a window. Inside a small workshop in Mauritius.",
  },
  "sea-cliff-wide": {
    out: "images/sea-cliff-wide.jpg", aspect: "21:9", size: [2560, 1097],
    wear: ["ridge-knit-gilet-black"],
    prompt:
      "A wide landscape of high green sea cliffs above the Indian Ocean in the south of Mauritius at golden hour, surf breaking white below. A lone man stands near the cliff edge, small in the frame, wearing the black knitted gilet over a cream crewneck with stone trousers, looking out to sea.",
  },

  // ── About: a day in Mauritius, the life that made the brand ─────────────────────────────────
  "day-kite": {
    out: "images/day-kite.jpg", aspect: T, size: [1200, 1500],
    wear: ["lido-stripe-swim-short-saffron", "shore-swim-short-navy-ecru", "riviera-linen-shirt-oat"],
    prompt:
      "Morning on the beach at Le Morne in Mauritius, the basalt mountain rising behind a wide turquoise lagoon, a steady trade wind. Three friends in their late twenties and thirties get ready to kitesurf on the white sand: one kneels to untangle the lines of a kite laid out on the sand, bare-chested in the saffron and white striped swim shorts; one stands with a board under his arm in the navy and ecru two-tone swim shorts; one in the oat linen shirt worn open over swim shorts laughs as he holds the kite's bar. Behind them a fourth friend is already out on the water, riding small under a bright kite. Candid, mid-conversation, nobody looking at the camera. Full length, wide.",
  },
  "day-catamaran": {
    out: "images/day-catamaran.jpg", aspect: T, size: [1200, 1500],
    wear: ["cabana-linen-shirt-sky", "tidal-swim-short-papaya"],
    prompt:
      "Midday on a white sailing catamaran off the west coast of Mauritius, deep blue water and the green hills of the coast on the horizon. Friends in their thirties sit and lie on the taut net trampoline at the front of the boat: one in the sky blue and white wide-striped linen shirt, unbuttoned, leans forward and points; another, bare-chested in the papaya orange swim shorts, props himself up on his elbows to look. Just ahead of the bow two spinner dolphins arc out of the water, spray catching the sun. Candid and joyful, caught in the moment, nobody looking at the camera. Shot from the cabin roof looking forward over them to the dolphins.",
  },
  "day-reef": {
    out: "images/day-reef.jpg", aspect: T, size: [1200, 1500],
    wear: ["tidal-swim-short-red"],
    prompt:
      "Afternoon on the coral reef inside the lagoon at Blue Bay, Mauritius, photographed underwater. A snorkeller in his late twenties floats face down at the surface in a mask and snorkel, arms relaxed, wearing the red swim shorts, seen from slightly below and to the side. Below him a healthy reef of branching and table coral with small shoals of yellow and blue reef fish; sunlight falls through the clear turquoise water in rays and ripples. The underside of the surface and the bright sky show at the top of the frame.",
  },
  "day-sundowner": {
    out: "images/day-sundowner.jpg", aspect: T, size: [1200, 1500],
    wear: ["cabana-hoodie-oat", "riviera-linen-shirt-navy"],
    prompt:
      "Sunset at a beach bar on the sand at Flic en Flac on the west coast of Mauritius, the sun just gone below the sea, the sky orange and pink. A local DJ in his thirties plays records on decks under a thatched straw roof strung with warm festoon lights, nodding to the music. In the foreground friends stand with cocktails in hand, talking and laughing: one in the oat and white wide-striped hoodie with sleeves pushed up, one in the navy linen shirt with cream trousers. Barefoot on the sand, a few people dancing in the background. Candid and warm, nobody looking at the camera. Medium-wide shot.",
  },

  // ── Shop landing, edits and listing tiles (ralphlauren.com structure) ───────────────────────
  // `look: "women"` / `"mixed"` swap "menswear" in EDITORIAL for "womenswear" / nothing.
  "shop-hero": {
    out: "images/shop/hero.jpg", aspect: C, size: [2560, 1440], look: "mixed",
    wear: ["cabana-hoodie-clementine", "cabana-cap-clementine", "riviera-linen-shirt-sky", "veranda-linen-trouser-oat"],
    prompt:
      "Late afternoon on a long weathered wooden jetty running out over a turquoise lagoon at Le Morne, Mauritius, the basalt mountain behind, low golden sun. Two friends walk towards the camera along the jetty, relaxed, talking: a Mauritian woman of Indian heritage in her late twenties with long dark hair in the clementine and white wide-striped hoodie and the matching clementine and white striped cap, with white shorts and bare legs; and a man in his early thirties with short dark curly hair and a trimmed beard in the sky blue linen shirt, open at the collar, sleeves rolled, with oat drawstring linen trousers, barefoot. Wide shot, both full length but small enough to show the lagoon and the mountain.",
  },
  "shop-cabana": {
    out: "images/shop/cabana.jpg", aspect: T, size: [1200, 1500], look: "women",
    wear: ["cabana-hoodie-sky", "cabana-cap-sky"],
    prompt:
      "Morning at a quiet beach club in Mauritius: a row of canvas beach cabanas striped in white and pale blue on white sand, the lagoon behind. A Sino-Mauritian woman in her early thirties with a short dark bob sits sideways on a wooden sun lounger in front of one cabana, knees drawn up, coffee cup in hand, laughing at someone out of frame. She wears the sky blue and white wide-striped hoodie with sleeves pushed up, the matching sky blue and white striped cap, white linen shorts and bare feet. Full figure, vertical frame.",
  },
  "shop-badger": {
    out: "images/shop/badger.jpg", aspect: T, size: [1200, 1500],
    wear: ["corniche-linen-shirt-oat", "sett-cap-navy"],
    prompt:
      "Early morning on a painted wooden fishing pirogue moored in a calm bay on the east coast of Mauritius, mist on the hills behind. A Mauritian Creole man in his mid forties with a close-cut grey-flecked beard sits on the side of the boat coiling a rope, looking down at his hands. He wears the oat linen shirt with its small tone-on-tone embroidered badger on the chest, sleeves rolled, top buttons open, the navy cap exactly as in the reference with its small embroidered badger sitting low on the front panel just above the visor, no bigger than a thumbnail, and navy shorts. Three-quarter length, vertical frame, close enough that the chest embroidery reads.",
  },
  "shop-reef": {
    out: "images/shop/reef.jpg", aspect: C, size: [2560, 1440],
    wear: ["tidal-swim-short-lagoon"],
    prompt:
      "Underwater in the clear lagoon off the south coast of Mauritius, photographed just below the surface. A free-diver glides horizontally a metre above a wide healthy coral garden of table and branching corals, arms by his sides, wearing the lagoon blue swim shorts and no mask strap visible on the camera side. Shoals of small blue and yellow reef fish around him, sunlight falling through the water in moving rays, the silvery underside of the surface at the top of the frame. Wide shot, the reef filling most of the frame and the diver small in it.",
  },
  "shop-clubhouse": {
    out: "images/shop/clubhouse.jpg", aspect: T, size: [1200, 1500],
    wear: ["clubhouse-knit-jacket-navy-ecru", "mooring-stripe-crew-oat-ecru"],
    prompt:
      "Late afternoon on the veranda of an old colonial golf clubhouse in Mauritius, white columns, rattan chairs, the last fairway and the sea beyond. A white-haired man in his sixties with a tanned, lined face leans on the veranda rail with a glass of iced tea, looking out at the course. He wears the navy knitted jacket with ecru trim open over the oat and ecru striped knit crewneck, with cream pleated trousers and brown suede loafers. Full figure, vertical frame.",
  },
  "shop-rugby": {
    out: "images/shop/rugby.jpg", aspect: T, size: [1200, 1500],
    wear: ["breakwater-rugby-shirt-navy-ecru", "touchline-rugby-shirt-red-navy"],
    prompt:
      "Dusk on a wide beach in Mauritius, the sky pink and orange over the sea. Friends play a loose game of touch rugby on the hard wet sand, barefoot. In the foreground two clearly different men: a fair-skinned man in his late twenties with short sandy hair, clean shaven, runs with the ball tucked under his arm in the navy and ecru striped rugby shirt with stone shorts, while a Mauritian Creole man in his thirties with a shaved head and a short beard, in the red, white and navy rugby shirt, reaches to tag him. The other players are far behind and blurred, in plain white t-shirts. Motion, sand kicking up, candid. Vertical frame.",
  },
  "shop-trousers": {
    out: "images/shop/trousers.jpg", aspect: T, size: [1200, 1500],
    wear: ["quayside-chino-stone", "harbour-quarter-zip-navy"],
    prompt:
      "Mid-morning on the stone quay of the Port Louis waterfront in Mauritius, old warehouses and fishing boats behind, soft bright light. A North African man in his early thirties with short wavy dark hair walks along the quay with a paper bag of bread under his arm, mid-stride. He wears the stone cotton chino trousers, cuffed once at the ankle, the navy half-zip knit, and white leather sneakers. Full figure, vertical frame, the trousers' cut and drape clearly visible.",
  },
  "shop-grid-trousers": {
    out: "images/shop/grid-trousers.jpg", aspect: C, size: [2560, 1440],
    wear: ["esplanade-linen-trouser-navy", "riviera-linen-shirt-oat"],
    prompt:
      "Evening on the terrace of a restaurant by the sea at Grand Baie, Mauritius, candle lanterns on the tables, the bay deep blue behind. A Southern European man in his late thirties stands at the terrace rail with one hand in his pocket, talking to someone out of frame. He wears the navy tailored linen trousers with a pressed crease and the oat linen shirt tucked in, with brown leather loafers. Medium-wide shot, full length, the rest of the frame warm and quiet.",
  },
  "shop-grid-accessories": {
    out: "images/shop/grid-accessories.jpg", aspect: C, size: [2560, 1440], look: "women",
    wear: ["sett-cap-pink", "burrow-sock-white"],
    prompt:
      "Late morning on the wide wooden steps of an old colonial house veranda in Mauritius, shutters painted green, bougainvillea spilling over the rail. A Black woman in her late twenties with braids sits on the steps, elbows on her knees, smiling at someone out of frame. She wears the pink cap with its small embroidered badger low on the front, a white tee, stone shorts, and the white ribbed crew socks with the small tone-on-tone badger at the ankle, pulled up, with brown leather loafers. Medium-wide shot, the cap and socks both clearly visible.",
  },
  "shop-grid-sunglasses": {
    out: "images/shop/grid-sunglasses.jpg", aspect: C, size: [2560, 1440], look: "women",
    wear: ["alize-sunglasses-tortoise", "riviera-linen-shirt-oat"],
    prompt:
      "Midday on the deck of a white sailing catamaran off the west coast of Mauritius, deep blue sea and green hills behind. A Caucasian woman in her mid thirties with sun-streaked light brown hair blowing in the wind leans back against the mast, face turned towards the sun. She wears the tortoiseshell sunglasses from the reference images, a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round, at true size for her face, and the oat linen shirt open over a black swimsuit. Medium shot from the waist up, the frame clearly readable.",
  },

  // ── Women landing page (/women, src/data/women.ts) ────────────────────────────────────────────
  // Hero plates: empty landscapes behind each slide's campaign card.
  "women-plate-collection": {
    out: "images/women/landing/plate-collection.jpg", aspect: C, size: [2560, 1440], wear: [], look: "still",
    prompt:
      "An empty row of white and pale blue striped canvas beach cabanas on white sand at a quiet beach club in Mauritius in the early morning, wooden sun loungers in front, the turquoise lagoon beyond, soft low light. Wide landscape, quiet and still, no people.",
  },
  "women-plate-hoodies": {
    out: "images/women/landing/plate-hoodies.jpg", aspect: C, size: [2560, 1440], wear: [], look: "still",
    prompt:
      "An empty old stone harbour wall at Mahébourg in the south-east of Mauritius at dusk, painted wooden fishing pirogues moored on still water, the sky pink and lilac, hills dark in the distance. Wide landscape, quiet and still, no people.",
  },
  "women-plate-caps": {
    out: "images/women/landing/plate-caps.jpg", aspect: C, size: [2560, 1440], wear: [], look: "still",
    prompt:
      "The empty wooden veranda of an old colonial house in Mauritius in late morning, green louvred shutters, worn wooden steps, pink bougainvillea spilling over the rail, dappled sunlight on the boards. Wide landscape, quiet and still, no people.",
  },
  "women-plate-sunglasses": {
    out: "images/women/landing/plate-sunglasses.jpg", aspect: C, size: [2560, 1440], wear: [], look: "still",
    prompt:
      "The deep blue Indian Ocean off the west coast of Mauritius seen from the bow of a white sailing catamaran at midday, the taut net trampoline in the foreground, green hills on the horizon, bright sun glittering on the water. Wide landscape, quiet and still, no people.",
  },
  // Hero campaign cards (the caps and sunglasses slides use shop-grid-accessories and shop-grid-sunglasses).
  "women-campaign-collection": {
    out: "images/women/landing/campaign-collection.jpg", aspect: C, size: [2560, 1440], look: "women",
    wear: ["cabana-hoodie-navy", "cabana-cap-navy", "riviera-hoodie-sage", "marram-cap-ecru-sky"],
    prompt:
      "Morning at the end of a long wooden jetty at Grand Baie in Mauritius, sailing boats moored on the turquoise bay behind. Two friends sit on the edge of the jetty with their feet over the water, laughing at something one of them said: a Mauritian Creole woman in her late twenties with natural curls in the navy and white wide-striped hoodie and the matching navy and white striped cap; and a Spanish woman in her early thirties with long dark hair in the plain sage hoodie with its small tone-on-tone embroidered badger and the ecru and sky blue cap. White shorts, bare legs. Wide shot, both full figure.",
  },
  "women-campaign-hoodies": {
    out: "images/women/landing/campaign-hoodies.jpg", aspect: C, size: [2560, 1440], look: "women",
    wear: ["riviera-hoodie-red"],
    prompt:
      "Dusk on the stone harbour wall at Mahébourg in Mauritius, painted wooden pirogues on the still water behind, the sky pink. A woman in her mid forties with short silver hair and tanned skin sits on the wall with her knees drawn up and a mug of tea in her hands, looking out at the boats. She wears the plain red hoodie with its small tone-on-tone embroidered badger on the chest, sleeves pushed up, with cream linen trousers. Medium-wide shot, full figure.",
  },
  // Category mosaic: two tall portraits.
  "women-cat-caps": {
    out: "images/women/landing/cat-caps.jpg", aspect: "9:16", size: [1000, 2250], look: "women",
    wear: ["cabana-cap-clementine"],
    prompt:
      "Full-length portrait of a Mauritian woman of Indian heritage in her early twenties walking along the sunny waterfront promenade in Port Louis, palm trees and the harbour behind her, wearing the clementine and white striped cap with a plain white t-shirt, white linen shorts and brown leather sandals, a canvas tote on her shoulder. The whole figure from head to feet with space above.",
  },
  "women-cat-sunglasses": {
    out: "images/women/landing/cat-sunglasses.jpg", aspect: "9:16", size: [1000, 2250], look: "women",
    wear: ["alize-sunglasses-olive", "riviera-hoodie-oat"],
    prompt:
      "Full-length portrait of a Malagasy woman in her thirties with her hair tied up, standing barefoot on black basalt rocks at Gris Gris on the wild south coast of Mauritius, waves breaking white behind her, wind in her clothes. She wears the olive sunglasses from the reference images, a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round, at true size for her face, with the plain oat hoodie and white shorts. The whole figure from head to feet with space above.",
  },
  // The stories band: the badger pieces (settings kept clear of the existing women's lookbook: tea, boats).
  "women-story-badger": {
    out: "images/women/landing/story-badger.jpg", aspect: T, size: [1200, 1500], look: "women",
    wear: ["riviera-hoodie-navy", "sett-cap-navy", "burrow-sock-white"],
    prompt:
      "Early morning in the botanical garden at Pamplemousses, Mauritius, beside the great pond of giant water lilies, tall palms behind, soft hazy light. A Franco-Mauritian woman in her mid twenties with long dark blonde hair walks along the edge of the pond, smiling, wearing the plain navy hoodie with its small tone-on-tone embroidered badger on the chest, the navy cap with its small embroidered badger low on the front just above the visor, stone shorts, and the white ribbed crew socks pulled up with white leather sneakers. Full figure, vertical frame.",
  },
  // Favourites band feature and the New in tile.
  "women-edit-hoodie": {
    out: "images/women/landing/edit-hoodie.jpg", aspect: T, size: [1200, 1500], look: "women",
    wear: ["cabana-hoodie-pink"],
    prompt:
      "Late afternoon on the white sand of Île aux Cerfs, Mauritius, the shallow lagoon glittering behind. A Japanese woman in her thirties with a short black bob sits on an upturned wooden pirogue with her arms around her knees, looking out to sea, wearing the pink and white wide-striped hoodie with the hood down and white linen shorts. Three-quarter length, vertical frame.",
  },
  "women-new": {
    out: "images/women/landing/new.jpg", aspect: T, size: [1200, 1500], look: "women",
    wear: ["riviera-hoodie-sky", "marram-cap-ecru-sky"],
    prompt:
      "Morning at a small seaside café table on the sand at Trou d'Eau Douce, Mauritius, the lagoon pale turquoise behind. A woman in her fifties with grey-blonde shoulder-length hair and crow's feet laughs over a cup of coffee, wearing the plain sky blue hoodie with its small tone-on-tone embroidered badger and the ecru and sky blue cap. Three-quarter length, vertical frame.",
  },

  // ── Community portraits (the film's athletes, now in the clothes) ───────────────────────────
  ...community([
    ["p1", "rugby", ["breakwater-rugby-shirt-red-ecru"], "on a rugby pitch by the sea, a ball under his arm, in the red and ecru striped rugby shirt and navy shorts"],
    ["p2", "cycling", ["harbour-quarter-zip-red"], "beside his road bike on a quiet coastal road, in the red half-zip knit with stone shorts"],
    ["p3", "golf", ["mooring-stripe-crew-green-ecru"], "on a seaside fairway holding a club, in the green and ecru striped knit crewneck with cream trousers"],
    ["p4", "surf", ["tidal-swim-short-lagoon", "riviera-linen-shirt-sky"], "on a beach holding a surfboard, in the lagoon blue swim shorts and the sky blue linen shirt worn open"],
    ["p5", "kitesurf", ["shore-swim-short-pine-ecru", "riviera-linen-shirt-oat"], "on a windy beach with a kite on the sand behind him, in the pine and ecru swim shorts and the oat linen shirt worn open"],
    ["p6", "wakeboard", ["lido-stripe-swim-short-red"], "on a wooden jetty with a wakeboard, bare-chested in the red and white striped swim shorts"],
    ["p7", "skate", ["touchline-rugby-shirt-red-navy"], "at the lip of a concrete skate bowl, board at his feet, in the red, white and navy rugby shirt with cream trousers"],
    ["p8", "snowboard", ["clubhouse-knit-jacket-red-ecru"], "outside a mountain hut in the snow, board leaning on the wall, in the red and ecru knitted jacket"],
    ["p9", "downhill", ["harbour-quarter-zip-orange"], "on a forest trail beside his mountain bike, in the orange half-zip knit with olive trousers"],
    ["p10", "freeride", ["regatta-cardigan-navy-ecru"], "on a wooden chalet terrace with skis behind him, in the navy knitted cardigan with ecru trim over a white tee"],
    ["p11", "trail", ["pavilion-cable-vest-navy"], "on a mountain trail above the sea, in the navy cable knit vest over a white tee"],
    ["p12", "climbing", ["riviera-linen-shirt-clementine"], "at the foot of a sea cliff with a chalk bag on his hip, in the clementine linen shirt with sleeves rolled and stone trousers"],
  ]),

  // ── On-model product shots (one model per design, kept across its colourways) ──────────────
  ...onModel("marram-cap", ["beige", "ecru-pine", "ecru-red", "red", "mustard-navy", "ecru", "ecru-navy", "ecru-pink", "ecru-beige", "ecru-yellow", "ecru-orange", "ecru-black", "ecru-sky"],
    "a man around thirty with short dark curly hair and light stubble, wearing the cap with a plain white t-shirt, cream trousers and white sneakers"),
  ...onModel("sett-cap", ["navy", "pine", "red", "pink", "beige", "yellow", "orange", "black", "sky"],
    "a Black man in his early forties with a shaved head and a short greying beard, wearing the cap straight on with a plain light grey marl t-shirt, cream trousers and white leather sneakers"),
  ...onModel("cabana-cap", ["navy", "oat", "sky", "sage", "red", "clementine", "yellow", "pink", "black"],
    "a Lebanese man in his early thirties with a neatly kept full dark beard and short dark hair, wearing the striped cap straight on with a plain white t-shirt, the stone chinos and white canvas sneakers"),
  ...onModel("tidal-swim-short", ["navy", "saffron", "red", "hibiscus", "lagoon", "palm", "papaya"],
    "an athletic swimmer-build man in his late twenties with sun-bleached brown hair, bare-chested and barefoot, wearing the swim shorts"),
  ...onModel("shore-swim-short", ["pine-ecru", "red-ecru", "navy-ecru", "pink-ecru", "beige-ecru", "yellow-ecru", "orange-ecru", "black-ecru", "sky-ecru"],
    "a lean Black man around thirty with close-cropped hair, bare-chested and barefoot, wearing the swim shorts"),
  ...onModel("riviera-linen-shirt", ["oat", "sky", "navy", "sage", "red", "clementine", "yellow", "pink", "black"],
    "a man in his mid thirties with sandy hair, wearing the linen shirt with sleeves rolled once and the top button open, cream linen trousers and tan suede loafers"),
  // The other Corniche colourways were shot as the first Riviera; same model (stills-src/models/corniche-linen-shirt.png).
  ...onModel("corniche-linen-shirt", ["black", "yellow", "pink"],
    "a man in his mid thirties with sandy hair, wearing the linen shirt with sleeves rolled once and the top button open, cream linen trousers and tan suede loafers"),
  ...onModel("cabana-linen-shirt", ["sky", "oat", "navy", "sage", "red", "clementine", "yellow", "pink", "black"],
    "a Southern European man in his late twenties with thick dark wavy hair and light stubble, wearing the striped linen shirt with sleeves rolled to the forearm and the top two buttons open, tucked into white pleated trousers, with tan suede loafers"),
  ...onModel("harbour-quarter-zip", ["navy", "forest", "red", "mustard", "sky", "orange", "black", "oat", "sage", "clementine", "yellow", "pink"],
    "an East Asian man in his early thirties with neat black hair, wearing the half-zip knit zipped halfway with the chinos and white sneakers"),
  ...onModel("cabana-hoodie", ["navy", "oat", "sky", "sage", "red", "clementine", "yellow", "pink", "black"],
    "a Mauritian man of Creole heritage in his mid twenties with short tight curls, a thin moustache and a lean build, wearing the striped hooded sweatshirt with the hood down and the drawcords hanging evenly, with the oat drawstring linen trousers and white canvas sneakers"),
  ...onModel("riviera-hoodie", ["oat", "sky", "navy", "sage", "red", "clementine", "yellow", "pink", "black"],
    "a lean man in his early fifties with short silver hair, a tanned clean-shaven face and laugh lines, wearing the plain hooded sweatshirt with the hood down and the drawcords hanging evenly, with the stone chinos and white canvas sneakers"),
  ...onModel("regatta-cardigan", ["navy-ecru", "forest-ecru", "burgundy-ecru", "black-ecru"],
    "a man in his mid forties with salt-and-pepper hair and a short beard, wearing the knitted cardigan buttoned over a white t-shirt, the chinos and brown loafers"),
  ...onModel("pavilion-cable-vest", ["navy", "oat", "sky", "sage", "red", "clementine", "yellow", "pink", "black"],
    "a South Asian man in his late twenties with short dark hair, wearing the cable knit vest over a white oxford shirt, the chinos and brown loafers"),
  ...onModel("mooring-stripe-crew", ["navy-ecru", "red-ecru", "green-ecru", "navy-yellow", "oat-ecru", "sky-ecru", "sage-ecru", "clementine-ecru", "yellow-ecru", "pink-ecru", "black-ecru"],
    "a man around thirty with curly dark hair and warm brown skin, wearing the striped knit crewneck with the chinos and white sneakers"),
  ...onModel("clubhouse-knit-jacket", ["red-ecru", "ecru-red", "sand", "oat-ecru", "sky-ecru", "navy-ecru", "sage-ecru", "clementine-ecru", "yellow-ecru", "pink-ecru", "black-ecru"],
    "a man in his late thirties with short dark hair and a trimmed beard, wearing the knitted jacket zipped open over a white t-shirt, the chinos and white sneakers"),
  ...onModel("ridge-knit-gilet", ["black", "oat"],
    "a tall blond man in his early thirties, wearing the knitted gilet over a cream crewneck sweater with the chinos and brown boots"),
  ...onModel("breakwater-rugby-shirt", ["red-ecru", "oat-ecru", "sky-ecru", "navy-ecru", "sage-ecru", "clementine-ecru", "yellow-ecru", "pink-ecru", "black-ecru"],
    "a broad-shouldered Pacific Islander man in his late twenties, wearing the rugby shirt untucked with the chinos and white sneakers"),
  ...onModel("touchline-rugby-shirt", ["red-navy", "oat-navy", "sky-navy", "navy-white", "sage-navy", "clementine-navy", "yellow-navy", "pink-navy", "black-white"],
    "a man in his late twenties with short red-brown hair and freckles, wearing the rugby shirt untucked with the chinos and white sneakers"),
  ...onModel("lido-stripe-swim-short", ["saffron", "red", "sky", "pink", "green", "orange", "black", "oat", "navy", "sage", "clementine", "yellow"],
    "a Latin American man around thirty with dark wavy hair, bare-chested and barefoot, wearing the striped swim shorts"),
  ...onModel("esplanade-linen-trouser", ["oat", "ecru", "navy", "black"],
    "a man in his early forties with olive skin, short dark hair greying at the temples and a neat beard, wearing the tailored trousers with a white linen shirt tucked in, a brown leather belt and tan suede loafers"),
  ...onModel("veranda-linen-trouser", ["oat", "navy", "white", "black", "red", "green"],
    "a Black man in his mid twenties with short twists, wearing the drawstring linen trousers with a plain white t-shirt tucked in at the front so the drawcord waist shows, and brown leather sandals"),
  ...onModel("quayside-chino", ["stone", "navy", "white", "forest", "tobacco", "charcoal", "black"],
    "a North African man in his early forties with close-cropped greying hair and a trimmed salt-and-pepper beard, wearing the chinos with the knitwear from the reference images on top, a brown leather belt and brown suede loafers"),
};
// The oat take is this design's model reference and pulls the ecru towards beige.
SHOTS["esplanade-linen-trouser-ecru"].prompt += " The trousers are a very pale off-white ecru, almost as light as the shirt, not beige.";
// Socks are shot from the knee down (STUDIO_LEGS in generate-stills.mjs).
for (const [id, shot] of Object.entries(onModel("burrow-sock", ["white", "black", "beige", "brown", "navy", "grey", "olive"],
  "a man with light brown skin and a little leg hair, wearing the socks pulled up to full crew length with stone cotton shorts ending just above the knee and plain white leather tennis sneakers")))
  SHOTS[id] = { ...shot, look: "legs" };
// Sunglasses are shot head and shoulders (STUDIO_FACE), worn with the oat Riviera shirt (refs: sunglasses, then shirt).
for (const [id, shot] of Object.entries(onModel("alize-sunglasses", ["tortoise", "black", "blue", "olive"],
  "a ruggedly handsome Caucasian man in his early forties with lightly tanned skin, light blue eyes, a strong jaw and a short full stubble beard, and thick, full, dark brunette hair with a full hairline, worn long enough to reach the shirt collar at the back, slicked straight back off the forehead with volume and a little shine, the ends curling out behind the ears at the nape, wearing the sunglasses with the oat linen shirt, top two buttons open")))
  SHOTS[id] = { ...shot, look: "face", wear: [...shot.wear, "riviera-linen-shirt-oat"] };

// Chinos are shot with one of the knits on top, so the knit is worn too (refs: chino, then knit).
for (const [c, knit] of [["stone", "harbour-quarter-zip-navy"], ["navy", "mooring-stripe-crew-red-ecru"], ["white", "regatta-cardigan-navy-ecru"], ["forest", "clubhouse-knit-jacket-sand"], ["tobacco", "mooring-stripe-crew-navy-ecru"], ["charcoal", "pavilion-cable-vest-navy"], ["black", "harbour-quarter-zip-mustard"]]) {
  SHOTS[`quayside-chino-${c}`].wear.push(knit);
}
SHOTS["quayside-chino-charcoal"].prompt += " The cable knit vest is worn over a white oxford shirt.";
SHOTS["quayside-chino-white"].prompt += " The cardigan is buttoned over a white t-shirt. The chinos are off-white, as pale as the trouser reference image, not beige or stone.";
// The Regatta's model reference wears the earlier ecru-body cardigan and pulls the body back to ecru.
for (const [c, colour] of [["navy", "deep navy"], ["forest", "deep forest green"], ["burgundy", "deep burgundy"], ["black", "true black"]])
  SHOTS[`regatta-cardigan-${c}-ecru`].prompt += ` The cardigan body and sleeves are ${colour} knit, not ecru; only the V-neck placket, the two sleeve bars and the chest script are ecru.`;
// Knitwear is worn with the Quayside chino (refs: knit, then chino), in a colour picked to contrast with the
// top's main colour; the Touchline's navy hem takes stone.
const CHINO_UNDER = { oat: "charcoal", sky: "navy", navy: "stone", sage: "white", red: "stone", clementine: "navy", yellow: "navy", pink: "charcoal", black: "stone", forest: "stone", green: "stone", mustard: "charcoal", orange: "white", sand: "navy", ecru: "navy", burgundy: "stone" };
for (const family of ["harbour-quarter-zip", "regatta-cardigan", "pavilion-cable-vest", "mooring-stripe-crew", "clubhouse-knit-jacket", "ridge-knit-gilet", "breakwater-rugby-shirt", "touchline-rugby-shirt"]) {
  for (const [id, shot] of Object.entries(SHOTS).filter(([id, s]) => s.family === family)) {
    const c = id.slice(family.length + 1);
    const chino = family === "touchline-rugby-shirt" ? "stone" : CHINO_UNDER[c.split("-")[0]];
    shot.wear.push(`quayside-chino-${chino}`);
    shot.prompt = shot.prompt.replace("the chinos", `the ${chino} chinos`);
  }
}
SHOTS["pavilion-cable-vest-black"].prompt += " The vest is true jet black cable knit with ecru stripes at the V-neck, not navy.";
// The plain hoodies are worn with the stone Quayside chino (refs: hoodie, then chino).
for (const c of ["sky", "navy", "sage", "red", "clementine", "yellow", "pink", "black"]) SHOTS[`riviera-hoodie-${c}`].wear.push("quayside-chino-stone");
// The oat hoodie is worn with the oat Veranda linen trouser instead (the approved take was edited to swap them).
SHOTS["riviera-hoodie-oat"].wear.push("veranda-linen-trouser-oat");
SHOTS["riviera-hoodie-oat"].prompt = SHOTS["riviera-hoodie-oat"].prompt.replace("the stone chinos", "the oat drawstring linen trousers");
// The Cabana caps are worn with the stone Quayside chino too (refs: cap, then chino).
for (const c of ["navy", "oat", "sky", "sage", "red", "clementine", "yellow", "pink", "black"]) SHOTS[`cabana-cap-${c}`].wear.push("quayside-chino-stone");
// The navy take is this design's model reference and turns the oat and black caps navy.
SHOTS["cabana-cap-oat"].prompt += " The cap is warm oat beige and white stripes with a solid oat beige visor and oat VN script, exactly like the cap reference image; nothing on the cap is navy.";
SHOTS["cabana-cap-black"].prompt += " The cap is true jet black and white stripes with a solid black visor and black VN script, exactly like the cap reference image; nothing on the cap is navy.";
// The Cabana caps were then reshot on the swim models: each approved take is that swim short's approved shot with the cap added.
// Lido stripes where a matching colour exists, otherwise the Shore colour-block.
const CABANA_CAP_SWIM = { clementine: "lido-stripe-swim-short-orange", sky: "lido-stripe-swim-short-sky", red: "lido-stripe-swim-short-red", pink: "lido-stripe-swim-short-pink", yellow: "lido-stripe-swim-short-saffron", sage: "lido-stripe-swim-short-green", oat: "shore-swim-short-beige-ecru", navy: "shore-swim-short-navy-ecru", black: "shore-swim-short-black-ecru" };
for (const [c, swim] of Object.entries(CABANA_CAP_SWIM)) {
  SHOTS[`cabana-cap-${c}`].wear = [`cabana-cap-${c}`, swim];
  SHOTS[`cabana-cap-${c}`].prompt = `${SHOTS[swim].prompt.replace(/, wearing the (striped )?swim shorts\.$/, "")}, wearing the striped cap straight on with the swim shorts.`;
}
// Leo then put every cap with the matching Shore Swim Short: the approved takes keep the Lido model and cap and
// only replace the shorts (clementine t5, sky t3, red t3, pink t5, yellow t3, sage t3); black is back on its take 3.
const CABANA_CAP_SHORE = { clementine: "orange", sky: "sky", red: "red", pink: "pink", yellow: "yellow", sage: "pine", oat: "beige", navy: "navy", black: "black" };
for (const [c, shore] of Object.entries(CABANA_CAP_SHORE)) SHOTS[`cabana-cap-${c}`].wear = [`cabana-cap-${c}`, `shore-swim-short-${shore}-ecru`];
// The Cabana hoodies were reshot the same way on the Shore model, barefoot in the same matching Shore short:
// each approved take is that Shore shot with only the hoodie added (refs: hoodie, then shorts).
for (const [c, shore] of Object.entries(CABANA_CAP_SHORE)) {
  const swim = `shore-swim-short-${shore}-ecru`;
  SHOTS[`cabana-hoodie-${c}`].wear = [`cabana-hoodie-${c}`, swim];
  SHOTS[`cabana-hoodie-${c}`].prompt = `${SHOTS[swim].prompt.replace(/, bare-chested and barefoot, wearing the swim shorts\.$/, "")}, barefoot, wearing the striped hooded sweatshirt with the hood down and the drawcords hanging evenly, with the swim shorts.`;
}
// The navy hoodie pulls the black towards navy.
SHOTS["cabana-hoodie-black"].prompt += " The hoodie is true black and white stripes with black ribbed cuffs and hem, not navy.";
// The Lemon Lido drifts towards saffron on the model (the saffron take is this design's model reference);
// approved take 3 is the approved oat take with only the shorts recoloured to Lemon.
SHOTS["lido-stripe-swim-short-yellow"].prompt += " The stripes are a pale soft lemon yellow, exactly as light as the reference image, much lighter than saffron or gold.";
function community(rows) {
  return Object.fromEntries(
    rows.map(([id, sport, wear, scene]) => [
      id,
      {
        out: `community/${id}.jpg`, aspect: T, size: [1080, 1350], wear,
        face: `community/${id}.jpg`,
        prompt: `Portrait of the ${sport} athlete from the first reference image, same face, same build, same skin and hair, standing still and looking calmly into the lens after a session, ${scene}. Natural light outdoors in Mauritius, waist-up to three-quarter length.`,
      },
    ]),
  );
}

function onModel(family, colours, casting) {
  return Object.fromEntries(
    colours.map((c) => [
      `${family}-${c}`,
      { out: `products/${family}-${c}-model.jpg`, aspect: T, size: [1200, 1500], wear: [`${family}-${c}`], family, look: "studio", prompt: `${casting}.` },
    ]),
  );
}
