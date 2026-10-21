/**
 * The Polaroid bands on Origins (/about#inspiration, Leo, 2026-10-21): the brand's pictures of the moments in the passage,
 * all of the plush badger (Leo, 2026-10-21: no human pictures on this page), and only those where he looks unbothered
 * (Leo, 2026-10-21): calm, cool, mouth shut, whatever is going on around him. The ones where he laughs, cheers, shouts or
 * is mid-action sit in `collageLoud` below, out of the bands but kept. Files are 900×1125 copies in public/images/collage
 * (Mascot/.tools/collage-export.mjs).
 */
export type CollagePicture = { image: string; alt: string; caption: string };

const pic = (id: string, caption: string, alt: string): CollagePicture => ({ image: `/images/collage/${id}.jpg`, caption, alt });

export const collagePool: CollagePicture[] = [
  // The passage, moment by moment, with the plush badger living it.
  pic("e01-first-light", "First light, wax on the board", "The badger waxing a surfboard on a cold beach at dawn, two friends behind"),
  pic("e04-same-faces", "Nobody needs an invitation", "The crew pouring through a garden gate: wetsuit, cricket knit, rugby shirt, a crate of bottles"),
  pic("e05-on-the-deck", "Songs on the deck", "A friend at two turntables on a terrace at golden hour, the badger beside him"),
  pic("e10-rooftop-london", "A rooftop in London", "The badger and his girlfriend on a rooftop ledge at night, the skyline behind"),
  pic("e12-on-repeat", "Sleep can happen tomorrow", "The badger in the back of a taxi at 5 a.m., his girlfriend asleep on his shoulder"),
  pic("e14-made-properly", "Made properly", "The badger checking the seams of a cream cable knit in a bright Nordic workshop"),
  // Him and her.
  pic("r01-kitchen-dance", "2 a.m., the one song", "The badger slow-dancing with his girlfriend in a kitchen after the party"),
  pic("r02-scooter-dusk", "The coast road at dusk", "The badger on a cream Vespa at dusk, his girlfriend's arms round his waist"),
  pic("r03-wall-sunset", "One glass, shared", "The badger and his girlfriend on a stone wall at sunset, her head on his shoulder"),
  pic("r05-paris-rain", "Paris in the rain", "The badger kissing his girlfriend's forehead under one umbrella on a wet Paris street"),
  pic("r06-balcony-morning", "Two coffees", "The badger bringing two coffees to his girlfriend on a Paris balcony in the morning"),
  // Earlier badger pictures.
  pic("hero-back", "Sunday", "The badger asleep on his back on a teak daybed, paws on his belly"),
  pic("hero-sofa", "The sofa", "The badger slumped on a cream bouclé sofa, arms along the backrest"),
  pic("look-linen", "The jetty", "The badger in cream linen on the Le Morne jetty, winking over his sunglasses"),
  pic("look-varsity", "Blue hour", "The badger in a navy varsity jacket on an Amsterdam rooftop at blue hour"),
  pic("look-dinner", "3 a.m.", "The badger in an ivory dinner jacket by a piano, bow tie undone"),
  pic("look-suede", "The mews", "The badger in a tobacco suede blouson walking a wet London mews"),
  pic("look-tennis", "Clay", "The badger in tennis whites on a clay court, racket over his shoulder"),
  pic("look-swim", "The sea pool", "The badger in navy swim shorts and a terry shirt on volcanic rocks by the sea"),
  pic("city-paris", "Saint-Germain", "The badger in a navy cashmere crew at a Paris café terrace"),
  pic("nordic-archipelago", "The archipelago", "The badger in a roll-neck and waxed jacket on a jetty by a red wooden house"),
  pic("london-club", "The club", "The badger in a navy blazer in a leather armchair by a fire, whisky in paw"),
  pic("alps-apres", "Après-ski", "The badger in a cable ski jumper on a sunny mountain terrace, skis beside him"),
  pic("amsterdam-bike", "The canal bridge", "The badger in a camel overcoat riding a Dutch bike over a canal bridge"),
  pic("rugby-pitch", "After the match", "The badger in a muddy hooped rugby shirt walking off a pitch in the drizzle"),
  pic("crew-shopping", "Bag duty", "The badger carrying all the shopping bags, his girlfriend ahead with an iced coffee"),
];

/** The badger with his mouth open or in the thick of it: laughing, cheering, shouting, barrelled. Not in the bands (Leo, 2026-10-21). */
export const collageLoud: CollagePicture[] = [
  pic("e02-barrel", "Inside the barrel", "The badger crouched inside the tube of a wave, a friend tiny in the channel"),
  pic("e03-breakfast", "Breakfast after, and lots of it", "A veranda table covered in cut fruit, six badgers around it after the surf"),
  pic("e06-on-film", "Shot on film", "The badger caught mid-laugh on a wall as a friend lifts a film camera"),
  pic("e07-sunset-canal", "One drink at sunset", "Three badgers on an Amsterdam quay at sunset, legs over the water, bottles beside them"),
  pic("e08a-pub", "The pub", "Five badgers round a pub table with pints, a dartboard and rugby photographs behind"),
  pic("e08b-bistro", "The bistro", "Four badgers at a Paris bistro terrace at dusk with carafes of wine and frites"),
  pic("e09-kitchen-amsterdam", "Someone's kitchen, Amsterdam", "The badger on a kitchen counter at 1 a.m., eggs frying, friends everywhere"),
  pic("e11-courtyard-paris", "A courtyard in Paris", "The badger dancing in a Paris courtyard at 3 a.m., bow tie undone, friends around"),
  pic("e13-sunrise-paddle", "Paddling out anyway", "The badger paddling out through white water at sunrise, last night's sunglasses still on"),
  pic("r04-surf-push", "Her first wave", "The badger pushing his girlfriend on a longboard into a small wave, both laughing"),
  pic("crew-surf", "Barrelled", "The badger riding inside a barrelling wave in navy swim shorts"),
  pic("crew-dj", "Main stage", "The badger at the decks on a festival main stage at night, thousands in front"),
  pic("crew-beers", "Pints", "Five badgers round a table in an old English pub, pints raised"),
];

/** One picture from either list by its file id (e.g. "e01-first-light"), for pages that name a specific moment. */
export const collagePicture = (id: string): CollagePicture | undefined => [...collagePool, ...collageLoud].find((p) => p.image.endsWith(`/${id}.jpg`));
