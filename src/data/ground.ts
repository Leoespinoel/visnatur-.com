import { impact, partners, site } from "@/data/site";

/**
 * On the ground (/conservation) as a descent (Leo, 2026-10-21: "something like junkbranding.com"): one scene stuck under the
 * header, the page's panels stepping over it as it goes down through the island, from the summit to the three grounds the
 * fifth goes to and on to the bottom, where the money is counted. The altitudes, in metres, drive the readout on the HUD
 * (components/ground/GroundHud.tsx); the motes are what drifts through each scene (GroundParticles.tsx).
 *
 * No photographs (Leo, 2026-10-21, after a first round with stills behind the panels: "I do not like the backgrounds",
 * then chose "no photographs" over empty landscapes and the new takes, then "a drawn scene"): each scene is a dark stage
 * with one pool of tinted light, placed differently per scene like the pools on junkbranding.com, the sea drawn as a
 * surface that rises through the screen as the page goes down (GroundSea.tsx), and a drawn silhouette along the foot
 * (GroundSilhouettes.tsx). The `ground-*` shots in scripts/stills-shots.mjs and their takes in stills-src/takes are kept
 * in case they serve elsewhere.
 */
export type Motes = "mist" | "leaves" | "spray" | "plankton" | "snow";

export type Stage = {
  key: string;
  /** Metres above (or below) the sea. */
  altitude: number;
  /** The scene's light: its colour and where it pools (a CSS position, e.g. "30% 15%"). */
  tint: { color: string; at: string };
  /** Where the drawn sea's surface stands in this scene, as a share of the stage's height from its top (over 100 is
   *  below the foot of the screen, under 0 above its head). GroundScene slides it between scenes. */
  sea: number;
  motes: Motes;
};

export type Ground = Stage & {
  id: "forest" | "shore" | "reef";
  numeral: string;
  name: string;
  place: string;
  title: string;
  /** The place and the piece first, what the planting does second (the register of the fifth: no charity words). */
  line: string;
  /** The entry's name in `partners` (data/site.ts); its figures in `impact` are looked up by the same name. */
  partner: string;
};

/** Where the descent starts: Piton de la Petite Rivière Noire, the island's highest point. Cold dawn light, high and left. */
export const summit: Stage = {
  key: "summit",
  altitude: 828,
  tint: { color: "#2b3a4c", at: "30% 15%" },
  sea: 125,
  motes: "mist",
};

export const grounds: Ground[] = [
  {
    key: "forest",
    id: "forest",
    numeral: "I",
    name: "The forest",
    place: "Black River Gorges",
    altitude: 640,
    title: "Trees put back in the last native forest.",
    line:
      "The path under the canopy in Black River Gorges, cool enough for a knit over the shoulders. What is planted here holds the last of the island's native forest, and the birds that live nowhere else.",
    tint: { color: "#153324", at: "25% 70%" },
    sea: 112,
    motes: "leaves",
    partner: "Mauritian Wildlife Foundation",
  },
  {
    key: "shore",
    id: "shore",
    numeral: "II",
    name: "The shore",
    place: "The east coast",
    altitude: 0,
    title: "Mangroves put back along the shore.",
    line:
      "The east coast at dusk, trousers rolled, warm water between the roots. Each mangrove planted holds the sand where it is, and the shore the pieces are worn on.",
    /* The dusk glow sits on the horizon, just above the water, so the mangroves stand against it. */
    tint: { color: "#4a3842", at: "50% 48%" },
    sea: 58,
    motes: "spray",
    partner: "On the shore",
  },
  {
    key: "reef",
    id: "reef",
    numeral: "III",
    name: "The reef",
    place: "Blue Bay",
    altitude: -14,
    title: "Coral put back on the reef.",
    line: "Clear water over the reef at Blue Bay, a swim short drying on the rail after. Coral planted here keeps the water worth going in.",
    tint: { color: "#0f3e49", at: "70% 60%" },
    sea: 6,
    motes: "plankton",
    partner: "On the reef",
  },
];

/** The bottom, where the money is counted: near black, the last of the light small and high. */
export const bottom: Stage = {
  key: "bottom",
  altitude: -40,
  tint: { color: "#101d2f", at: "50% 0%" },
  sea: -30,
  motes: "snow",
};

/** Every scene in order; a panel names its scene by index here. */
export const stages: Stage[] = [summit, ...grounds, bottom];

/** A ground's figures from data/site.ts: who the fifth builds with there, what has been put in, and what has been planted. */
export function groundFigures(g: Ground) {
  const partner = partners.find((p) => p.name === g.partner);
  const invested = impact.invested.find((p) => p.partner === g.partner);
  const target = impact.targets.find((t) => t.partner === g.partner);
  if (!partner || !invested || !target) throw new Error(`No figures for ${g.partner} in data/site.ts`);
  return { partner, invested, target };
}

/** "+ 640 m", "0 m", "− 14 m": the HUD's readout. */
export function altitudeLabel(m: number): string {
  const n = Math.round(m);
  const sign = n > 0 ? "+ " : n < 0 ? "− " : "";
  return `${sign}${Math.abs(n).toLocaleString(site.locale)} m`;
}

/** How a place earns the fifth: the tests behind "Where the fifth does the most." */
export const leverageTests = [
  { title: "Concentrated", text: "Small places that hold a lot of life, so each euro protects more of it." },
  { title: "Close to the edge", text: "The places with the least left, where money now does more than money later." },
  {
    title: "Counted",
    text: "People who count what survived, not what was planted, and publish it: coral still alive, trees that took, a shore that held.",
  },
];

/** The finale's call: name a place the fifth should go to next. An email, like a sponsorship application on /stories. */
export const nextPlaceMailto = `mailto:${site.email}?subject=${encodeURIComponent("A place for the fifth")}&body=${encodeURIComponent(
  ["The place:", "What it needs:", "Who counts what survives there:", "How you know it:"].join("\n\n") + "\n",
)}`;
