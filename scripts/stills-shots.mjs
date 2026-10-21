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
// The women's line's product pages: the same studio with one female model (look "studio-w").
export const STUDIO_W =
  "Clean e-commerce photograph for a premium womenswear shop: one female model on a seamless light grey studio backdrop, soft even studio light, full length from head to feet with space above and below, standing relaxed and natural, calm expression, sharp focus on the clothing.";
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
// Wildlife shots (`look: "wild"`): the real honey badger on Origins (Leo, 2026-10-21: "confronting predators and in the wild").
export const WILD =
  "Wildlife photograph taken on a long telephoto lens, nothing between the camera and the animal, natural light, true-to-life colour, fine detail in the fur, shallow depth of field, photographic realism, no CGI look, no illustration. A real honey badger (ratel): stocky, low to the ground, black below with a broad grey-white mantle from the crown of the head along the back to the tail, small eyes, short legs with long claws. No people anywhere in the frame.";
// Product pages at the Ralph Lauren / Nude Project standard (Leo, 2026-10-15, references in "Model examples/"):
// model-grade casting, posed and styled, in a high-end setting per design (`look: "set"` / `"set-w"`, SETTINGS below)
// that could be southern Europe or Mauritius. `{setting}` is filled from the shot.
export const MODEL_STANDARD =
  "Cast like a top-agency model in a luxury fashion house's campaign: genuinely striking and photogenic, tall and lean with long legs and model proportions, high cheekbones, a sharp defined jaw, strong brows and a long neck, with hair styled by a hair stylist. Not a stock-photo or catalogue model.";
export const SET =
  "Product photograph for a luxury fashion house's website, {setting}, full length from head to shoes with space above and below, the background quiet and a little soft so the clothes stay the focus. The place is unmistakably expensive and immaculately kept, like a private estate or a grand house: fine stone, polished floors, elegant proportions, never rustic, weathered, faded or run-down. It could be anywhere in southern Europe, with no palm trees, banana leaves or other tropical plants. Posed like a professional model, never stiff or symmetrical, with a serious, composed expression, lips closed, no smile. Styled by a fashion stylist, sharp focus on the clothing.";

const C = "16:9"; // campaign block (cropped to 16:7 on desktop)
const T = "4:5"; // tiles, portraits, product pages

/** @type {Record<string, {out: string, aspect: string, size: [number, number], wear: string[], face?: string, faces?: string[], family?: string, prompt: string, look?: string, setting?: string}>} */
export const SHOTS = {
  // On the ground (/conservation) as a descent (Leo, 2026-10-21): the scene behind each panel, 16:9 and quiet enough for copy
  // to read over the lower half. One person, small in a wide frame, in the place the fifth goes to (data/ground.ts); until a
  // take is approved the page uses stills already on the site. No sunglasses: these are shaded or dim.
  "ground-summit": {
    out: "images/ground/summit.jpg", aspect: C, size: [2560, 1440],
    wear: ["harbour-quarter-zip-navy", "esplanade-linen-trouser-oat"],
    prompt:
      "A wide shot from the summit of Piton de la Petite Rivière Noire in Mauritius at sunrise, the whole island falling away below in green ridges, cloud lying in the valleys and the sea and the lagoon far off catching the first light. One man in his early thirties stands at the edge with his back half to the camera, small in the frame, in the navy quarter-zip knit and the oat linen trousers, looking out. Clean cold morning air, long soft light, no other people.",
  },
  "ground-forest": {
    out: "images/ground/forest.jpg", aspect: C, size: [2560, 1440],
    wear: ["harbour-quarter-zip-forest", "esplanade-linen-trouser-oat"],
    prompt:
      "A wide shot of the shaded footpath through the native forest of Black River Gorges in Mauritius, tall endemic trees and ferns closing over the path, soft green light coming down through the canopy, mist in the far gorge. One man in his late twenties walks away from the camera along the path, small in the frame, the forest green quarter-zip knit over his shoulders with the sleeves tied loosely at the chest and the oat linen trousers, hands in pockets. Quiet, cool, no sun on him.",
  },
  "ground-shore": {
    out: "images/ground/shore.jpg", aspect: C, size: [2560, 1440],
    wear: ["harbour-quarter-zip-navy", "veranda-linen-trouser-navy"],
    prompt:
      "A wide shot of a mangrove shore on the east coast of Mauritius at dusk, the tangled roots standing in still warm water, the sky pale rose and grey, the sea flat behind. One man in his early thirties stands calf-deep among the roots, small in the frame, the navy linen trousers rolled to the knee and the navy quarter-zip knit, looking out along the shore. Low soft light, no sun, nothing else on the water.",
  },
  "ground-reef": {
    out: "images/ground/reef.jpg", aspect: C, size: [2560, 1440],
    wear: ["lido-stripe-swim-short-navy"],
    prompt:
      "A wide shot taken just under the surface over the coral reef at Blue Bay, Mauritius, clear turquoise water, the coral garden spreading below with small bright fish, sunlight breaking into ripples across the sand. One man in his late twenties free-dives down over the reef, small in the frame and seen from behind, in the navy striped swim shorts and nothing else, a trail of bubbles rising from him. Calm, bright, the lower half of the frame open sand and water.",
  },
  "ground-deep": {
    out: "images/ground/deep.jpg", aspect: C, size: [2560, 1440], wear: [], look: "still",
    prompt:
      "A wide shot of deep open ocean water seen from forty metres down off the reef wall at Blue Bay, Mauritius, almost dark navy blue fading to black at the bottom of the frame, the last of the daylight a faint pale glow high above, a few specks drifting in the water. Nothing else in the frame, no fish, no reef, no surface, no people.",
  },
  // Origins, chapter III: four wild honey badgers round the mark (public/images/about/).
  "badger-lion": {
    out: "images/about/badger-lion.jpg", aspect: "1:1", size: [1200, 1200], wear: [], look: "wild",
    prompt:
      "A honey badger standing its ground, hackles raised and teeth bared, facing a lioness crouched a few metres away in dry golden grass of the Kalahari at dawn, low warm side light, dust hanging in the air, the lioness hesitating. The badger small in front of the big cat but not backing off.",
  },
  "badger-cobra": {
    out: "images/about/badger-cobra.jpg", aspect: "1:1", size: [1200, 1200], wear: [], look: "wild",
    prompt:
      "A honey badger confronting a cape cobra reared up with its hood spread, on red Kalahari sand with sparse dry grass, mid-morning light, the badger leaning in towards the snake, eye level with both animals.",
  },
  "badger-dig": {
    out: "images/about/badger-dig.jpg", aspect: "1:1", size: [1200, 1200], wear: [], look: "wild",
    prompt:
      "A honey badger digging furiously into hard dry ground on an African savanna at midday, soil and dust flying behind its long front claws, head half buried in the hole, harsh bright light and a hard shadow.",
  },
  "badger-dusk": {
    out: "images/about/badger-dusk.jpg", aspect: "1:1", size: [1200, 1200], wear: [], look: "wild",
    prompt:
      "A honey badger trotting alone across open savanna at dusk, the last orange light catching the pale stripe along its back, flat-topped acacia trees in silhouette behind, a wide empty sky.",
  },
  "badger-bees": {
    out: "images/about/badger-bees.jpg", aspect: "1:1", size: [1200, 1200], wear: [], look: "wild",
    prompt:
      "A honey badger tearing into a wild beehive in the hollow of an old tree trunk, honeycomb in its jaws, a cloud of bees swarming round its head, late afternoon light through the branches, unbothered.",
  },
  "badger-hyena": {
    out: "images/about/badger-hyena.jpg", aspect: "1:1", size: [1200, 1200], wear: [], look: "wild",
    prompt:
      "A honey badger standing over a carcass and facing down a spotted hyena twice its size on an open dusty plain, hackles up and mouth open, the hyena stopped a few metres away with its head low, flat grey morning light.",
  },
  "badger-jackals": {
    out: "images/about/badger-jackals.jpg", aspect: "1:1", size: [1200, 1200], wear: [], look: "wild",
    prompt:
      "A honey badger charging at two black-backed jackals that are scattering away from it across short dry grass, dust kicked up, golden late light, the badger low and fast in the middle of the frame.",
  },
  "badger-tree": {
    out: "images/about/badger-tree.jpg", aspect: "1:1", size: [1200, 1200], wear: [], look: "wild",
    prompt:
      "A honey badger climbing the rough trunk of a leaning camelthorn tree, claws dug into the bark, looking back down over its shoulder, bright midday sky and dry bush behind.",
  },
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
      // Take 1 gave four near-identical faces (Leo, 2026-10-15: "the models look the same"), so each man is described.
      "Four friends on an old black basalt harbour wall in Mauritius in late afternoon, wooden fishing boats and turquoise water behind them. They are four clearly different men who look nothing alike, with different faces, ages, builds and hair. On a mooring bollard sits a stocky man in his late forties with a shaved head and a short grey beard, in the navy half-zip knit with cream trousers. Leaning on the wall is a tall, lean man in his early thirties with shoulder-length wavy dark hair tucked behind his ears and a moustache, in the oat linen shirt with sleeves rolled. Beside him stands a slim man in his late twenties with short tight curls and a clean-shaven face, in the red and ecru striped knit crewneck. Barefoot at the edge is a broad-shouldered man in his late thirties with sun-bleached sandy hair and stubble, in the saffron and white striped swim shorts. They are mid-conversation, laughing, not looking at the camera. Wide shot.",
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
  // The women's line (2026-10-15), second campaign on the homepage.
  "campaign-women": {
    out: "images/campaign-women.jpg", aspect: C, size: [2560, 1440], look: "women",
    wear: ["womens-cabana-linen-shirt-navy", "esplanade-linen-short-white", "tidal-swimsuit-lagoon", "womens-riviera-linen-shirt-oat", "womens-mooring-stripe-crew-pink-ecru", "womens-veranda-linen-trouser-white"],
    prompt:
      "Late afternoon on the white sand at Pointe d'Esny on the south-east coast of Mauritius, the turquoise lagoon and a small green islet behind, a blue wooden pirogue pulled up on the beach. Three friends walk along the waterline towards the camera, relaxed, talking and laughing, three clearly different women who do not look alike: one in her late twenties with a short dark bob, in the navy and white awning-striped linen shirt with the sleeves rolled, tucked into the white tailored linen shorts; one in her mid forties with long loose sun-streaked hair, in the turquoise one-piece swimsuit with the oat linen shirt worn open over it, a towel over her shoulder; one in her thirties with dark curly hair, in the cropped pink and ecru striped knit crewneck with the white wide drawstring linen trousers, her sandals in her hand. All barefoot. Wide shot, all three full length but small enough to show the lagoon.",
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
  // Polo Shirts (2026-10-15): the men's mosaic tile and menu scene, and the category's story tile for men and women.
  "men-cat-polo": {
    out: "images/men/cat-polo.jpg", aspect: T, size: [1200, 1500],
    wear: ["cabana-stripe-polo-sky", "mens-esplanade-linen-short-navy"],
    prompt:
      "Mid-afternoon at an old open-air clay tennis court beside the sugar cane fields at Bel Ombre in the south of Mauritius, palms and green hills behind, warm light. A Rodriguan man in his late twenties with short tight curls and an easy smile sits on a weathered wooden bench at the side of the court, a wooden racket resting against his knee, drinking from a glass bottle of water. He wears the sky and white striped short-sleeved collared piqué shirt untucked, the navy tailored shorts and white canvas sneakers. Vertical portrait framing.",
  },
  "shop-polos": {
    out: "images/shop/polos.jpg", aspect: C, size: [2560, 1440], look: "mixed",
    wear: ["sett-polo-navy", "quayside-chino-stone", "promenade-knit-polo-sky", "quayside-chino-short-white"],
    prompt:
      "Lunch on the shaded wooden veranda of an old beach house at Blue Bay, Mauritius, the turquoise lagoon bright beyond the railing, a long table with a white cloth, glasses and a bowl of limes. Two clearly different friends stand by the table laughing: a Mauritian man of mixed Creole and French heritage in his early forties with salt-and-pepper curls, in the navy short-sleeved piqué collared shirt with the small tone-on-tone badger, tucked into stone chinos; and a woman of Indian heritage in her early thirties with long dark hair tied back, in the sky short-sleeved knitted collared top with cream tipping and the cream script on the chest, tucked into white chino shorts. Wide landscape framing.",
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
  "shop-shorts-tees": {
    out: "images/shop/shorts-tees.jpg", aspect: T, size: [1200, 1500],
    wear: ["mens-sandbar-tee-white", "mens-quayside-chino-short-stone"],
    prompt:
      "Late morning on the sand at the edge of the lagoon at Trou aux Biches, Mauritius, filao trees behind, the water pale turquoise. An Indo-Mauritian man in his late twenties with short black hair and a trimmed beard walks barefoot along the waterline, a pair of brown leather sandals hanging from one hand, smiling at someone out of frame. He wears the plain white crew-neck tee and the stone cotton chino shorts ending above the knee. Full figure, vertical frame, the fit of the tee and the length of the shorts clearly visible.",
  },
  "shop-grid-shorts-tees": {
    out: "images/shop/grid-shorts-tees.jpg", aspect: C, size: [2560, 1440],
    wear: ["mens-cabana-stripe-tee-navy", "mens-jetty-linen-short-oat"],
    prompt:
      "Afternoon on an old basalt harbour wall at Mahébourg, Mauritius, wooden fishing pirogues painted blue and red moored in the calm bay behind. A fair-skinned man in his mid-thirties with curly light brown hair and stubble sits on the wall with one leg drawn up, peeling a mango with a small knife, relaxed. He wears the navy and white striped crew-neck tee and the oat linen drawstring shorts, barefoot, a pair of brown leather sandals on the stones beside him. Medium-wide shot, full length, the rest of the frame calm and sunlit.",
  },
  // The Artists card in the Sponsorship band on /stories.
  "sponsor-artist": {
    out: "images/sponsor-artist.jpg", aspect: C, size: [2560, 1440], look: "women",
    wear: ["womens-riviera-linen-shirt-oat", "womens-veranda-linen-trouser-navy"],
    prompt:
      "Late afternoon on the sand at Le Morne, Mauritius, the mountain rising behind and the lagoon pale turquoise. A Malagasy woman in her mid thirties with short natural hair stands at a weathered wooden field easel, painting the mountain and the water on a canvas that is half finished, a brush in one hand and a small palette in the other, a tin of brushes and paint tubes on a cloth on the sand at her feet. She wears the oat linen shirt with its sleeves rolled to the elbow and the navy drawstring linen trousers, barefoot. Medium-wide shot, full figure, the canvas and the landscape both clearly visible, the light warm and low.",
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
  // The Knitwear tile (and the women's knitwear scene in site.ts): the women's line's own knit, not a hoodie.
  "women-cat-knitwear": {
    out: "images/women/landing/cat-knitwear.jpg", aspect: T, size: [1200, 1500], look: "women",
    wear: ["womens-mooring-stripe-crew-navy-ecru", "womens-veranda-linen-trouser-oat"],
    prompt:
      "A cool misty morning in the Bois Chéri tea plantation in the highlands of Mauritius, rows of bright green tea bushes rolling away behind, low cloud over the hills. A red-haired woman in her mid thirties with pale freckled skin and her hair in a loose low knot stands still between the rows, turned three-quarters to the camera and looking out over the fields, one hand resting on the tea bushes. She wears the navy and ecru striped knit crewneck from the reference images, sleeves pushed up a little, with the oat wide drawstring linen trousers and brown leather loafers. Full figure, vertical frame.",
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

  // ── Community cards on /stories (Leo, 2026-10-21: "more unbothered models"): one person, sometimes two, cast to the model
  //    standard, in a real moment after or between sessions, composed and in their own world, in a premium place. ────────────
  ...community([
    ["p1", "a Samoan man of about twenty-four with a strong jaw, short dark curls and broad shoulders", ["breakwater-rugby-shirt-red-ecru"], "under floodlights at dusk on the edge of a private school's rugby pitch after training, mud on his knees, standing side-on with the ball held loosely against one hip, looking flatly past the camera, in the red and ecru striped rugby shirt and navy shorts"],
    ["p2", "a Black British man of about twenty-six with short twists, high cheekbones and a long neck", ["harbour-quarter-zip-red"], "at golden hour on a quiet coastal road, leaning back against a low stone wall with a steel road bike resting beside him, one hand on the bars, eyes on the road ahead, in the red half-zip knit and stone shorts"],
    ["p3", "an East Asian man of about twenty-five with hair slicked back and a sharp jaw", ["mooring-stripe-crew-green-ecru"], "at blue hour on the last green of a seaside course, a club resting over one shoulder, standing with his weight on one leg looking out across the water, in the green and ecru striped knit crewneck with cream trousers"],
    ["p4", "a man of about twenty-three with long sun-bleached hair, still wet, and a lean surfer's build", ["tidal-swim-short-lagoon", "riviera-linen-shirt-sky"], "at first light on the whitewashed steps of a private villa that lead down to the beach, a surfboard under one arm, eyes lowered, in the lagoon blue swim shorts and the sky blue linen shirt worn open"],
    ["p5", "a South Asian man of about twenty-seven with thick wavy black hair and a close-cropped beard", ["shore-swim-short-pine-ecru", "riviera-linen-shirt-oat"], "late afternoon on a windy beach, sitting on the sand with his forearms on his knees and the kite bar beside him, looking out to sea, in the pine and ecru swim shorts and the oat linen shirt worn open"],
    ["p6", "a Latino man of about twenty-five with dark hair slicked back wet", ["lido-stripe-swim-short-red"], "on the teak deck of a private motorboat moored in a glassy bay in the early evening, bare-chested, a towel over one shoulder, sitting on the gunwale with one foot up, looking down at the water, in the red and white striped swim shorts"],
    ["p7", "a mixed-race man of about twenty-two with shaggy dark hair falling over his brow", ["touchline-rugby-shirt-red-navy"], "at dusk at the lip of a smooth concrete bowl in a private garden, one foot on his board, hands in his pockets, looking down into the bowl, in the red, white and navy rugby shirt with cream trousers"],
    ["p8", "a Scandinavian man of about twenty-six with long blond hair tucked behind his ears", ["clubhouse-knit-jacket-red-ecru"], "at dusk on the snowy terrace of a wooden chalet, the board leaning on the rail beside him, standing with one shoulder against a post and his hands in his pockets, looking at the mountains, in the red and ecru knitted jacket"],
    ["p9", "an Afro-Caribbean man of about twenty-five with tight curls and a strong brow", ["harbour-quarter-zip-orange"], "in soft rain on a forest trail, the mountain bike leaning on a mossy stone wall behind him, mud sprayed up his legs, wiping his face with the back of his forearm, eyes down, in the orange half-zip knit and olive trousers"],
    ["p10", "a Mediterranean man of about twenty-eight with dark stubble and hair pushed back", ["regatta-cardigan-navy-ecru"], "after the last run, on the wooden terrace of a mountain chalet with skis stood against the wall behind him, sitting on a bench with a hot drink in both hands, looking at the peaks, in the navy knitted cardigan with ecru trim over a white tee"],
    ["p11", "a Japanese man of about twenty-four with longish hair tied in a low knot", ["pavilion-cable-vest-navy"], "at first light on a mountain trail high above the sea, standing on a rock with his hands on his hips, catching his breath and looking at the water far below, in the navy cable knit vest over a white tee"],
    ["p12", "a Black man of about twenty-six with a shaved head and a long neck", ["riviera-linen-shirt-clementine"], "at the foot of a sea cliff in the late afternoon, sitting on a boulder taping his fingers with chalk on his hands, eyes on his hands, in the clementine linen shirt with the sleeves rolled and stone trousers"],
  ]),
  ...community([
    ["w1", "a woman of about twenty-six with long sun-bleached sandy hair, salty and tangled, and tanned freckled skin", ["tidal-swimsuit-navy", "womens-riviera-linen-shirt-sky"], "at first light on the sand, a white surfboard stood upright beside her with one arm hooked over it, looking out at the reef, in the navy one-piece swimsuit with the sky blue linen shirt worn open over it"],
    ["w2", "a Mauritian Creole woman of about twenty-four with short natural curls and an athletic build", ["lido-stripe-swimsuit-red"], "late afternoon on a windy beach, sitting on the sand with her back against the kite bag and her knees up, looking along the shore, in the red and white striped one-piece swimsuit"],
    ["w3", "a Korean woman of about twenty-five with a sleek low ponytail and high cheekbones", ["promenade-knit-polo-navy", "quayside-chino-short-white"], "at blue hour on a seaside course, a club over one shoulder, standing on the green with her weight on one leg looking across the water, in the navy short-sleeved knitted collared top tucked into the white cotton chino shorts"],
    ["w4", "a lean woman of about twenty-seven with a short dark crop", ["cabana-stripe-tee-red", "quayside-chino-short-stone"], "at first light on a coastal trail above the sea, sitting on a rock with her elbows on her knees catching her breath, looking at the water, in the red and white striped tee and the stone chino shorts"],
    ["w5", "a Black woman of about twenty-six with long braids tied back", ["womens-mooring-stripe-crew-navy-ecru", "esplanade-linen-short-white"], "in the early evening on the teak deck of a sailing yacht at anchor, sitting on the cabin top with one knee up and her back against the mast, looking at the horizon, in the navy and ecru striped knit crewneck and the white linen shorts"],
    ["w6", "a Mediterranean woman of about twenty-five with dark hair slicked back wet", ["lido-stripe-swimsuit-sky"], "at the edge of a natural rock pool by the sea in the late afternoon, sitting on the warm rock with her feet in the water and a towel beside her, looking down at the water, in the sky blue and white striped one-piece swimsuit"],
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
    "a 22-year-old man with a light tan and long sun-bleached dark blond hair to his shoulders, tucked behind his ears, wearing the linen shirt with the sleeves rolled to the forearm and the top two buttons open, tucked into cream pleated linen trousers with a brown leather belt, and tan suede loafers without socks; standing beside the open shutters, one hand in his pocket, gazing off to the side"),
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
    "a classic, ruggedly handsome male model around forty with thick swept-back salt-and-pepper hair, a strong jaw, short stubble and a light tan, wearing the knitted cardigan buttoned over a white t-shirt, the chinos, brown leather loafers and a steel watch; standing by the armchair with one hand resting on its back and the other in his pocket, a calm, confident look into the lens"),
  ...onModel("pavilion-cable-vest", ["navy", "oat", "sky", "sage", "red", "clementine", "yellow", "pink", "black"],
    "a South Asian man in his late twenties with short dark hair, wearing the cable knit vest over a white oxford shirt, the chinos and brown loafers"),
  ...onModel("mooring-stripe-crew", ["navy-ecru", "red-ecru", "green-ecru", "navy-yellow", "oat-ecru", "sky-ecru", "sage-ecru", "clementine-ecru", "yellow-ecru", "pink-ecru", "black-ecru"],
    "a 21-year-old man with light olive skin and thick dark curly hair grown out to his ears and falling over his forehead, wearing the striped knit crewneck untucked, with the collar of a white oxford shirt out over the neckline and its cuffs showing at the wrists, the chinos with a clean break and brown leather penny loafers; both hands in his trouser pockets, ankles crossed, looking slightly down past the camera"),
  ...onModel("clubhouse-knit-jacket", ["red-ecru", "ecru-red", "sand", "oat-ecru", "sky-ecru", "navy-ecru", "sage-ecru", "clementine-ecru", "yellow-ecru", "pink-ecru", "black-ecru"],
    "a man in his late thirties with short dark hair and a trimmed beard, wearing the knitted jacket zipped open over a white t-shirt, the chinos and white sneakers"),
  ...onModel("ridge-knit-gilet", ["black", "oat"],
    "a tall blond man in his early thirties, wearing the knitted gilet over a cream crewneck sweater with the chinos and brown boots"),
  ...onModel("breakwater-rugby-shirt", ["red-ecru", "oat-ecru", "sky-ecru", "navy-ecru", "sage-ecru", "clementine-ecru", "yellow-ecru", "pink-ecru", "black-ecru"],
    "a 23-year-old Black man, very tall and slender, with short twists and a thin moustache, wearing the striped rugby shirt untucked with the collar open and the sleeves pushed up a little, the chinos, dark brown leather loafers and a steel watch; one hand in his trouser pocket, the other relaxed, shoulders turned slightly, looking off past the camera"),
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
  // Men's Shorts & Tees: each short is worn with a top from the range and each tee with one of the shorts (refs: piece, then partner).
  ...onModel("mens-quayside-chino-short", ["stone"],
    "a tanned Spanish man in his early sixties with a neat white beard and swept-back white hair, wearing the chino shorts with the plain white tee untucked and white canvas sneakers"),
  ...onModel("mens-jetty-linen-short", ["oat"],
    "a Brazilian man in his early thirties with light brown skin, a shaved head and a short full beard, wearing the drawstring linen shorts with the navy tee with the small red badger on the chest, tucked in loosely at the front so the drawcord waist shows, and brown leather sandals"),
  ...onModel("mens-esplanade-linen-short", ["navy"],
    "a Scandinavian man in his late forties with swept-back greying blond hair and a tanned face, wearing the tailored shorts with the oat linen shirt tucked in and its sleeves rolled once, a brown leather belt and tan suede loafers"),
  ...onModel("mens-sandbar-tee", ["white"],
    "a Black British man in his early thirties with a neat high-top fade and a clean-shaven face, wearing the plain white tee untucked with the navy tailored shorts and white leather sneakers"),
  ...onModel("mens-cabana-stripe-tee", ["navy"],
    "a Sino-Mauritian man in his late thirties with short neat black hair and a lean build, wearing the striped tee untucked with the oat drawstring linen shorts and white canvas sneakers"),
  ...onModel("badger-tee", ["navy"],
    "a Greek man in his mid twenties with dark hair tied back in a short bun and a light beard, wearing the navy tee with the small red badger on the chest untucked, with the stone chino shorts and brown leather sandals"),
};
for (const [slug, partner] of [
  ["mens-quayside-chino-short-stone", "mens-sandbar-tee-white"],
  ["mens-jetty-linen-short-oat", "badger-tee-navy"],
  ["mens-esplanade-linen-short-navy", "riviera-linen-shirt-oat"],
  ["mens-sandbar-tee-white", "mens-esplanade-linen-short-navy"],
  ["mens-cabana-stripe-tee-navy", "mens-jetty-linen-short-oat"],
  ["badger-tee-navy", "mens-quayside-chino-short-stone"],
]) SHOTS[slug].wear.push(partner);
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
// ── Women's line on-model shots (2026-10-14) ────────────────────────────────────────────────
// STUDIO_W, one woman per design kept across its colourways, each styled with another women's piece
// (refs: the piece, then what it is worn with). Avoid the word "polo": Higgsfield's filter refuses it.
const WOMEN_ON_MODEL = [
  ["tidal-swimsuit", ["lagoon", "navy", "hibiscus", "saffron", "palm"],
    "a Mauritian Creole woman in her late twenties with long dark curly hair and an athletic swimmer's build, barefoot, wearing the one-piece swimsuit", () => []],
  ["lido-stripe-swimsuit", ["red", "sky", "navy", "pink", "yellow"],
    "a Scandinavian woman in her early thirties with short platinum blonde hair and lightly tanned skin, barefoot, wearing the striped one-piece swimsuit", () => []],
  ["womens-riviera-linen-shirt", ["pink", "oat", "sky", "yellow", "navy"],
    "a South Asian woman in her late thirties with shoulder-length black hair, wearing the linen shirt loose with the sleeves rolled to the elbow, half tucked into the white tailored linen shorts, with tan leather sandals", () => ["esplanade-linen-short-white"]],
  ["womens-cabana-linen-shirt", ["sky", "pink", "yellow", "navy", "clementine"],
    "a Southern European woman in her mid twenties with long dark brown wavy hair, wearing the striped linen shirt with the sleeves rolled to the forearm, the front tucked into the white drawstring linen shorts, with tan leather sandals", () => ["jetty-linen-short-white"]],
  ["womens-veranda-linen-trouser", ["oat", "white", "navy", "black"],
    "a Black woman in her mid thirties with close-cropped natural hair, wearing the wide drawstring linen trousers with the plain white t-shirt tucked in at the front so the drawcord waist shows, and flat brown leather sandals", () => ["sandbar-tee-white"]],
  ["esplanade-linen-short", ["white", "oat", "navy", "black"],
    "a Mauritian woman of Indian heritage in her early twenties with long black hair worn loose, wearing the tailored linen shorts with the plain white t-shirt tucked in and flat tan leather sandals", () => ["sandbar-tee-white"]],
  ["jetty-linen-short", ["white", "oat", "sage", "sky", "navy"],
    "a Japanese woman in her late twenties with a short black bob, wearing the drawstring linen shorts with the navy and white striped t-shirt loosely tucked in at the front, and white canvas sneakers", () => ["cabana-stripe-tee-navy"]],
  ["quayside-chino-short", ["stone", "navy", "white", "forest"],
    "a woman in her mid forties with shoulder-length light brown hair, freckles and a warm smile, wearing the cotton chino shorts with the sky blue linen shirt tucked in and the sleeves rolled, and white canvas sneakers", () => ["womens-riviera-linen-shirt-sky"]],
  ["sandbar-tee", ["white", "oat", "sky", "navy", "black"],
    "a Mauritian woman of Chinese heritage in her early thirties with long straight black hair in a low ponytail, wearing the t-shirt tucked into the cotton chino shorts, and white canvas sneakers",
    (c) => [`quayside-chino-short-${{ oat: "navy", sky: "white" }[c] ?? "stone"}`]],
  ["cabana-stripe-tee", ["navy", "red", "sky", "pink", "yellow"],
    "a Brazilian woman in her late twenties with long dark curly hair, wearing the striped t-shirt tucked in at the front of the white drawstring linen shorts, and tan leather sandals", () => ["jetty-linen-short-white"]],
  ["womens-regatta-cardigan", ["burgundy-ecru", "navy-ecru", "forest-ecru", "black-ecru"],
    "a woman in her early fifties with a sleek silver bob and tanned skin, wearing the cropped knitted cardigan buttoned up with the white wide drawstring linen trousers and flat tan leather sandals", () => ["womens-veranda-linen-trouser-white"]],
  ["womens-mooring-stripe-crew", ["pink-ecru", "navy-ecru", "sky-ecru", "oat-ecru", "red-ecru"],
    "a 22-year-old woman of Indian heritage with warm brown skin and long, voluminous dark wavy hair, high cheekbones and full brows, wearing the cropped striped knit crewneck with the white tailored linen shorts and black leather loafers; standing at the foot of the staircase with one hand resting on the balustrade, weight on one hip, a serious, direct gaze", () => ["esplanade-linen-short-white"]],
  ["promenade-knit-polo", ["clementine", "navy", "sky", "pink", "black"],
    "a 24-year-old East Asian woman with sleek black hair pulled back in a low knot and strong cheekbones, wearing the tortoiseshell sunglasses from the reference images reproduced exactly (a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round, the three small metal pins at each front corner, at true size for her face), the short-sleeved knitted collared top tucked into the white cotton chino shorts, a thin gold watch and black leather loafers; a three-quarter turn, one hand in her pocket, chin slightly raised", () => ["quayside-chino-short-white", "alize-sunglasses-tortoise"]],
];
// The first colourway's approved take is the model reference and pulls the others towards its colour.
for (const [family, colours, casting, with_] of WOMEN_ON_MODEL)
  for (const [id, shot] of Object.entries(onModel(family, colours, casting))) {
    const c = id.slice(family.length + 1);
    const pull = c === colours[0] ? "" : " The first reference image only shows who the model is: the piece must be exactly the colour of its own product reference image, not the colour she wears in the first image.";
    SHOTS[id] = { ...shot, look: "studio-w", prompt: shot.prompt + pull, wear: [...shot.wear, ...with_(c)] };
  }
SHOTS["womens-riviera-linen-shirt-oat"].prompt += " The shirt is warm oat beige linen, not pink.";
SHOTS["quayside-chino-short-forest"].prompt += " The shorts are deep forest green cotton twill, not stone or beige.";
SHOTS["womens-regatta-cardigan-navy-ecru"].prompt += " The cardigan body and sleeves are deep navy knit, not burgundy; only the placket, the two sleeve bars and the script are ecru.";
SHOTS["womens-mooring-stripe-crew-oat-ecru"].prompt += " The knit is warm oat beige with ecru bands, not pink.";
SHOTS["promenade-knit-polo-pink"].prompt += " The knitted top is soft dusty pink, not orange or clementine.";
SHOTS["promenade-knit-polo-navy"].prompt += " The knitted top is deep navy, not orange or clementine.";
// The women's Cabana colourways were redone in the navy's irregular awning stripe; the model reference wears the old sky stripe.
for (const c of ["sky", "pink", "yellow", "clementine"])
  SHOTS[`womens-cabana-linen-shirt-${c}`].prompt += " The shirt's stripes follow its product reference image exactly: an irregular awning stripe of wide and narrow coloured stripes between wide white stripes, not the even stripes she wears in the first image.";
// The navy take became this design's model reference (the first one wore the old sky stripe), so it pulls the sky towards navy.
SHOTS["womens-cabana-linen-shirt-sky"].prompt += " The stripes are a soft light sky blue, exactly the colour of the shirt's product reference image, not navy or dark blue.";

// ── Men's polo shirts on-model shots (2026-10-15) ───────────────────────────────────────────────
// One man per design, the first colourway first (its approved take becomes the model reference). Each piece is
// worn with trousers or shorts from the range, `with_(colour)`. No "polo" in the prompts: Higgsfield refuses it.
const MEN_POLOS = [
  ["sett-polo", ["navy", "white", "sky", "pink", "red"],
    "a Mauritian man of Indian heritage in his late twenties with short wavy black hair and light stubble, wearing the short-sleeved piqué collared shirt tucked into the stone chinos with a brown leather belt and white leather sneakers", () => ["quayside-chino-stone"]],
  ["cabana-stripe-polo", ["sky", "navy", "red", "pink", "yellow"],
    "a Japanese man in his early forties with short neat greying hair and a lean build, wearing the striped short-sleeved collared shirt untucked with the tailored shorts and white canvas sneakers",
    (c) => [c === "navy" ? "mens-jetty-linen-short-oat" : "mens-esplanade-linen-short-navy"]],
  ["riviera-linen-polo", ["sage", "oat", "sky", "navy", "clementine"],
    "an Ethiopian man in his mid thirties with close-cropped hair and a short neat beard, wearing the short-sleeved jersey collared shirt untucked with the drawstring linen trousers and brown leather sandals",
    (c) => [c === "oat" ? "veranda-linen-trouser-white" : "veranda-linen-trouser-oat"]],
  ["sundeck-knit-polo", ["oat", "navy", "sage", "black"],
    "an Italian man in his mid fifties with thick swept-back silver hair and a tanned face, wearing the fine knitted short-sleeved collared shirt tucked into the trousers with a brown leather belt and tan suede loafers",
    (c) => [c === "navy" || c === "black" ? "quayside-chino-white" : "esplanade-linen-trouser-navy"]],
  ["boathouse-tipped-polo", ["ecru", "navy", "sky", "pink"],
    "a Korean man in his late twenties with a soft side-parted haircut, wearing the tipped short-sleeved piqué collared shirt tucked into the shorts with white leather tennis sneakers",
    (c) => [c === "ecru" ? "mens-esplanade-linen-short-navy" : "mens-quayside-chino-short-stone"]],
  ["cove-terry-polo", ["clementine", "sky", "yellow", "pink"],
    "an Irish man in his early thirties with short red hair, freckles and a short red beard, wearing the terry towelling short-sleeved collared shirt untucked with the drawstring linen shorts and brown leather sandals",
    () => ["mens-jetty-linen-short-oat"]],
];
for (const [family, colours, casting, with_] of MEN_POLOS)
  for (const [id, shot] of Object.entries(onModel(family, colours, casting))) {
    const c = id.slice(family.length + 1);
    const pull = c === colours[0] ? "" : " The first reference image only shows who the model is: the piece must be exactly the colour of its own product reference image, not the colour he wears in the first image.";
    SHOTS[id] = { ...shot, prompt: shot.prompt + pull, wear: [...shot.wear, ...with_(c)] };
  }

// ── Product pages at the new standard (2026-10-15; MODEL_STANDARD and SET above) ───────────────────────────
// One setting per design, kept across its colourways: the first approved take (stills-src/models/<family>.png)
// carries the model and the setting. Tested in stills-src/casting/round-2; the grey-studio models are in models-orig/.
const SETTINGS = {
  "mooring-stripe-crew": "in a quiet, elegant room with a cream-painted wall of classic raised panel mouldings and a natural woven sisal rug on the floor, in soft window light from one side",
  "breakwater-rugby-shirt": "on the gravel forecourt of a grand private country house, a pale limestone facade with tall white sash windows and a glossy black front door behind him, clipped box topiary in stone urns on either side, in late afternoon sun",
  "riviera-linen-shirt": "on the stone-flagged terrace of an old villa, tall pale green louvred shutters half open behind him, a potted lemon tree and a rattan chair at the edge of the frame, in warm dappled light through a vine overhead",
  "regatta-cardigan": "in the wood-panelled library of an old private club, dark polished wood walls, shelves of old books and a worn tan leather armchair beside him, in warm window light",
  "womens-mooring-stripe-crew": "in the grand entrance hall of a private villa, a black and white marble chequerboard floor, a sweeping pale stone staircase with a wrought iron balustrade, tall panelled double doors and a round table with white flowers, in soft window light",
  "promenade-knit-polo": "on the pool terrace of a luxury private villa, pale travertine paving, the long still edge of a pool, clipped olive trees in large stone urns, a carved stone balustrade and a cream canvas parasol, in bright morning sun with soft shadows",
};
for (const shot of Object.values(SHOTS))
  if (SETTINGS[shot.family]) Object.assign(shot, { look: shot.look === "studio-w" ? "set-w" : "set", setting: SETTINGS[shot.family] });

// ── Group heroes for /men and /women (2026-10-15, `look: "group"`) ───────────────────────────────────────────
// Leo: "multiple models in one picture, especially for the main pages", then "a moody, cool, detached attitude"
// and "make some wear sunglasses". `faces` are design families whose stills-src/models/<family>.png (their new
// product photos) are sent first, so the same people recur across the site. Eyewear was added as Nano Banana Pro
// edits of the approved takes (session scratchpad), one person each: club t2 the silver-haired man (tortoiseshell
// reading glasses), pool t2 the seated woman (olive Alizé; an edit also restored the Mooring crew's long sleeves).
// The forecourt (t3) and hall (t2) are somber, so nobody in them wears sunglasses (Leo's rule).
export const CAMPAIGN =
  "Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain.";
export const MOOD =
  "The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour.";
export const GROUP =
  "Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. Only the one person described with sunglasses or glasses wears any eyewear; nobody else in the picture wears sunglasses or glasses.";
// Leo's eyewear rule: exactly one person per picture, the main character (at the centre), wears eyewear, indoors or
// out: usually Alizé sunglasses (list the colourway in `wear`), occasionally plain clear-lens reading glasses.
// When the picture is somber (overcast, dim or dark), nobody wears sunglasses; reading glasses are still fine.
Object.assign(SHOTS, {
  "group-men-forecourt": {
    out: "images/men/group-forecourt.jpg", aspect: C, size: [2560, 1440], look: "group",
    faces: ["mooring-stripe-crew", "breakwater-rugby-shirt", "riviera-linen-shirt"],
    wear: ["mooring-stripe-crew-navy-ecru", "breakwater-rugby-shirt-navy-ecru", "riviera-linen-shirt-oat", "quayside-chino-stone"],
    prompt:
      "Overcast late afternoon, soft grey light, on the wide pale stone steps in front of a grand private country house, a limestone facade with tall sash windows and a glossy black front door, clipped box topiary in stone urns. Three young men, the three men from the first three reference images with the same faces and hair: the curly-haired man from the first image sits low on the steps with his forearms on his knees, staring flatly into the lens in the navy and ecru striped knit crewneck with a white shirt collar out and the stone chinos; the man with short twists from the second image stands a few steps apart with both hands in his pockets, looking off to the side in the navy and ecru striped rugby shirt and stone chinos; the man with long sun-bleached hair from the third image leans against the stone urn, head tilted, eyes lowered in the oat linen shirt with the sleeves rolled and cream pleated trousers. Brown leather loafers. They do not interact; each is in his own world. Wide shot, all three full figure.",
  },
  "group-men-club": {
    out: "images/men/group-club.jpg", aspect: C, size: [2560, 1440], look: "group",
    faces: ["regatta-cardigan"],
    wear: ["regatta-cardigan-navy-ecru", "harbour-quarter-zip-navy", "pavilion-cable-vest-oat", "quayside-chino-stone"],
    prompt:
      "A dim late afternoon in the wood-panelled library of an old private club, dark polished wood, shelves of old books, a single shaft of light from a tall window, deep shadows, worn tan leather armchairs. Three men: the silver-haired man from the first reference image, same face and hair, sits deep in a leather armchair with one leg crossed and his chin resting on his hand, looking out of the window, in the navy knitted cardigan with ecru trim over a white t-shirt and stone chinos; a 24-year-old East Asian model with slicked-back black hair and a sharp jaw stands by the window in the navy half-zip knit and stone chinos, hands in his pockets, staring coolly into the lens; a 22-year-old model with tousled light brown hair and freckles perches on the arm of a chair, looking down, detached, in the oat cable knit vest over a white oxford shirt and stone chinos. Brown leather loafers, a steel watch. They do not interact; each is in his own world. Wide shot, all three full figure.",
  },
  "group-women-pool": {
    out: "images/women/landing/group-pool.jpg", aspect: C, size: [2560, 1440], look: "group",
    faces: ["promenade-knit-polo", "womens-mooring-stripe-crew"],
    wear: ["promenade-knit-polo-clementine", "alize-sunglasses-tortoise", "womens-mooring-stripe-crew-pink-ecru", "womens-cabana-linen-shirt-navy", "womens-veranda-linen-trouser-white"],
    prompt:
      "Hazy late afternoon light with long shadows on the pool terrace of a luxury private villa, pale travertine paving, the long still edge of a pool, clipped olive trees in large stone urns, a carved stone balustrade and a cream canvas parasol. Three young women: the East Asian woman with sleek black hair in a low knot from the first reference image, same face and features, stands very still with her chin raised, looking past the camera, in the clementine short-sleeved knitted collared top with cream tipping, white tailored shorts and the tortoiseshell oval sunglasses; the woman of Indian heritage with long dark waves from the second reference image, same face and features, sits on the edge of a sun lounger with her elbows on her knees, giving the lens a cool, bored stare, in the pink and ecru striped cropped knit crewneck and white tailored shorts; a 23-year-old model with long sun-streaked light brown hair and freckles leans against the stone balustrade with her arms folded, looking away, in the navy and white awning-striped linen shirt, sleeves rolled, tucked into the white wide drawstring linen trousers. Black leather loafers and bare feet. The three women look nothing alike. They do not interact; each is in her own world. Wide shot, all three full figure.",
  },
  "group-women-hall": {
    out: "images/women/landing/group-hall.jpg", aspect: C, size: [2560, 1440], look: "group",
    faces: ["womens-mooring-stripe-crew"],
    wear: ["womens-mooring-stripe-crew-navy-ecru", "womens-regatta-cardigan-burgundy-ecru", "womens-riviera-linen-shirt-sky", "womens-veranda-linen-trouser-oat", "esplanade-linen-short-white"],
    prompt:
      "Dim, soft light from tall windows and deep shadows in the grand entrance hall of a private villa, a black and white marble chequerboard floor, a sweeping pale stone staircase with a wrought iron balustrade, tall panelled double doors and a round table with white flowers. Three young women: the woman with long dark waves from the first reference image, same face, sits on the stone stairs leaning back on her elbows, looking into the lens, unimpressed, in the navy and ecru striped cropped knit crewneck and white tailored linen shorts; a 21-year-old Black model with a short natural crop and a long neck stands very still at the foot of the stairs with her hands in her pockets, looking off, in the deep burgundy knitted cardigan with ecru trim and the oat wide drawstring linen trousers; a 25-year-old model with dark auburn waves leans on the round table with her head turned away and her eyes lowered, in the sky blue linen shirt with sleeves rolled, tucked into the oat linen trousers. Black leather loafers. They do not interact; each is in her own world. Wide shot, all three full figure.",
  },
});

// Leo: "i want a dj model" (2026-10-15). The DJ is the main character at the centre; golden hour is not somber,
// so the DJ (and only the DJ) wears Alizé. dj-women is also the homepage's Loyalty programme picture.
Object.assign(SHOTS, {
  "dj-men": {
    out: "images/men/dj.jpg", aspect: C, size: [2560, 1440], look: "group",
    faces: ["mooring-stripe-crew"],
    wear: ["cabana-linen-shirt-sky", "veranda-linen-trouser-oat", "alize-sunglasses-black", "harbour-quarter-zip-navy", "mooring-stripe-crew-red-ecru"],
    prompt:
      "Golden hour on the stone terrace of a private villa high above the sea, a carved stone balustrade, cypress and olive trees, a long wooden table set up as a DJ booth with two turntables, a mixer and crates of vinyl records, unlit festoon lights strung overhead. Three young men: in the centre and the main character, the DJ, a 26-year-old model with dark wavy hair pushed back, a thin moustache and a thin gold chain, headphones around his neck, one hand on a spinning record, in the sky blue and white wide-striped linen shirt open over a white t-shirt with the sleeves rolled, the oat drawstring linen trousers and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to his left a 23-year-old with short bleached hair in the navy half-zip knit and stone chinos, leaning on the balustrade with a glass in his hand, looking out to sea; to his right the curly-haired man from the first reference image, same face, in the red and ecru striped knit crewneck and stone chinos, sitting on the balustrade, looking down. Brown leather loafers. They do not interact; each is in his own world. Wide shot, all three full figure.",
  },
  "dj-women": {
    out: "images/women/landing/dj.jpg", aspect: C, size: [2560, 1440], look: "group",
    wear: ["cabana-hoodie-clementine", "esplanade-linen-short-white", "alize-sunglasses-tortoise", "womens-riviera-linen-shirt-sky", "womens-veranda-linen-trouser-white", "womens-mooring-stripe-crew-pink-ecru"],
    prompt:
      "Golden hour in the white stone courtyard of a private villa, tall green shutters, clipped olive trees in large stone urns, a long wooden table set up as a DJ booth with two turntables, a mixer and crates of vinyl records. Three young women: in the centre and the main character, the DJ, a 24-year-old model with a sleek high ponytail and small gold hoops, headphones around her neck, one hand on a spinning record, in the clementine and white wide-striped hooded sweatshirt with the hood down, the white tailored linen shorts, black leather loafers and the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to her left a 22-year-old with long auburn waves in the sky blue linen shirt and the white wide drawstring linen trousers, sitting on a crate of records, looking down; to her right a 25-year-old Black model with a short natural crop in the pink and ecru striped cropped knit crewneck and white shorts, leaning against a column, looking off. They do not interact; each is in her own world. Wide shot, all three full figure.",
  },
});

// Leo: "make a run club one for the community one" (the homepage Community tile, after Nude Project's run club).
SHOTS["run-club"] = {
  out: "images/run-club.jpg", aspect: "4:3", size: [2400, 1800], look: "group",
  wear: ["mens-sandbar-tee-white", "alize-sunglasses-black", "tidal-swim-short-navy", "mens-cabana-stripe-tee-navy", "sandbar-tee-white", "quayside-chino-short-white", "sett-cap-navy"],
  prompt:
    "Early morning on a wide stone seafront promenade below an old town of pale stone houses with shutters, a carved stone balustrade on one side and the calm sea beyond, low sun from behind the runners. A run club of seven young models running towards the camera in a loose pack, mid-stride, focused and unsmiling, a light sheen of sweat. In the centre and the main character, a 24-year-old man with a buzz cut and a strong jaw in the plain white crew-neck tee, the navy swim shorts worn as running shorts and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized. Around him: a 22-year-old woman with a high ponytail in a plain white tee and the white cotton chino shorts; a tall man with short twists in the navy and white striped tee; a woman with dark curls under the navy cap with the small embroidered badger, in a white tee; a man with sun-bleached hair in a white tee and navy shorts; a woman with a sleek black bob in a white tee; and a man with a short beard in the navy and white striped tee. White crew socks and white running shoes. Nobody looks at the camera except the man in the centre.",
};

// ── Section tiles on /men and /women (2026-10-15, `look: "campaign"`) ──────────────────────────────────────────
// Leo: "only produce for the main pages and sections", then "it doesnt always have to be three people and in that
// style" and "there can also be mauritian backgrounds just make sure its premium". The category mosaics in men.ts
// and women.ts; men's Knitwear uses group-men-club, women's Knitwear and Sunglasses group-women-hall and -pool.
// The rugby take is overcast, so somber: its sunglasses were edited out and its prompt leaves them out.
Object.assign(SHOTS, {
  "sec-men-swim": {
    out: "images/men/sections/swim.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["tidal-swim-short-navy","alize-sunglasses-black","lido-stripe-swim-short-sky"],
    prompt:
      "Late afternoon at the infinity pool of a private villa at Le Morne, Mauritius, the basalt mountain rising behind across a turquoise lagoon, pale stone paving. Two young men in swim shorts, bare-chested and barefoot. The main character, a lean 23-year-old with wet slicked-back dark hair, sits on the pool edge with his feet in the water in the navy swim shorts and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized, looking past the camera; behind him a second man in the sky blue and white striped swim shorts is caught mid-dive, his body stretched out in the air above the water. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is a private, unmistakably expensive corner of Mauritius, immaculately kept, never touristy, rustic or run-down. The man on the pool edge is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-men-trousers": {
    out: "images/men/sections/trousers.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["esplanade-linen-trouser-navy","quayside-chino-stone","veranda-linen-trouser-oat"],
    prompt:
      "Evening in the bar of a grand old hotel, a marble floor, a long dark wood bar with brass rails, low amber lamps and deep shadows. Three men: in the centre and the main character, a 27-year-old with slicked-back dark hair and thin gold wire-rimmed round reading glasses with clear lenses, unbranded, leaning back against the bar in a white oxford shirt tucked into the navy tailored linen trousers with a brown leather belt; to his left a 22-year-old with tousled blond hair in a plain white t-shirt and the stone chinos, hands in pockets, looking off; to his right a 30-year-old with close-cropped hair and a trimmed beard in a cream knit and the oat drawstring linen trousers, looking down. Brown leather loafers. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-men-shirts": {
    out: "images/men/sections/shirts.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    faces: ["riviera-linen-shirt"],
    wear: ["cabana-linen-shirt-navy","alize-sunglasses-tortoise","riviera-linen-shirt-sky","corniche-linen-shirt-oat"],
    prompt:
      "Warm afternoon on the stone-flagged terrace of an old villa, tall pale green louvred shutters, a potted lemon tree and a vine overhead throwing dappled shade. Three men in linen shirts with the sleeves rolled: in the centre and the main character, the man with long sun-bleached hair from the first reference image, same face, in the navy and white wide-striped linen shirt and the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to his left a 24-year-old with short dark curls in the sky blue linen shirt, leaning on the shutters, looking away; to his right a 28-year-old with olive skin and a moustache in the oat linen shirt with the small embroidered badger, looking down. Cream trousers, tan suede loafers. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-men-polo": {
    out: "images/men/sections/polo.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["sett-polo-navy","alize-sunglasses-black","boathouse-tipped-polo-ecru"],
    prompt:
      "Late afternoon on the clay court of a private tennis club, a white-painted pavilion with green shutters behind a low clipped hedge. Two men. The main character, a 25-year-old with a dark side-parted crop, is caught mid-serve, the ball tossed high and his racket drawn back, in the navy piqué collared shirt tucked into white tennis shorts, white tennis shoes and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; in the foreground, slightly out of focus, his partner, a 21-year-old with floppy light brown hair in the ecru tipped piqué collared shirt, sits on a wooden bench with a towel around his neck, looking down. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic, weathered or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The man serving is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-men-rugby": {
    out: "images/men/sections/rugby.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    faces: ["breakwater-rugby-shirt"],
    wear: ["touchline-rugby-shirt-red-navy","breakwater-rugby-shirt-navy-ecru","breakwater-rugby-shirt-red-ecru"],
    prompt:
      "Overcast afternoon on the wide steps of an old cricket pavilion at a private school, white columns and a clock, an immaculate green pitch behind. Three men in rugby shirts: in the centre and the main character, a 24-year-old with a buzz cut and a strong jaw in the red, white and navy rugby shirt, sleeves pushed up; to his left the man with short twists from the first reference image, same face, in the navy and ecru striped rugby shirt, sitting on the steps, looking off; to his right a 22-year-old with messy auburn hair and freckles in the red and ecru striped rugby shirt, looking down. Stone chinos, loafers. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. Nobody wears sunglasses or glasses.",
  },
  "sec-men-tees": {
    out: "images/men/sections/tees.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["mens-sandbar-tee-white","alize-sunglasses-black"],
    prompt:
      "Midday on the varnished teak bow of a classic wooden sailing yacht moored in a quiet stone harbour, the water glittering behind. A single model, a 23-year-old with a dark wave of hair falling over his forehead, sits on the deck with his forearms resting on his knees, framed from the head to the knees, in the plain white crew-neck tee, stone shorts and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized, looking off to the side. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Cast like a top-agency model: genuinely striking, tall and lean with model proportions. The place is unmistakably expensive and immaculately kept, never rustic, weathered or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. He is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-men-shorts": {
    out: "images/men/sections/shorts.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["mens-quayside-chino-short-stone","alize-sunglasses-tortoise","mens-jetty-linen-short-oat"],
    prompt:
      "Late afternoon at the private wooden jetty of a luxury villa on the turquoise lagoon at Grand Baie, Mauritius, a varnished wooden speedboat moored alongside. Two men caught in motion stepping off the boat onto the jetty: the main character in front, a 27-year-old with swept-back dark blond hair, in the stone cotton chino shorts with a white linen shirt open at the collar and the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized, a canvas bag over his shoulder; behind him a 22-year-old with short black hair in the oat drawstring linen shorts and a navy tee, one foot still on the boat. Bare feet and loafers. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is a private, unmistakably expensive corner of Mauritius, immaculately kept, never touristy, rustic or run-down. The man in front is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-men-accessories": {
    out: "images/men/sections/accessories.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["sett-cap-navy","alize-sunglasses-black","burrow-sock-white"],
    prompt:
      "Afternoon light through the tall open doors of the old coach house of a country estate, a polished dark green vintage convertible with no badges or emblems, a stone floor. A single model, a 24-year-old with dark curls, sits sideways on the car's running board, framed head to toe, one hand adjusting the navy cap with the small embroidered badger, in a plain white tee, stone chinos rolled at the ankle, the white ribbed crew socks pulled up and brown leather loafers, wearing the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Cast like a top-agency model: genuinely striking, tall and lean with model proportions. The place is unmistakably expensive and immaculately kept, never rustic, weathered or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. He is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-men-sunglasses": {
    out: "images/men/sections/sunglasses.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["alize-sunglasses-tortoise","riviera-linen-shirt-navy"],
    prompt:
      "Bright afternoon in the stone loggia of an old villa, arches throwing hard shadows. A head-and-shoulders portrait of a single model, a 25-year-old with a strong jaw and slicked-back black hair, his face half in a shaft of sun, in the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized and the navy linen shirt open at the collar, looking just past the camera. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Cast like a top-agency model: genuinely striking, tall and lean with model proportions. The place is unmistakably expensive and immaculately kept, never rustic, weathered or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. He is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-women-swim": {
    out: "images/women/landing/sections/swim.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["tidal-swimsuit-lagoon","alize-sunglasses-black","lido-stripe-swimsuit-red","womens-riviera-linen-shirt-oat"],
    prompt:
      "Late afternoon on the smooth stone terrace of a private villa above the sea, stone steps leading down into deep clear water. Three young women: in the centre and the main character, a 23-year-old with a sleek wet bob in the turquoise one-piece swimsuit and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to her left a 21-year-old with long dark curls in the red and white striped one-piece swimsuit, sitting on the steps, looking down; to her right a 26-year-old with sun-streaked hair in the oat linen shirt worn open over a swimsuit, looking off. Barefoot. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-women-shirts": {
    out: "images/women/landing/sections/shirts.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["womens-cabana-linen-shirt-pink","womens-veranda-linen-trouser-white","womens-riviera-linen-shirt-sky"],
    prompt:
      "Morning on the shaded veranda of a grand colonial mansion on a sugar estate in Mauritius, tall louvred shutters, polished wooden floors, rattan chairs and a lush garden beyond. Two young women. The main character, a 25-year-old with a dark low chignon and thin gold wire-rimmed round reading glasses with clear lenses, unbranded, is curled up in a rattan armchair reading a book, in the pink and white awning-striped linen shirt and the white wide drawstring linen trousers; behind her a 22-year-old with long auburn hair in the sky blue linen shirt leans in the open doorway, looking out at the garden. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is a private, unmistakably expensive corner of Mauritius, immaculately kept, never touristy, rustic or run-down. The woman reading is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-women-polo": {
    out: "images/women/landing/sections/polo.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    faces: ["promenade-knit-polo"],
    wear: ["promenade-knit-polo-navy","alize-sunglasses-tortoise","quayside-chino-short-white"],
    prompt:
      "Late afternoon on the clay court of a private tennis club, the green shutters of a white pavilion behind. A single model, the East Asian woman with sleek black hair in a low knot from the first reference image, same face, is caught mid-forehand, her racket swinging through, in the navy short-sleeved knitted collared top with cream tipping tucked into the white cotton chino shorts, white tennis shoes and the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized, a little clay dust at her feet. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Cast like a top-agency model: genuinely striking, tall and lean with model proportions. The place is unmistakably expensive and immaculately kept, never rustic, weathered or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. She is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-women-tees": {
    out: "images/women/landing/sections/tees.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["sandbar-tee-white","alize-sunglasses-black","cabana-stripe-tee-red","sandbar-tee-sky","sandbar-tee-navy","jetty-linen-short-white"],
    prompt:
      "Midday on the deck of a sleek private catamaran anchored in a turquoise lagoon off the west coast of Mauritius, the basalt mountain of Le Morne in the distance. Four young women lounging on the deck, seen from slightly above: the main character, a 23-year-old with a sharp black bob, sits up against the cabin with her knees drawn up in the plain white crew-neck tee and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; one lies on her back on the net trampoline with her eyes closed in the red and white striped tee; one sits on the edge with her legs over the side in the sky blue tee; one leans against the mast in the navy tee. White linen shorts, bare feet. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is a private, unmistakably expensive corner of Mauritius, immaculately kept, never touristy, rustic or run-down. The woman sitting against the cabin is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-women-shorts": {
    out: "images/women/landing/sections/shorts.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["esplanade-linen-short-white","alize-sunglasses-tortoise","quayside-chino-short-navy"],
    prompt:
      "Afternoon on a raked gravel path between tall clipped yew hedges in the formal garden of a grand villa, a stone urn on a plinth at the end. Two young women walk away from the camera down the path, seen from behind and the side: the main character, a 24-year-old with long dark waves, glances back over her shoulder at the lens, in the white tailored linen shorts, a white tee and the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; beside her a 26-year-old with a short natural crop in the navy cotton chino shorts and a navy and white striped tee. Black leather loafers. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic, weathered or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The woman looking back is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
  "sec-women-trousers": {
    out: "images/women/landing/sections/trousers.jpg", aspect: T, size: [1200, 1500], look: "campaign",
    wear: ["womens-veranda-linen-trouser-oat","alize-sunglasses-black"],
    prompt:
      "Bright afternoon light streaming through the tall windows of the long gallery of a private villa, herringbone parquet, pale curtains and a marble bust on a plinth. A single model, a 25-year-old with sleek dark hair, walks towards the camera down the length of the gallery, mid-stride, the oat wide drawstring linen trousers moving as she walks, with a plain white tee, black leather loafers and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Cast like a top-agency model: genuinely striking, tall and lean with model proportions. The place is unmistakably expensive and immaculately kept, never rustic, weathered or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. She is the only person wearing any eyewear; nobody else wears sunglasses or glasses.",
  },
});

// ── Main images, 2026-10-15 (`look: "full"`, the exact prompt each take was sent with) ─────────────────────────
// Leo: "make more or use the others for the other main images on the site. keep some of the original ones where
// people are laughing or smiling". Unused takes from the casting tests, plus five new ones. men-story-knitwear is
// group-men-club t1 cut to 4:5 a third of the way across: the man in the armchair and the man by the window.
Object.assign(SHOTS, {
  "home-men-hero": {
    out: "images/home/men-hero.jpg", aspect: "16:9", size: [2560, 1440], look: "full",
    wear: ["riviera-linen-shirt-clementine","alize-sunglasses-olive","mooring-stripe-crew-sky-ecru","lido-stripe-swim-short-saffron"],
    prompt:
      "Golden hour on the teak deck of a classic wooden motor yacht anchored in the turquoise lagoon below Le Morne, Mauritius, polished brass and white cushions. Three young men: in the centre and the main character, a 24-year-old with tousled dark hair and a strong jaw sits on the cabin roof with his forearms on his knees, in the clementine linen shirt with the sleeves rolled, white linen trousers and the olive sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to his left a 22-year-old with short bleached hair leans on the rail in the sky and ecru striped knit crewneck and stone shorts, looking out to sea; to his right a 27-year-old with a short beard, bare-chested in the saffron and white striped swim shorts, sits on the edge of the deck with his feet over the side, looking down. Wide shot, all three full figure. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is a private, unmistakably expensive corner of Mauritius, immaculately kept, never touristy, rustic or run-down. The man in the centre is the only person wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "home-women-hero": {
    out: "images/home/women-hero.jpg", aspect: "16:9", size: [2560, 1440], look: "full",
    faces: ["promenade-knit-polo","womens-mooring-stripe-crew"],
    wear: ["promenade-knit-polo-clementine","alize-sunglasses-tortoise","womens-mooring-stripe-crew-pink-ecru","womens-cabana-linen-shirt-navy","womens-veranda-linen-trouser-white"],
    prompt:
      "Bright morning on the pool terrace of a luxury private villa, pale travertine paving, the long still edge of a pool, clipped olive trees in large stone urns, a carved stone balustrade and a cream canvas parasol. Three young women: the woman with a sleek low knot from the first reference image, same face, stands in the clementine short-sleeved knitted collared top with cream tipping, white tailored shorts and the tortoiseshell oval sunglasses; the woman with long dark waves from the second reference image, same face, sits on the edge of a sun lounger in the pink and ecru striped cropped knit crewneck and white tailored shorts; a 23-year-old model with long sun-streaked light brown hair and freckles walks past in the navy and white awning-striped linen shirt, sleeves rolled, tucked into the white wide drawstring linen trousers. Black leather loafers and bare feet. Relaxed and elegant, mid-conversation, one of them looks into the lens. Wide shot, all three full figure. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "explore-swim": {
    out: "images/home/explore-swim.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["tidal-swim-short-navy","alize-sunglasses-black","lido-stripe-swim-short-sky","shore-swim-short-navy-ecru"],
    prompt:
      "Late afternoon at the edge of a private villa's infinity pool, pale travertine, a carved stone balustrade and the sea far below. Three young men in swim shorts, bare-chested and barefoot, skin still wet: in the centre and the main character, a lean 23-year-old with wet slicked-back dark hair in the navy swim shorts and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized, looking past the camera; to his left a 21-year-old with sun-bleached curls in the sky blue and white striped swim shorts, sitting on the pool edge, looking down; to his right a 25-year-old with a shaved head and a short beard in the navy and ecru two-tone swim shorts, a white towel over one shoulder, looking off. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "explore-sunglasses": {
    out: "images/home/explore-sunglasses.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["womens-veranda-linen-trouser-oat","alize-sunglasses-black","womens-veranda-linen-trouser-navy","womens-veranda-linen-trouser-white"],
    prompt:
      "Soft afternoon light in the long gallery of a private villa, herringbone parquet, tall windows with pale curtains and a marble bust on a plinth. Three young women in wide drawstring linen trousers: in the centre and the main character, a 25-year-old with sleek dark hair in the oat trousers and a white tee, wearing the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to her left a 22-year-old with auburn waves in the navy trousers and a navy tee, looking out of the window; to her right a 24-year-old with long black hair in the white trousers and a white linen shirt, leaning on the window frame, looking down. Black leather loafers. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "home-men-pair": {
    out: "images/home/men-pair.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["mens-quayside-chino-short-stone","alize-sunglasses-tortoise","mens-jetty-linen-short-oat","mens-esplanade-linen-short-navy"],
    prompt:
      "Late afternoon on the stone boat landing of a private villa, still water, a varnished wooden launch moored alongside, stone steps leading down. Three men in shorts: in the centre and the main character, a 27-year-old with swept-back dark blond hair in the stone cotton chino shorts with a white linen shirt open at the collar and the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to his left a 22-year-old with short black hair in the oat drawstring linen shorts and a white tee, sitting on the steps, looking down; to his right a 25-year-old with a shaved head in the navy tailored shorts and a navy tee, looking off. Loafers and bare feet. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "men-swim-hero": {
    out: "images/men/swim-hero.jpg", aspect: "16:9", size: [2560, 1440], look: "full",
    wear: ["shore-swim-short-navy-ecru","alize-sunglasses-black","tidal-swim-short-red","lido-stripe-swim-short-sky"],
    prompt:
      "Late afternoon on the smooth rock platform of a private villa above a deep blue cove, a carved stone stair leading down to the water. Three young men in swim shorts, bare-chested and barefoot: in the centre and the main character, a 25-year-old with wet slicked-back black hair stands at the edge of the platform in the navy and ecru two-tone swim shorts and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized, looking down at the water; to his left a 22-year-old with sun-bleached curls is caught mid-dive, his body stretched out above the sea, in the red swim shorts; to his right a 27-year-old with a shaved head sits on the warm stone with a white towel around his shoulders, in the sky blue and white striped swim shorts, looking off. Wide shot. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic, weathered or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The man in the centre is the only person wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "men-story-linen": {
    out: "images/men/story-linen.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["alize-sunglasses-tortoise","riviera-linen-shirt-navy","harbour-quarter-zip-oat"],
    prompt:
      "Bright afternoon in the stone loggia of an old villa, a row of arches throwing deep shadows across a terracotta floor. Three men: in the centre and the main character, a 25-year-old with a strong jaw and slicked-back black hair in the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized and the navy linen shirt, standing in a shaft of sun; to his left a 22-year-old with tousled brown hair in the oat half-zip knit, leaning on a column in the shade, looking off; to his right a 29-year-old with close-cropped hair in a white linen shirt, looking down. Cream trousers, loafers. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "men-story-knitwear": {
    out: "images/men/story-knitwear.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    faces: ["regatta-cardigan"],
    wear: ["regatta-cardigan-navy-ecru","harbour-quarter-zip-navy","pavilion-cable-vest-oat","quayside-chino-stone"],
    prompt:
      "Late afternoon in the wood-panelled library of an old private club, dark polished wood, shelves of old books, tall windows with soft light, worn tan leather armchairs. Three men: the silver-haired man from the first reference image, same face and hair, sits in a leather armchair with one leg crossed in the navy knitted cardigan with ecru trim over a white t-shirt and stone chinos; a 24-year-old East Asian model with slicked-back black hair and a sharp jaw stands by the window in the navy half-zip knit and stone chinos, one hand in his pocket; a 22-year-old model with tousled light brown hair and freckles perches on the arm of a chair in the oat cable knit vest over a white oxford shirt and stone chinos. Brown leather loafers, a steel watch. Quiet and assured, the young man by the window looks into the lens. Wide shot, all three full figure. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "men-new-in": {
    out: "images/men/new-in.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["sett-polo-navy","alize-sunglasses-black","boathouse-tipped-polo-ecru","sundeck-knit-polo-oat"],
    prompt:
      "Late afternoon on the terrace of a private tennis club, a white-painted pavilion with green shutters, a clay court beyond a low clipped hedge. Three men in short-sleeved collared shirts: in the centre and the main character, a 25-year-old with a dark side-parted crop in the navy piqué collared shirt tucked into stone chinos and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to his left a 21-year-old with floppy light brown hair in the ecru tipped piqué collared shirt, a racket under his arm, looking off; to his right a 29-year-old with a short beard in the oat fine-knit collared shirt, sitting on the terrace wall, looking down. White tennis shoes and loafers. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "men-favourite-hoodie": {
    out: "images/men/favourite-hoodie.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["cabana-hoodie-navy","alize-sunglasses-black","veranda-linen-trouser-oat"],
    prompt:
      "Bright late morning on a stone terrace above the sea, a low limestone wall and a potted olive tree. A single model, a 23-year-old with dark curls and a strong jaw, sits on the low wall with one leg drawn up, in the navy and white wide-striped hooded sweatshirt with the hood down and the drawcords hanging evenly, the oat drawstring linen trousers and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized, looking out to sea. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Cast like a top-agency model: genuinely striking, tall and lean with model proportions. The place is unmistakably expensive and immaculately kept, never rustic, weathered or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. He is the only person wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "women-story-alize": {
    out: "images/women/landing/story-alize.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["esplanade-linen-short-white","alize-sunglasses-tortoise","jetty-linen-short-sage","quayside-chino-short-navy"],
    prompt:
      "Afternoon on a raked gravel path between tall clipped yew hedges in the formal garden of a grand villa, a stone urn on a plinth. Three young women in shorts: in the centre and the main character, a 24-year-old with long dark waves in the white tailored linen shorts and a white tee, wearing the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to her left a 22-year-old with a blonde bob in the sage drawstring linen shorts and a white tee, looking off; to her right a 26-year-old with a short natural crop in the navy cotton chino shorts and a striped tee, looking down. Black leather loafers. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "women-favourite-hoodie": {
    out: "images/women/landing/favourite-hoodie.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["cabana-hoodie-pink","alize-sunglasses-tortoise","esplanade-linen-short-white"],
    prompt:
      "Morning on the shaded veranda of a colonial villa in Mauritius, tall louvred shutters, a rattan daybed and the lagoon glinting through the garden beyond. A single model, a 24-year-old with long dark hair in a loose low knot, sits curled up on the rattan daybed with a coffee cup, in the pink and white wide-striped hooded sweatshirt with the hood down, the white tailored linen shorts and the tortoiseshell sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized, looking past the camera. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Cast like a top-agency model: genuinely striking, tall and lean with model proportions. The place is a private, unmistakably expensive corner of Mauritius, immaculately kept, never touristy, rustic or run-down. She is the only person wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "women-for-him": {
    out: "images/women/landing/for-him.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["mens-sandbar-tee-white","alize-sunglasses-black","mens-cabana-stripe-tee-navy","badger-tee-navy"],
    prompt:
      "Midday on the varnished teak deck of a classic wooden sailing yacht moored in a quiet harbour, coiled ropes and polished brass. Three men in t-shirts: in the centre and the main character, a 23-year-old with a dark mullet-length wave of hair in the plain white crew-neck tee and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized; to his left a 26-year-old with short bleached hair in the navy and white striped tee, sitting on the cabin roof, looking off; to his right a 21-year-old with dark curls in the navy tee with the small red badger on the chest, leaning on the rail, looking down. Stone and navy shorts, bare feet. Three-quarter length to full length, the models standing close together in a vertical frame so every face reads even at a small size. The mood is moody, cool and detached, like a luxury fashion campaign: nobody smiles and nobody interacts, each model is in their own world with an aloof, heavy-lidded, unbothered expression, looking past the camera or coolly straight into it, with a slouched, effortless elegance. Low directional light with deep soft shadows and muted, rich colour. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. The one person described with sunglasses or glasses is the only one wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "edit-badger": {
    out: "images/shop/badger-edit.jpg", aspect: "4:5", size: [1200, 1500], look: "full",
    wear: ["corniche-linen-shirt-oat","sett-cap-navy","alize-sunglasses-black","mens-esplanade-linen-short-navy"],
    prompt:
      "Late afternoon on the wide stone steps of a colonial sugar-estate mansion in Mauritius, white columns and green louvred shutters behind. A single model, a 28-year-old with light brown skin and a close-cropped beard, sits on the steps with his forearms on his knees, framed from the head to the knees and close enough that the small embroideries read: the oat linen shirt with its small tone-on-tone embroidered badger on the chest, sleeves rolled and top buttons open, and the navy cap exactly as in the reference with its small embroidered badger low on the front panel just above the visor, no bigger than a thumbnail, with the navy tailored shorts and the black sunglasses from the reference images, reproduced exactly from the sunglasses reference images: a slim narrow oval acetate frame whose lenses are a shallow horizontal oval about twice as wide as they are tall, not round and not cat-eye, the same colour and translucency, the same lens tint, the three small metal pins at each front corner, sitting naturally on the nose at true size for an adult face, not oversized. Cool and unbothered, like a luxury fashion campaign: unsmiling and unposed, caught in the middle of something rather than lined up for the camera. Natural light with soft shadows and muted, rich colour. Cast like a top-agency model: genuinely striking, tall and lean with model proportions. The place is a private, unmistakably expensive corner of Mauritius, immaculately kept, never touristy, rustic or run-down. He is the only person wearing any eyewear; nobody else wears sunglasses or glasses. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
  "feature-knitwear": {
    out: "images/shop/feature-knitwear.jpg", aspect: "16:9", size: [2560, 1440], look: "full",
    faces: ["regatta-cardigan"],
    wear: ["regatta-cardigan-navy-ecru","harbour-quarter-zip-navy","pavilion-cable-vest-oat","quayside-chino-stone"],
    prompt:
      "Late afternoon in the wood-panelled library of an old private club, dark polished wood, shelves of old books, tall windows with soft light, worn tan leather armchairs. Three men: the silver-haired man from the first reference image, same face and hair, sits in a leather armchair with one leg crossed in the navy knitted cardigan with ecru trim over a white t-shirt and stone chinos; a 24-year-old East Asian model with slicked-back black hair and a sharp jaw stands by the window in the navy half-zip knit and stone chinos, one hand in his pocket; a 22-year-old model with tousled light brown hair and freckles perches on the arm of a chair in the oat cable knit vest over a white oxford shirt and stone chinos. Brown leather loafers, a steel watch. Quiet and assured, the young man by the window looks into the lens. Wide shot, all three full figure. Every person is cast like a top-agency model: genuinely striking, tall and lean with model proportions, and each one clearly different from the others in face, hair and build. The place is unmistakably expensive and immaculately kept, never rustic or run-down, and could be anywhere in southern Europe, with no palm trees or tropical plants. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, soft natural daylight, rich true-to-life colour, gentle film grain. The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere. Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.",
  },
});

// ── Hero plates for the new cards (2026-10-15, `look: "full"`) ───────────────────────────────────────────────
// Leo: "make sure the backgrounds here match the colour scheme of the main picture". Each plate is its card's place,
// empty and wider, made with the card (`face`) as the reference so the palette matches.
Object.assign(SHOTS, {
  "plate-men-forecourt": {
    out: "images/men/plate-forecourt.jpg", aspect: C, size: [2560, 1440], look: "full", face: "images/men/group-forecourt.jpg", wear: [],
    prompt:
      "Use the reference image only for its place, light, colours and mood. Show the same place completely empty, with no people anywhere in the frame, as a wider view of the setting, as if the camera had stepped back: the gravel forecourt and pale limestone facade of a grand private country house under a soft overcast sky, tall sash windows, a glossy black front door, clipped box topiary in stone urns and wide stone steps. Keep exactly the same colour palette, light direction, time of day and weather as the reference. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.",
  },
  "plate-men-cove": {
    out: "images/men/plate-cove.jpg", aspect: C, size: [2560, 1440], look: "full", face: "images/men/swim-hero.jpg", wear: [],
    prompt:
      "Use the reference image only for its place, light, colours and mood. Show the same place completely empty, with no people anywhere in the frame, as a wider view of the setting, as if the camera had stepped back: a smooth pale rock platform and a carved stone stair above a deep blue cove, pines and pale limestone rocks, late afternoon light. Keep exactly the same colour palette, light direction, time of day and weather as the reference. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.",
  },
  "plate-men-terrace": {
    out: "images/men/plate-terrace.jpg", aspect: C, size: [2560, 1440], look: "full", face: "images/men/dj.jpg", wear: [],
    prompt:
      "Use the reference image only for its place, light, colours and mood. Show the same place completely empty, with no people anywhere in the frame, as a wider view of the setting, as if the camera had stepped back: the stone terrace of a private villa high above the sea at golden hour, a carved stone balustrade, cypress and olive trees, unlit festoon lights strung overhead. Keep exactly the same colour palette, light direction, time of day and weather as the reference. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.",
  },
  "plate-men-library": {
    out: "images/men/plate-library.jpg", aspect: C, size: [2560, 1440], look: "full", face: "images/men/group-club.jpg", wear: [],
    prompt:
      "Use the reference image only for its place, light, colours and mood. Show the same place completely empty, with no people anywhere in the frame, as a wider view of the setting, as if the camera had stepped back: the wood-panelled library of an old private club, dark polished wood, shelves of old books, worn tan leather armchairs and a tall window with soft light. Keep exactly the same colour palette, light direction, time of day and weather as the reference. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.",
  },
  "plate-women-hall": {
    out: "images/women/landing/plate-hall.jpg", aspect: C, size: [2560, 1440], look: "full", face: "images/women/landing/group-hall.jpg", wear: [],
    prompt:
      "Use the reference image only for its place, light, colours and mood. Show the same place completely empty, with no people anywhere in the frame, as a wider view of the setting, as if the camera had stepped back: the grand entrance hall of a private villa, a black and white marble chequerboard floor, a sweeping pale stone staircase with a wrought iron balustrade and tall panelled doors, in dim soft light. Keep exactly the same colour palette, light direction, time of day and weather as the reference. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.",
  },
  "plate-women-courtyard": {
    out: "images/women/landing/plate-courtyard.jpg", aspect: C, size: [2560, 1440], look: "full", face: "images/women/landing/dj.jpg", wear: [],
    prompt:
      "Use the reference image only for its place, light, colours and mood. Show the same place completely empty, with no people anywhere in the frame, as a wider view of the setting, as if the camera had stepped back: the white stone courtyard of a private villa at golden hour, tall green shutters and clipped olive trees in large stone urns. Keep exactly the same colour palette, light direction, time of day and weather as the reference. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.",
  },
  "plate-women-pool": {
    out: "images/women/landing/plate-pool.jpg", aspect: C, size: [2560, 1440], look: "full", face: "images/women/landing/group-pool.jpg", wear: [],
    prompt:
      "Use the reference image only for its place, light, colours and mood. Show the same place completely empty, with no people anywhere in the frame, as a wider view of the setting, as if the camera had stepped back: the pool terrace of a luxury private villa in hazy late afternoon light, pale travertine, a still pool, clipped olive trees in stone urns, a carved stone balustrade and a cream parasol. Keep exactly the same colour palette, light direction, time of day and weather as the reference. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.",
  },
  "plate-home-yacht": {
    out: "images/home/plate-yacht.jpg", aspect: C, size: [2560, 1440], look: "full", face: "images/home/men-hero.jpg", wear: [],
    prompt:
      "Use the reference image only for its place, light, colours and mood. Show the same place completely empty, with no people anywhere in the frame, as a wider view of the setting, as if the camera had stepped back: the teak deck and brass rail of a classic wooden motor yacht on a turquoise lagoon below the basalt mountain of Le Morne, Mauritius, at golden hour. Keep exactly the same colour palette, light direction, time of day and weather as the reference. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.",
  },
  "plate-home-pool": {
    out: "images/home/plate-pool.jpg", aspect: C, size: [2560, 1440], look: "full", face: "images/home/women-hero.jpg", wear: [],
    prompt:
      "Use the reference image only for its place, light, colours and mood. Show the same place completely empty, with no people anywhere in the frame, as a wider view of the setting, as if the camera had stepped back: the pool terrace of a luxury private villa in bright late afternoon sun, pale travertine, a still blue pool, clipped olive trees in stone urns, a carved stone balustrade and a cream canvas parasol. Keep exactly the same colour palette, light direction, time of day and weather as the reference. Editorial photograph for a luxury fashion house's seasonal campaign, shot on a medium format film camera, rich true-to-life colour, gentle film grain, photographic realism, no CGI look. No people anywhere in the frame.",
  },
});

/** The community cards (look "community", composed in generate-stills.mjs): a model-standard casting in a real moment, in the moody unbothered mood of the moments pictures. */
function community(rows) {
  return Object.fromEntries(
    rows.map(([id, who, wear, scene]) => [
      id,
      {
        out: `community/${id}.jpg`, aspect: T, size: [1080, 1350], wear, look: "community",
        prompt: `One person only: ${who}, ${scene}. Cast like a top-agency model in a luxury fashion house's campaign: genuinely striking and photogenic, tall and lean with model proportions, hair styled as part of the look, not a stock-photo or catalogue model. Posed like a model, never centred with the arms at the sides: weight on one leg, leaning, sitting, or caught mid-moment. The place is premium and immaculately kept, never touristy or rustic; no palm trees. No sunglasses or glasses. Waist-up to three-quarter length, vertical frame.`,
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

// ── V2 streetwear lookbook (/v2, src/data/v2.ts `looks` and `hero`) ──────────────────────────────
// Look "street": flash-lit, grainy, real places at night and raw nature, people in their twenties and
// thirties (Leo, 2026-10-15: "cooler … street wear … 20-40"). "street-still" is the same with no people.
// No "35mm", "polo" or brand names in prompts: Higgsfield's filter refuses them.
export const STREET =
  "Raw streetwear lookbook photograph shot on a small compact film camera with direct on-camera flash, hard flash shadows, deep blacks, slightly crushed colour, visible film grain, candid and unposed, in a real place, not a studio.";

Object.assign(SHOTS, {
  "street-hero": {
    out: "images/street/hero.jpg", aspect: C, size: [2560, 1440], look: "street",
    wear: ["riviera-hoodie-black", "quayside-chino-black", "marram-cap-ecru-black"],
    prompt:
      "Night on a narrow cobbled side street in Lisbon, wet stones, a shuttered shop front covered in old paint and torn posters, one orange streetlight further down. A North African man in his late twenties with a short beard stands against the shutter, hands in the hoodie pocket, looking straight into the flash, wearing the black hoodie with the small tone-on-tone badger, the black chinos and the ecru and black cap. Full length, the man off centre to the right, plenty of dark street to the left.",
  },
  "street-laundromat": {
    out: "images/street/laundromat.jpg", aspect: T, size: [1200, 1500], look: "street",
    wear: ["riviera-hoodie-pink", "quayside-chino-short-stone", "burrow-sock-white"],
    prompt:
      "Late at night in a small neighbourhood laundromat in Marseille, rows of steel washing machines, fluorescent light and the flash. A Korean woman in her early thirties with a blunt black bob sits on top of a washing machine, legs dangling, eating chips from a plain unmarked brown paper bag, wearing the pink hoodie, the stone chino shorts and the white ribbed socks pulled up with plain unbranded white canvas sneakers that have no logos, stripes or heel patches. Full length.",
  },
  "street-caps": {
    out: "images/street/caps.jpg", aspect: T, size: [1200, 1500], look: "street-still",
    wear: ["marram-cap-ecru-black", "marram-cap-ecru-red", "marram-cap-ecru-pine", "marram-cap-ecru-navy"],
    prompt:
      "Still life at night: four six-panel caps, each with an ecru crown and a coloured visor (black, red, green, navy), tossed in a loose pile on the dusty black bonnet of an old unbadged parked car with no emblem, badge or grille logo anywhere, a bit of street and a kerb behind falling into darkness, lit hard by the flash. Seen from above at an angle.",
  },
});
