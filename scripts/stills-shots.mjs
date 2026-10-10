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
export const GARMENT =
  "The clothing from the reference product images must be reproduced exactly: same colours, same stripe count and stripe widths, same knit or weave texture, same collar, buttons, zip and drawcord, and the small embroidered logo in the same place at the same size. No other logos, text or branding anywhere.";
export const REAL = "Real people with natural skin texture and real hair, real fabric with natural creases, photographic realism, no CGI look, no smoothing.";

const C = "16:9"; // campaign block (cropped to 16:7 on desktop)
const T = "4:5"; // tiles, portraits, product pages

/** @type {Record<string, {out: string, aspect: string, size: [number, number], wear: string[], face?: string, family?: string, prompt: string, look?: string}>} */
export const SHOTS = {
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
      "A long lunch table with a white cloth set on the sand under a sea almond tree at the edge of a calm lagoon in Mauritius, midday shade and bright water behind. One man stands pouring white wine in the sky blue linen shirt, sleeves rolled, with cream linen trousers; another sits back laughing in the clementine linen shirt, top buttons open. Grilled fish, bread, lemons and glasses on the table. Wide shot.",
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
    ["p10", "freeride", ["regatta-cardigan-ecru-navy"], "on a wooden chalet terrace with skis behind him, in the ecru and navy knitted cardigan over a white tee"],
    ["p11", "trail", ["pavilion-cable-vest-navy"], "on a mountain trail above the sea, in the navy cable knit vest over a white tee"],
    ["p12", "climbing", ["riviera-linen-shirt-clementine"], "at the foot of a sea cliff with a chalk bag on his hip, in the clementine linen shirt with sleeves rolled and stone trousers"],
  ]),

  // ── On-model product shots (one model per design, kept across its colourways) ──────────────
  ...onModel("marram-cap", ["beige", "ecru-pine", "ecru-red", "red", "mustard-navy"],
    "a man around thirty with short dark curly hair and light stubble, wearing the cap with a plain white t-shirt, cream trousers and white sneakers"),
  ...onModel("tidal-swim-short", ["navy", "saffron", "red", "hibiscus", "lagoon", "palm", "papaya"],
    "an athletic swimmer-build man in his late twenties with sun-bleached brown hair, bare-chested and barefoot, wearing the swim shorts"),
  ...onModel("shore-swim-short", ["pine-ecru", "navy-saffron", "red-ecru"],
    "a lean Black man around thirty with close-cropped hair, bare-chested and barefoot, wearing the swim shorts"),
  ...onModel("riviera-linen-shirt", ["oat", "sky", "navy", "sage", "red", "clementine"],
    "a man in his mid thirties with sandy hair, wearing the linen shirt with sleeves rolled once and the top button open, cream linen trousers and tan suede loafers"),
  ...onModel("harbour-quarter-zip", ["navy", "forest", "red", "mustard", "sky", "orange"],
    "an East Asian man in his early thirties with neat black hair, wearing the half-zip knit zipped halfway with cream chinos and white sneakers"),
  ...onModel("regatta-cardigan", ["ecru-navy"],
    "a man in his mid forties with salt-and-pepper hair and a short beard, wearing the knitted cardigan buttoned over a white t-shirt, cream trousers and brown loafers"),
  ...onModel("pavilion-cable-vest", ["navy"],
    "a South Asian man in his late twenties with short dark hair, wearing the cable knit vest over a white oxford shirt, cream trousers and brown loafers"),
  ...onModel("mooring-stripe-crew", ["navy-ecru", "red-ecru", "green-ecru", "navy-yellow"],
    "a man around thirty with curly dark hair and warm brown skin, wearing the striped knit crewneck with cream trousers and white sneakers"),
  ...onModel("clubhouse-knit-jacket", ["red-ecru", "ecru-red", "sand"],
    "a man in his late thirties with short dark hair and a trimmed beard, wearing the knitted jacket zipped open over a white t-shirt, cream trousers and white sneakers"),
  ...onModel("ridge-knit-gilet", ["black"],
    "a tall blond man in his early thirties, wearing the knitted gilet over a cream crewneck sweater with stone trousers and brown boots"),
  ...onModel("breakwater-rugby-shirt", ["red-ecru"],
    "a broad-shouldered Pacific Islander man in his late twenties, wearing the rugby shirt untucked with cream chinos and white sneakers"),
  ...onModel("touchline-rugby-shirt", ["red-navy"],
    "a man in his late twenties with short red-brown hair and freckles, wearing the rugby shirt untucked with stone chinos and white sneakers"),
  ...onModel("lido-stripe-swim-short", ["saffron", "red", "sky", "pink", "red-black", "green", "orange", "navy-saffron"],
    "a Latin American man around thirty with dark wavy hair, bare-chested and barefoot, wearing the striped swim shorts"),
};

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
