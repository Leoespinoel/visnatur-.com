import { partners, site } from "./site";
import { dispatchLabel, formatPrice, madeToOrderLabel, transitLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";

/**
 * Stories (/stories): films, journal pieces, interviews and past newsletters, each with its own page at
 * /stories/<slug>. Newest first; the first entry leads the page. Only write what is true: no invented
 * people, quotes or figures. Interviews go up once a partner's agreement is signed (see `forthcoming`).
 */
export type ArticleKind = "film" | "journal" | "interview" | "letter";

export const kindLabels: Record<ArticleKind, string> = { film: "Film", journal: "Journal", interview: "Interview", letter: "Letter" };

/** One piece of an article body. `qa` is a question and its answer, for interviews. */
export type Block =
  | { type: "p"; text: string }
  | { type: "quote"; text: string; by?: string }
  /** `size` (the file's own pixels) shows the image whole and centred, for marks and drawings; without it, a 3:2 photo. */
  | { type: "image"; src: string; alt: string; caption?: string; size?: { width: number; height: number } }
  | { type: "qa"; q: string; a: string };

export type Article = {
  slug: string;
  kind: ArticleKind;
  title: string;
  dek: string;
  /** Year and month published, "2026-10". */
  month: string;
  image: string;
  alt: string;
  /** Films: the file that plays at the top of the page, with `image` as its poster. */
  video?: string;
  /** Films: running time, "0:27". */
  runtime?: string;
  /** For the slides at the top of /stories: a wide picture when `image` is tall, and where to centre it on phones. */
  hero?: { image?: string; alt?: string; position?: string };
  body: Block[];
  /** Where to go next, under the body. */
  links: { label: string; href: string }[];
};


export const articles: Article[] = [
  {
    slug: "signature-and-collections",
    kind: "journal",
    title: "Signature, always. Collections, once.",
    dek: "Three ways to buy: the Signature line in stock, collections in limited numbers, and any Signature piece made to order.",
    month: "2026-10",
    image: "/images/atelier/cutting.jpg",
    alt: "A tailor cutting cream linen along a chalk line in a stone workshop with tall windows",
    hero: { image: "/images/atelier/press.jpg", alt: "A master tailor pressing a cricket jumper while an apprentice folds a linen shirt into tissue", position: "50% 50%" },
    body: [
      {
        type: "p",
        text: `The Signature line is the permanent collection: the pieces worn most, kept in stock in Mauritius and dispatched within ${dispatchLabel()}. They stay on the site, season after season.`,
      },
      {
        type: "p",
        text: "Collections are something else: a handful of designs, made once in limited numbers and released on a date. When they are gone, they are gone.",
      },
      { type: "quote", text: "Signature for every day. Collections for the ones who were there." },
      {
        type: "p",
        text: `And any Signature piece can be made to order: the sleeves, the length or the fit adjusted, then cut and sewn by hand for ${formatPrice(site.delivery.madeToOrderSurchargeCents)} more, ready ${madeToOrderLabel()} after the order.`,
      },
      { type: "image", src: "/images/atelier/hands.jpg", alt: "A tailor's hands checking the cuff of a pale-blue linen shirt" },
      {
        type: "p",
        text: `Whichever way, everything is made by hand in Mauritius, ${pledgePercentLabel()} of profits goes to creating and sustaining the environments we love wearing the pieces in, and if anything ever gives, it is repaired for free, for life.`,
      },
    ],
    links: [
      { label: "Made to order", href: "/made-to-order" },
      { label: "Sizing", href: "/made-to-order#sizing" },
    ],
  },
  {
    slug: "the-grind-then-the-calm",
    kind: "film",
    title: "The grind, then the calm.",
    dek: "Twelve sports at full intensity, two seconds a shot. Then the same faces, standing still.",
    month: "2026-10",
    image: "/film/poster-landscape.jpg",
    alt: "A rugby winger sprinting for the line under floodlights",
    video: "/film/hero-landscape.mp4",
    runtime: "0:27",
    hero: { position: "38% 50%" },
    body: [
      {
        type: "p",
        text: "The film that opens this site is the grind: rugby, cycling, golf, surfing, kitesurfing, wakeboarding, skateboarding, snowboarding, downhill, freeride skiing, trail running and climbing, each at full competition pitch, cut to about two seconds a shot and never held.",
      },
      {
        type: "p",
        text: "The calm is the other half. The same people afterwards, one at a time, standing still and looking into the lens. Mud still on a face, a board under an arm, a bike against a wall. Nobody has to smile.",
      },
      { type: "image", src: "/community/p1.jpg?v=2", alt: "A rugby player on an empty pitch by the sea in a red and white striped rugby shirt", caption: "The calm: rugby." },
      {
        type: "p",
        text: "There is no competition kit anywhere in it. Every shot, the effort and the stillness after, is in Vis Naturæ pieces: clothes made for the hours after, worn through the hours before as well.",
      },
      { type: "quote", text: "The calm is the reward after the effort." },
      { type: "image", src: "/community/p12.jpg?v=2", alt: "A climber in an orange linen shirt at the top of a sea cliff", caption: "The calm: climbing." },
      {
        type: "p",
        text: "Those portraits also make up our community wall, until pictures from the people wearing the pieces take their place.",
      },
    ],
    links: [
      { label: "In the wild", href: "/stories#community" },
      { label: "Shop the pieces", href: "/shop" },
    ],
  },
  {
    slug: "why-our-badger-sleeps-on-its-back",
    kind: "journal",
    title: "Why our badger sleeps on its back.",
    dek: "Most animals survive by knowing when to run. The honey badger simply refuses to.",
    month: "2026-10",
    image: "/products/sett-cap-navy-detail.jpg",
    alt: "The badger embroidered in ecru on the front of a navy cap",
    body: [
      {
        type: "p",
        text: "The honey badger lives across Africa and is no bigger than a house cat. It spends its life picking fights with animals far bigger than itself: the black mamba, lions, even elephants.",
      },
      {
        type: "p",
        text: "Its skin is so thick and loose that teeth and claws struggle to find a hold. It digs through hard ground in minutes and raids beehives through a thousand stings. When a cobra sinks its fangs in, it has been seen to lie down, sleep it off, and get back up to finish the hunt.",
      },
      { type: "image", src: "/brand/badger-mark.png", alt: "The Vis Naturæ badger, asleep on its back", size: { width: 852, height: 300 } },
      { type: "p", text: "That sleep is the one on our label. On its back, paws folded, one fight behind it and the next not yet begun." },
      { type: "quote", text: "Go all in, then rest like you mean it." },
      {
        type: "p",
        text: "You will find it small and quiet: at the ankle of a sock, low on the front of a cap, on the chest of a linen shirt, mostly stitched in the colour of the cloth.",
      },
      { type: "image", src: "/products/burrow-sock-olive-detail.jpg", alt: "The badger embroidered tone on tone on an olive ribbed cotton sock" },
    ],
    links: [
      { label: "The full story", href: "/about#the-mark" },
      { label: "Shop accessories", href: "/shop/outerwear-accessories" },
    ],
  },
  {
    slug: "made-by-hand",
    kind: "film",
    title: "Made by hand.",
    dek: "Every piece is cut and sewn by hand in a small workshop in Mauritius.",
    month: "2026-10",
    image: "/film/atelier-poster.jpg?v=r1016",
    alt: "Hands guiding oat linen under the needle of a sewing machine",
    video: "/film/atelier-landscape.mp4",
    runtime: "0:23",
    body: [
      {
        type: "p",
        text: "Every piece starts on a cutting table in a small workshop in Mauritius: the cloth cut, sewn, pressed, folded and boxed by hand.",
      },
      {
        type: "p",
        text: "This short film follows that work: the needle, the seam, the fold. It is the part of a garment most labels would rather you didn't think about. We think it is the best part.",
      },
      { type: "image", src: "/images/campaign-atelier.jpg", alt: "A seamstress at her worktable in a workshop hung with red, green and yellow linen shirts" },
      { type: "quote", text: "There is more inside each piece than the photographs show. We leave that for you to find." },
      {
        type: "p",
        text: `From the workshop, Signature pieces leave within ${dispatchLabel()} and reach most of Europe in ${transitLabel()}. A piece made to order takes ${madeToOrderLabel()}.`,
      },
    ],
    links: [{ label: "Made to order", href: "/made-to-order" }],
  },
  {
    slug: "highest-leverage-not-highest-profile",
    kind: "journal",
    title: "Where the fifth goes.",
    dek: "1/5 of profits to creating and sustaining the environments we love wearing the pieces in, and how we choose where it goes.",
    month: "2026-10",
    image: "/images/sea-cliff-wide.jpg?v=r1016",
    alt: "A man in a cream quarter-zip knit on a green sea cliff above the ocean at golden hour",
    body: [
      {
        type: "p",
        text: `${pledgePercentLabel()} of each year's profit after tax goes to creating and sustaining the environments we love wearing the pieces in. The figure is published with the accounts, the people we build with are named here before the first payment, and every payment is listed as the receipts come in.`,
      },
      { type: "quote", text: "Where the fifth does the most." },
      {
        type: "p",
        text: "Not to the best-known name, and not spread so thin it changes nothing. Everyone we build with has to pass three tests. Concentrated: small places that hold a lot of life. Close to the edge: the places with the least left, where money now does more than money later. Counted: people who count what survived, not what was planted, and publish it.",
      },
      {
        type: "p",
        text: "Three places pass: the reef around Mauritius, the last of the island's native forest, and the mangrove shore. The agreements are being signed, and the names go up before the first payment is made. Then the people doing the work will be interviewed here.",
      },
    ],
    links: [
      { label: "The fifth", href: "/conservation" },
      { label: "Where it goes", href: "/conservation#partners" },
    ],
  },
];

/**
 * Interviews still to come, shown under "In conversation" until each one is published: the
 * people we build with (named here once they are in site.ts) and the workshop that makes the pieces.
 */
export const forthcoming: { name: string; focus: string; mark: (typeof partners)[number]["mark"] | "workshop" }[] = [
  { name: "The workshop", focus: "The people who cut and sew every piece by hand in Mauritius", mark: "workshop" },
  ...partners.map((p) => ({ name: p.name, focus: p.focus, mark: p.mark })),
];

/**
 * The three ways we sponsor, under "Sponsorship" on /stories: individual athletes and ambassadors,
 * artists, and clubs, teams and events. Each applies by email; `template` prefills the body. No one is sponsored yet,
 * so name nobody here until they have agreed.
 */
export type Sponsorship = {
  key: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  give: string[];
  lookFor: string[];
  cta: string;
  subject: string;
  template: string[];
};

export const sponsorships: Sponsorship[] = [
  {
    key: "individuals",
    title: "Athletes & ambassadors",
    text: "Surfers, kiters, sailors, golfers, climbers, runners: people who compete hard, or simply go all in at something, and care about the places they do it in.",
    image: "/community/surf-still.jpg",
    alt: "A surfer crouched deep in the barrel of a breaking wave",
    give: [
      "Pieces made for you, in your size, through the season",
      "Your story in our films and on these pages, in your own words",
      "A say in the next pieces we make, tested where you train",
    ],
    lookFor: [
      "Commitment you can see, at any level",
      "Care for the coast, the mountains and the water you use",
      "Honesty: wear what you like, and say what you don't",
    ],
    cta: "Apply as an athlete",
    subject: "Sponsorship: athlete",
    template: ["Name:", "Sport or discipline:", "Where you train and compete:", "Links (Instagram, results, press):", "Why Vis Naturæ:"],
  },
  {
    key: "artists",
    title: "Artists",
    text: "Painters, photographers, illustrators, filmmakers, musicians and makers: people whose work starts in the sea, the forest or the island, and who keep at it.",
    image: "/images/sponsor-artist.jpg?v=r1016",
    alt: "A painter at a wooden easel on the beach below Le Morne in an open sage linen shirt and white linen trousers",
    give: [
      "Pieces made for you, in your size, to work and live in",
      "Your work in our films and on these pages, credited by name",
      "A chance to make something with us: a print, a lining or a label",
    ],
    lookFor: [
      "Work that comes from the places we build",
      "A practice you keep at, in any medium, at any stage",
      "Honesty: make what you mean, and tell us what you think",
    ],
    cta: "Apply as an artist",
    subject: "Sponsorship: artist",
    template: ["Name:", "What you make (medium):", "Where you work:", "Links (portfolio, Instagram, press):", "What you would make with us:"],
  },
  {
    key: "corporate",
    title: "Clubs, teams & events",
    text: "Golf and sailing clubs, rugby and surf clubs, regattas, tournaments and teams of every kind, in Mauritius and across Europe.",
    image: "/images/campaign-golf.jpg?v=r1016",
    alt: "Two golfers on a seaside tee, one swinging in a white polo and white shorts, the other in a navy knit polo with a leather golf bag",
    give: [
      "Pieces for the whole team or event, made to order to each wearer's measurements",
      "Your club or event in our films and on these pages",
    ],
    lookFor: [
      "Clubs and events rooted in a place worth keeping",
      "A shared interest in the reef, forest or water around you",
      "Room to tell the story honestly",
    ],
    cta: "Propose a partnership",
    subject: "Sponsorship: club, team or event",
    template: ["Club, team or event:", "Where and when:", "How many people:", "Links:", "What you have in mind:"],
  },
];

/** A sponsorship's application email, with its template in the body. */
export const sponsorshipMailto = (s: Sponsorship) =>
  `mailto:${site.email}?subject=${encodeURIComponent(s.subject)}&body=${encodeURIComponent(s.template.join("\n\n") + "\n")}`;

/** Members Only on /stories#members: a paid subscription, every proceed to conservation, with discounts in return. */
export const memberPerks: { title: string; text: string }[] = [
  { title: "All of it to the wild", text: "Every subscription goes to the wild in full: the reef, the forest and the shore. We keep none of it." },
  { title: "Club discounts", text: "Member discounts at the clubs we partner with." },
  { title: "Event discounts", text: "Member discounts on tickets to our events and the ones we back." },
];

/** Joining is an email for now, like a sponsorship application, until the shop has customer accounts. */
export const membersMailto = `mailto:${site.email}?subject=${encodeURIComponent("Members Only")}&body=${encodeURIComponent(
  ["Name:", "The email you order with:", "Where you are:"].join("\n\n") + "\n",
)}`;

/** The handle at the end of `site.instagram`, without the @. */
export const instagramHandle = site.instagram.split("/").filter(Boolean).pop() ?? "";

export const articleHref = (a: Article) => `/stories/${a.slug}`;

/** "2 min read" from the words in the body, or a film's running time. */
export function readLabel(a: Article): string {
  if (a.runtime) return a.runtime;
  const words = a.body
    .map((b) => (b.type === "p" || b.type === "quote" ? b.text : b.type === "qa" ? `${b.q} ${b.a}` : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/**
 * Events, after redbull.com's events row: what we host or sponsor, sorted into Upcoming and Past by
 * date on the visitor's side. Empty until the first one is confirmed; only list real, agreed events.
 */
export type StoryEvent = {
  title: string;
  /** ISO dates, "2026-11-07"; `end` for events over several days. */
  start: string;
  end?: string;
  place: string;
  sport: string;
  image: string;
  alt: string;
  status?: "registrations-open" | "upcoming" | "invitation-only";
  /** The event's own page, or its story here once it has happened. */
  href?: string;
};

export const eventStatusLabels: Record<NonNullable<StoryEvent["status"]>, string> = {
  "registrations-open": "Registrations open",
  upcoming: "Upcoming",
  "invitation-only": "Invitation only",
};

export const events: StoryEvent[] = [];

/**
 * Until the first event is agreed, the events stage on /stories turns through the kinds of day we mean to host or back,
 * one picture each, every one ending in the call to propose an event (Leo, 2026-10-21). Replaced by the events themselves
 * as soon as `events` has any.
 */
export const plannedDays: { key: string; eyebrow: string; title: string; dek: string; image: string; alt: string }[] = [
  {
    key: "water",
    eyebrow: "On the water",
    title: "Kite days and regattas.",
    dek: "A lagoon, a course laid out in the morning and a day on the water.",
    image: "/images/active/kitesurf.jpg",
    alt: "A kitesurfer carving across a turquoise lagoon, throwing spray, a mountain behind",
  },
  {
    key: "course",
    eyebrow: "On the course",
    title: "Golf days.",
    dek: "Eighteen holes by the sea, then lunch at the clubhouse.",
    image: "/images/campaign-golf.jpg?v=r1016",
    alt: "A golfer teeing off by the sea in a white polo and white shorts, his partner in a navy knit polo and stone trousers holding a leather golf bag",
  },
  {
    key: "run",
    eyebrow: "On the road and the trail",
    title: "Morning runs.",
    dek: "Out early along the front or up the hill, before the heat, coffee after.",
    image: "/images/run-club.jpg?v=r1016",
    alt: "A run club out early along a seafront promenade, a group of friends in white tees and navy shorts",
  },
  {
    key: "surf",
    eyebrow: "In the water",
    title: "Surf meets.",
    dek: "A swell, a few boards and the people who got up for it.",
    image: "/images/active/barrel.jpg",
    alt: "A surfer crouched deep inside a hollow barrel, one hand trailing along the wave",
  },
];

/** "17 October 2026", or "21 – 26 October 2026" across several days. */
export function eventDates(e: StoryEvent): string {
  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
  const full = { day: "numeric", month: "long", year: "numeric" } as const;
  if (!e.end || e.end === e.start) return fmt(e.start, full);
  const [s, t] = [e.start.split("-"), e.end.split("-")];
  if (s[0] !== t[0]) return `${fmt(e.start, full)} – ${fmt(e.end, full)}`;
  if (s[1] !== t[1]) return `${fmt(e.start, { day: "numeric", month: "long" })} – ${fmt(e.end, full)}`;
  return `${Number(s[2])} – ${fmt(e.end, full)}`;
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export const articlesOf = (kind: ArticleKind) => articles.filter((a) => a.kind === kind);

/** "2026-10" as "October 2026". */
export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)));
}
