/**
 * The approved "moments" pictures (2026-10-16) and the active sports shots, with their alt texts. /about lays them out as
 * its mood board and /stories mixes them into the community wall. `wide` pictures are 16:9 (2560×1440), the others 4:5 (1200×1500).
 */
export type Picture = { image: string; alt: string; wide: boolean };

export const moments = {
  firstLight: { image: "/images/moments/first-light.jpg", wide: false, alt: "A surfer walking into the sea at first light while two friends in linen and a cricket jumper watch from the shore" },
  courtyard: { image: "/images/moments/courtyard.jpg", wide: false, alt: "Two friends on the stone steps of a Paris courtyard at night under festoon lights" },
  rooftop: { image: "/images/moments/rooftop.jpg", wide: true, alt: "Two friends on a London rooftop at blue hour among the chimney pots" },
  surfLineup: { image: "/images/moments/surf-lineup.jpg", wide: true, alt: "Two friends on their longboards far apart in the sea at sunset, waiting for the next wave" },
  kitchenParty: { image: "/images/moments/kitchen-party.jpg", wide: true, alt: "Late in an Amsterdam canal house kitchen, one friend on the counter with a glass of wine, the other at the window over the canal" },
  sunriseWalk: { image: "/images/moments/sunrise-walk.jpg", wide: false, alt: "Two friends walking home along the seafront at sunrise, loafers in hand" },
  readyAgain: { image: "/images/moments/ready-again.jpg", wide: false, alt: "Friends getting ready to go out again in an old bedroom, one sitting on the bed doing up his loafers" },
  drinksWall: { image: "/images/moments/drinks-wall.jpg", wide: true, alt: "Two friends on an old stone sea wall at golden hour, a bottle in hand" },
  homeForDinner: { image: "/images/moments/home-for-dinner.jpg", wide: true, alt: "Friends at a long candlelit table on the terrace of an old stone house, one pouring the wine" },
  djNight: { image: "/images/moments/dj-night.jpg", wide: true, alt: "A DJ at the decks on a stone terrace above the sea at night, candles along the balustrade" },
} satisfies Record<string, Picture>;

export const active = {
  barrel: { image: "/images/active/barrel.jpg", wide: true, alt: "A surfer crouched deep inside a hollow barrel, one hand trailing along the wave" },
  scooter: { image: "/images/active/scooter-indonesia.jpg", wide: false, alt: "A surfer on an old scooter with a board in the side rack, riding past rice terraces above the sea in Indonesia" },
  kitesurf: { image: "/images/active/kitesurf.jpg", wide: true, alt: "A kitesurfer carving across a turquoise lagoon, throwing spray, a mountain behind" },
} satisfies Record<string, Picture>;
