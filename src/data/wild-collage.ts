/**
 * The collage cover on The scene (/conservation, Leo, 2026-10-21: "covered in a collage of images of the most beautiful
 * nature and sceneries, with people, our models, wearing the clothes"). Four columns in reading order; phones show the
 * first two, tablets three. Every picture already lives on the site with the approved cast and settings; nothing was
 * generated for this. Forest and mangrove are thin (two trail portraits), which is the gap to fill with new stills.
 *
 * The cover is decorative and hidden from assistive technology, so `alt` here is documentation, not rendered.
 */
export type WildPicture = { image: string; alt: string; aspect: "4 / 5" | "16 / 9" | "21 / 9" };

const P = "4 / 5";
const L = "16 / 9";

export const wildCollage: WildPicture[][] = [
  [
    { image: "/images/shop/reef.jpg?v=r1016", alt: "A free-diver in navy swim shorts gliding over a coral garden, sunlight falling through the water", aspect: L },
    { image: "/images/summit.jpg", alt: "A man in navy linen on a Mauritius summit at sunrise, above the cloud", aspect: P },
    { image: "/community/w4.jpg", alt: "A trail runner in the Black River Gorges forest", aspect: P },
    { image: "/images/day-catamaran.jpg?v=r1016", alt: "Two men on a catamaran net as dolphins leap off the bow, one in an open sky striped linen shirt and navy swim shorts", aspect: P },
    { image: "/images/moments/surf-lineup.jpg", alt: "Two friends on their longboards far apart in the sea at sunset, waiting for the next wave", aspect: L },
    { image: "/images/about.jpg?v=r1016", alt: "A man walking barefoot over basalt rocks by the surf in a white linen shirt and navy trousers", aspect: P },
  ],
  [
    { image: "/images/sea-cliff-wide.jpg?v=r1016", alt: "Green sea cliffs in golden light, a man in a cream quarter-zip knit looking out", aspect: "21 / 9" },
    { image: "/images/day-reef.jpg?v=r1016", alt: "A swimmer in red swim shorts over a coral reef", aspect: P },
    { image: "/community/w1.jpg", alt: "A surfer on the reef at Tamarin", aspect: P },
    { image: "/images/moments/first-light.jpg", alt: "A surfer walking into the sea at first light while two friends in linen and a cricket jumper watch from the shore", aspect: P },
    { image: "/images/active/kitesurf.jpg", alt: "A kitesurfer carving across a turquoise lagoon, throwing spray, a mountain behind", aspect: L },
    { image: "/community/p11.jpg?v=2", alt: "A runner on a mountain trail above the sea", aspect: P },
  ],
  [
    { image: "/images/campaign-swim.jpg", alt: "A man walking out of the lagoon at dawn below Le Morne", aspect: L },
    { image: "/images/active/teahupoo.jpg", alt: "A surfer in the barrel over a reef", aspect: P },
    { image: "/images/day-sundowner.jpg?v=r1016", alt: "A beach bar at Flic en Flac at dusk", aspect: P },
    { image: "/community/w6.jpg", alt: "A freediver on the reef at Blue Bay", aspect: P },
    { image: "/images/men/plate-cove.jpg", alt: "A rock platform above a deep blue cove", aspect: L },
    { image: "/images/moments/sunrise-walk.jpg", alt: "Two friends walking along the seafront at sunrise, loafers in hand", aspect: P },
  ],
  [
    { image: "/images/beach-surfer.jpg?v=r1016", alt: "A surfer at sunset on the waterline", aspect: P },
    { image: "/images/active/barrel.jpg", alt: "A surfer crouched deep inside a hollow barrel, one hand trailing along the wave", aspect: L },
    { image: "/community/p9.jpg?v=2", alt: "A mountain biker on a forest trail", aspect: P },
    { image: "/images/day-kite.jpg?v=r1016", alt: "Kitesurfers on the Le Morne lagoon", aspect: P },
    { image: "/community/p12.jpg?v=2", alt: "A climber on a sea cliff", aspect: P },
  ],
];
