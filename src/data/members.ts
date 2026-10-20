/**
 * The membership on /members (Leo, 2026-10-16, modelled on nude-project.com/pages/reward-landing): a free club
 * with points and three rooms for everyone, plus Members Only, the paid subscription that goes entirely to
 * conservation (its perks are `memberPerks` in stories.ts). Every number here is a draft for Leo to confirm.
 * Joining is making a Shopify customer account (/account/register); points start counting once they show in it.
 */
export const club = {
  name: "The VN Club",
};

/** Each room is a part of the club; which one a member is in follows the points earned in the last twelve months. */
export type Room = { name: string; points: string; rate: string; image: string; alt: string; perks: string[] };

export const rooms: Room[] = [
  {
    name: "The Clubhouse",
    points: "0–999 points",
    rate: "1 point for every €1",
    image: "/images/moments/home-for-dinner.jpg",
    alt: "Friends at a long candlelit table in the courtyard of an old stone house at dusk, wine being poured",
    perks: ["A first look at new pieces before they go on the site", "Points on your birthday", "Invitations to the community runs and open events"],
  },
  {
    name: "The Terrace",
    points: "1,000–2,999 points",
    rate: "1.25 points for every €1",
    image: "/images/moments/drinks-wall.jpg",
    alt: "Two friends on an old stone sea wall at golden hour, one in an open linen shirt and chinos, the other in a cricket jumper and white linen trousers",
    perks: ["Everything in the Clubhouse", "Invitations to VN nights", "Repairs to the front of the queue"],
  },
  {
    name: "The Rooftop",
    points: "3,000+ points",
    rate: "1.5 points for every €1",
    image: "/images/moments/rooftop.jpg",
    alt: "Two friends on a London rooftop at blue hour among the chimney pots",
    perks: ["Everything in the Terrace", "A welcome gift, made for Rooftop members only", "A say in what is made next", "A seat at the members' dinner"],
  },
];

/** Ways to earn points. */
export const earn: { action: string; points: string }[] = [
  { action: "Join the club", points: "+100" },
  { action: "Every order", points: "1 per €1" },
  { action: "Sign up to the letters", points: "+100" },
  { action: "Follow on Instagram", points: "+50" },
  { action: "Bring a friend who orders", points: "+300" },
  { action: "Your birthday", points: "+200" },
  { action: "Join Members Only", points: "+500" },
];

/** What points turn into. */
export const rewards: { reward: string; points: string }[] = [
  { reward: "Free shipping on an order", points: "400" },
  { reward: "€10 off", points: "800" },
  { reward: "€25 off", points: "1,800" },
  { reward: "A +1 to a VN night", points: "2,500" },
  { reward: "A piece made in a members-only colour", points: "4,000" },
];

export const clubFaqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "The VN Club",
    items: [
      { q: "What is The VN Club?", a: "The membership. It is free: points on every order and on a few other things, three rooms to move up through, and rewards to spend the points on." },
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
    ],
  },
  {
    group: "Rooms",
    items: [
      { q: "How many rooms are there?", a: "Three: the Clubhouse, the Terrace and the Rooftop. The room follows the points earned in the last twelve months." },
      { q: "Can I move down a room?", a: "No. Once in a room, it stays yours." },
    ],
  },
  {
    group: "Members Only",
    items: [
      { q: "What is Members Only?", a: "A paid subscription on top of any room. All of it goes to conservation; none of it stays with the brand. Members get discounts at the clubs and events Vis Naturæ partners with." },
      { q: "What does it cost?", a: "The price is announced with the first partner clubs. Write in to hear it first." },
    ],
  },
  {
    group: "Stores",
    items: [{ q: "Does the club work in a store?", a: "Not yet: Vis Naturæ is online only for now. Pop-ups and partner clubs are listed under Stores the day they are confirmed." }],
  },
];
