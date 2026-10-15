/**
 * Where each campaign picture is set, for the coordinates under the wordmark while a hero slider shows
 * it. Keyed by the picture's path without its ?v=, so a slide picks up its place from its picture.
 * Coordinates are the place's, to the nearest minute. A picture that is not listed shows the island's.
 */
export type Location = { place: string; coords: string };

export const island: Location = { place: "Mauritius", coords: "20°17′S 57°33′E" };

export const locations: Record<string, Location> = {
  "/images/campaign-drop.jpg": { place: "Mahébourg", coords: "20°24′S 57°42′E" },
  "/images/campaign-swim.jpg": { place: "Le Morne", coords: "20°27′S 57°19′E" },
  "/images/campaign-linen.jpg": { place: "Pointe d’Esny", coords: "20°26′S 57°44′E" },
  "/images/campaign-golf.jpg": { place: "Île aux Cerfs", coords: "20°16′S 57°48′E" },
  "/images/shop/hero.jpg": { place: "Le Morne", coords: "20°27′S 57°19′E" },
  "/images/shop/grid-accessories.jpg": { place: "Moka", coords: "20°13′S 57°30′E" },
  "/images/shop/grid-sunglasses.jpg": { place: "Tamarin", coords: "20°20′S 57°22′E" },
  "/images/women/landing/campaign-collection.jpg": { place: "Grand Baie", coords: "20°01′S 57°35′E" },
  "/images/women/landing/campaign-hoodies.jpg": { place: "Mahébourg", coords: "20°24′S 57°42′E" },
};

export const locationOf = (image: string): Location | undefined => locations[image.split("?")[0]];
