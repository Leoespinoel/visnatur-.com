/**
 * The membership on /members (Leo, 2026-10-16, modelled on nude-project.com/pages/reward-landing): a free club
 * with points and three rooms for everyone, plus Members Only, the paid subscription that goes entirely to
 * conservation (its perks are `memberPerks` in stories.ts). Every number here is a draft for Leo to confirm.
 * Joining is making a Shopify customer account (/account/register); points start counting once they show in it.
 */
export const club = {
  name: "Members only",
  /** Points count from this day: orders and sign-ups before it earn nothing (draft, Leo to confirm). */
  startsAt: "2026-10-20T00:00:00Z",
  /** The room follows the points earned in the last twelve months. */
  windowMonths: 12,
  /** Points expire after twelve months without an order or a reward. */
  expiryMonths: 12,
  /** Points from an order land this many days after it ships: 4–7 days in transit plus the 14 days to return. */
  pendingDays: 21,
  /** A birthday added later than this many days before it pays from the next one, so nobody adds today's date for points. */
  birthdayLeadDays: 30,
  /** How long a reward's code can be used. */
  codeMonths: 12,
  /** Members Only is confirmed by hand: this tag on the customer in Shopify. */
  membersOnlyTag: "members-only",
  /** Rewards with no code (a VN night, a members' colour) tag the customer, and a Shopify Flow emails the team. */
  requestTag: "club-request",
  /** The leaderboard on /members shows this many members per table, plus the member's own row. */
  leagueTop: 10,
  /** The leaderboard reads every member's orders, so the server keeps it this long between reads. */
  leagueCacheMinutes: 15,
};

const count = (n: number) => n.toLocaleString("en-GB");

export type RoomId = "terrace" | "clubhouse" | "rooftop";
/** A room's looping film on the signed-in page (scripts/generate-room-films.mjs); unset until Leo approves a take. */
export type RoomFilm = { landscape: string; portrait: string; poster: string; posterPortrait: string };

/** Each room is a part of the club; which one a member is in follows the points earned in the last twelve months. */
export type Room = {
  id: RoomId;
  name: string;
  /** Points earned in twelve months to get in. */
  min: number;
  /** Points per €1 spent while in this room. */
  multiplier: number;
  /** "1,000–2,999 points" and "1.25 points for every €1", from `min` and `multiplier`. */
  points: string;
  rate: string;
  image: string;
  alt: string;
  perks: string[];
  film?: RoomFilm;
};

// The Terrace first, then the Clubhouse (Leo, 2026-10-20), then the Rooftop. Each room's picture goes with its name.
const roomList: Omit<Room, "points" | "rate">[] = [
  {
    id: "terrace",
    name: "The Terrace",
    min: 0,
    multiplier: 1,
    image: "/images/moments/drinks-wall.jpg",
    alt: "Two friends on an old stone sea wall at golden hour, one in an open linen shirt and chinos, the other in a cricket jumper and white linen trousers",
    perks: ["A first look at new pieces before they go on the site", "Points on your birthday", "Invitations to the community runs and open events"],
  },
  {
    id: "clubhouse",
    name: "The Clubhouse",
    min: 1000,
    multiplier: 1.25,
    image: "/images/moments/home-for-dinner.jpg",
    alt: "Friends at a long candlelit table in the courtyard of an old stone house at dusk, wine being poured",
    perks: ["Everything in the Terrace", "Invitations to VN nights", "Repairs to the front of the queue"],
  },
  {
    id: "rooftop",
    name: "The Rooftop",
    min: 3000,
    multiplier: 1.5,
    image: "/images/moments/rooftop.jpg",
    alt: "Two friends on a London rooftop at blue hour among the chimney pots",
    perks: ["Everything in the Clubhouse", "A welcome gift, made for Rooftop members only", "A say in what is made next", "A seat at the members' dinner"],
  },
];

export const rooms: Room[] = roomList.map((r, i) => {
  const next = roomList[i + 1];
  return {
    ...r,
    points: next ? `${count(r.min)}–${count(next.min - 1)} points` : `${count(r.min)}+ points`,
    rate: `${r.multiplier} point${r.multiplier === 1 ? "" : "s"} for every €1`,
  };
});

export type EarnId = "join" | "order" | "letters" | "instagram" | "friend" | "birthday" | "members-only";

/** Ways to earn points. `value` is null for orders, which earn by the euro at the room's rate. */
export const earn: { id: EarnId; action: string; value: number | null; points: string }[] = (
  [
    { id: "join", action: "Join the club", value: 100 },
    { id: "order", action: "Every order", value: null },
    { id: "letters", action: "Sign up to the letters", value: 100 },
    { id: "instagram", action: "Follow on Instagram", value: 50 },
    { id: "friend", action: "Bring a friend who orders", value: 300 },
    { id: "birthday", action: "Your birthday", value: 200 },
    { id: "members-only", action: "Join Members Only", value: 500 },
  ] as const
).map((e) => ({ ...e, points: e.value === null ? "1 per €1" : `+${e.value}` }));

/** The VN badger doing each way to earn: the plush honey badger mascot (masters in Mascot/, git-ignored), square. */
export const earnPictures: Record<EarnId, string> = {
  join: "/images/club/mascot/tile-join.jpg",
  order: "/images/club/mascot/tile-order.jpg",
  letters: "/images/club/mascot/tile-letters.jpg",
  instagram: "/images/club/mascot/tile-instagram.jpg",
  friend: "/images/club/mascot/tile-friend.jpg",
  birthday: "/images/club/mascot/tile-birthday.jpg",
  "members-only": "/images/club/mascot/tile-members-only.jpg",
};

/**
 * The 4:5 mascot shots (1200×1500) in two sets, for the bands drifting behind the inspiration passage on /about: the water and
 * the day, then the nights and the cities. The square tiles above stay with Level up.
 */
export const mascotBands: { image: string; alt: string }[][] = [
  [
    { image: "/images/club/mascot/crew-surf.jpg", alt: "The badger inside a barrel, a friend in the channel" },
    { image: "/images/club/mascot/look-swim.jpg", alt: "The badger in navy swim shorts and a terry shirt on the sea-pool rocks" },
    { image: "/images/club/mascot/look-linen.jpg", alt: "The badger in cream linen on the Le Morne jetty, winking over his sunglasses" },
    { image: "/images/club/mascot/look-tennis.jpg", alt: "The badger in a tipped polo and cable vest on a clay court" },
    { image: "/images/club/mascot/rugby-pitch.jpg", alt: "The badger in a muddy hooped rugby shirt under floodlights in the drizzle" },
    { image: "/images/club/mascot/alps-apres.jpg", alt: "The badger in a cable ski jumper, goggles up, on a Verbier terrace" },
    { image: "/images/club/mascot/nordic-archipelago.jpg", alt: "The badger in a roll-neck and waxed jacket by a red house in the Stockholm archipelago" },
    { image: "/images/club/mascot/hero-back.jpg", alt: "The badger asleep on his back on a teak daybed, paws on his belly" },
    { image: "/images/club/mascot/hero-sofa.jpg", alt: "The badger slumped on a cream bouclé sofa, arms along the backrest" },
  ],
  [
    { image: "/images/club/mascot/crew-dj.jpg", alt: "The badger at the decks on a festival main stage at night, thousands in front" },
    { image: "/images/club/mascot/crew-beers.jpg", alt: "Five badgers round a table in an old English pub, pints in paw" },
    { image: "/images/club/mascot/crew-shopping.jpg", alt: "The badger on bag duty, his girlfriend walking ahead with an iced coffee" },
    { image: "/images/club/mascot/london-club.jpg", alt: "The badger in a navy blazer on a Chesterfield by the fire, a whisky in paw" },
    { image: "/images/club/mascot/city-paris.jpg", alt: "The badger in a navy cashmere crew at a Saint-Germain café" },
    { image: "/images/club/mascot/amsterdam-bike.jpg", alt: "The badger in a camel overcoat and cream scarf on a Dutch bike" },
    { image: "/images/club/mascot/look-dinner.jpg", alt: "The badger in an ivory shawl-collar jacket, bow tie undone, in a ballroom at 3 a.m." },
    { image: "/images/club/mascot/look-varsity.jpg", alt: "The badger in a navy varsity jacket on an Amsterdam rooftop at blue hour" },
    { image: "/images/club/mascot/look-suede.jpg", alt: "The badger in a tobacco suede blouson and grey flannels in a London mews" },
  ],
];

/** The points for one way to earn. */
export const earnValue = (id: EarnId) => earn.find((e) => e.id === id)?.value ?? 0;

export type RewardId = "free-shipping" | "ten-off" | "twenty-five-off" | "vn-night" | "members-colour";

/**
 * What points turn into. `shipping` and `amount` rewards become a one-use Shopify code for the member (instant);
 * `experience` rewards are requested and the team gets in touch.
 */
export type Reward = {
  id: RewardId;
  reward: string;
  cost: number;
  /** "1,800", from `cost`. */
  points: string;
  kind: "shipping" | "amount" | "experience";
  /** Euros off, for `amount`. */
  amount?: number;
  /** The big line and the small one on the voucher. */
  face: string;
  caption: string;
};

export const rewards: Reward[] = (
  [
    { id: "free-shipping", reward: "Free shipping on an order", cost: 400, kind: "shipping", face: "Free", caption: "shipping on an order" },
    { id: "ten-off", reward: "€10 off", cost: 800, kind: "amount", amount: 10, face: "€10", caption: "off an order" },
    { id: "twenty-five-off", reward: "€25 off", cost: 1800, kind: "amount", amount: 25, face: "€25", caption: "off an order" },
    { id: "vn-night", reward: "A +1 to a VN night", cost: 2500, kind: "experience", face: "+1", caption: "to a VN night" },
    { id: "members-colour", reward: "A piece made in a members-only colour", cost: 4000, kind: "experience", face: "Yours", caption: "a piece in a members-only colour" },
  ] satisfies Omit<Reward, "points">[]
).map((r) => ({ ...r, points: count(r.cost) }));

export const clubFaqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Members only",
    items: [
      { q: "What is the club?", a: "The membership. It is free: points on every order and on a few other things, three rooms to move up through, and rewards to spend the points on." },
      { q: "How do I join?", a: "Make an account with your email under Become a member. No password: a code comes by email, and the account is your membership." },
      { q: "Can I leave?", a: "Any time. Write and the membership is closed. The points go with it." },
    ],
  },
  {
    group: "Points",
    items: [
      { q: "How are points earned?", a: "On every order, and for everything under Level up: joining, the letters, Instagram, bringing a friend, your birthday and Members Only." },
      { q: "When do points count?", a: "From the day they show in your account. Join before then and the welcome points are waiting." },
      { q: "Do points expire?", a: "After twelve months without an order or a reward." },
      { q: "What about returns?", a: "Points from a returned order come off again. A remake in another size keeps them." },
      { q: "What is the leaderboard?", a: "Three tables: the current drop, this month and all time, each in order of points earned. First names only, and only members see it." },
    ],
  },
  {
    group: "Rooms",
    items: [
      { q: "How many rooms are there?", a: "Three: the Terrace, the Clubhouse and the Rooftop. The room follows the points earned in the last twelve months." },
      { q: "Can I move down a room?", a: "No. Once in a room, it stays yours." },
    ],
  },
  {
    group: "Members Only",
    items: [
      { q: "What is Members Only?", a: "A paid subscription on top of any room. All of it goes to the wild; none of it stays with the brand. Members get discounts at the clubs and events Vis Naturæ partners with." },
      { q: "What does it cost?", a: "The price is announced with the first partner clubs. Write in to hear it first." },
    ],
  },
  {
    group: "Stores",
    items: [{ q: "Does the club work in a store?", a: "Not yet: Vis Naturæ is online only for now. Pop-ups and partner clubs are listed under Stores the day they are confirmed." }],
  },
];
