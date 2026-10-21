/**
 * The club's points, worked out from scratch on every visit (Leo, 2026-10-20): nothing stores a balance, so nothing
 * can drift or be edited into one. The inputs are the member's Shopify orders and the club record the server keeps on
 * the customer (custom.club, written only through the Admin API). Pure: no fetching, so the API route, the dev preview
 * (/dev/club) and scripts/club-ledger-check.mts all run the same arithmetic. Every number comes from src/data/members.ts.
 *
 * The rules, as the FAQ on /members states them:
 * - Orders earn points per €1 of the subtotal (after discounts), at the rate of the room the member was in when ordering.
 *   They land `pendingDays` after the order ships; until then they show as pending and can't be spent.
 * - A refund takes its points back: before they land it lowers them, after they land it adds a "Returned" line.
 * - The room follows the points earned in the last `windowMonths` months, and nobody moves down.
 * - Points expire after `expiryMonths` months without an order or a claimed reward.
 */

// Relative, not "@/…", so the scripts (scripts/ts-resolve.mjs) can import this file as well as the site.
import { club, earnValue, rewards, rooms, type RewardId, type RoomId } from "../data/members";

/** An order as the ledger needs it, in euros (normalised from the Admin API in src/lib/club-store.ts). */
export type LedgerOrder = {
  id: string;
  /** "#1004" */
  name: string;
  processedAt: string;
  cancelledAt: string | null;
  test: boolean;
  /** Admin displayFinancialStatus: PAID, PARTIALLY_REFUNDED, REFUNDED, PENDING, AUTHORIZED, VOIDED… */
  financial: string;
  /** Admin displayFulfillmentStatus: FULFILLED, UNFULFILLED, PARTIALLY_FULFILLED… */
  fulfillment: string;
  /** Subtotal after discounts, as ordered and as it stands after refunds. */
  subtotal: number;
  current: number;
  discountCodes: string[];
  /** The latest refund and the latest shipment, if any. */
  refundedAt: string | null;
  shippedAt: string | null;
  /** Drop id → the share of the subtotal that is that drop's pieces (0–1), for the drop table of the leaderboard. */
  dropShare?: Record<string, number>;
};

export type ClaimStatus = "pending" | "issued" | "requested" | "void";
export type Claim = {
  id: string;
  reward: RewardId;
  /** The cost when claimed, so a later price change never rewrites the past. */
  points: number;
  at: string;
  status: ClaimStatus;
  code?: string;
  endsAt?: string;
  discount?: string;
};
export type Adjustment = { at: string; points: number; note: string };

/** The club record on the customer (metafield custom.club, JSON). */
export type ClubStore = {
  v: 1;
  letters?: string;
  instagram?: string;
  membersOnly?: string;
  birthday?: { md: string; set: string };
  claims: Claim[];
  adjust: Adjustment[];
};

export type ClubInput = {
  firstName: string;
  /** When the account was made. */
  createdAt: string;
  /** Signed up to the letters (Shopify email marketing), whether or not the club has recorded it yet. */
  lettersLive: boolean;
  orders: LedgerOrder[];
  store: ClubStore;
};

export type HistoryStatus = "Pending" | "Added" | "Spent" | "Returned" | "Expired";
/** `order`, `ordered` and `dropShare` are set on the rows an order produces, so the leaderboard can place and apportion its points without the order rules. */
export type HistoryRow = { at: string; what: string; points: number; status: HistoryStatus; order?: string; ordered?: string; dropShare?: Record<string, number> };

export type LeagueRow = { name: string; room: RoomId; points: number; rank: number; you?: boolean };
export type LeagueTableId = "drop" | "month" | "all";
export type LeagueTable = {
  id: LeagueTableId;
  label: string;
  note: string;
  rows: LeagueRow[];
  /** The member's own row when outside `rows` (or in them, with `you` set there as well). */
  you: LeagueRow | null;
  /** Shown instead of the table when nothing counts yet. */
  empty?: string;
};
export type League = { tables: LeagueTable[]; members: number; asOf: string };

export type WalletStatus = "ready" | "used" | "expired" | "requested" | "preparing";
export type WalletItem = { id: string; reward: RewardId; points: number; at: string; status: WalletStatus; code?: string; endsAt?: string; usedOn?: string };

/** What the member page shows. Sent to the browser, so it holds nothing the member shouldn't see. */
export type ClubView = {
  firstName: string;
  memberSince: string;
  room: RoomId;
  balance: number;
  pending: number;
  /** Points earned in the last twelve months, which set the room. */
  earned: number;
  next: { room: RoomId; points: number } | null;
  /** When the points expire unless the member orders or claims before then. */
  expiresOn: string | null;
  wallet: WalletItem[];
  history: HistoryRow[];
  done: { letters: boolean; instagram: boolean; membersOnly: boolean; birthday: string | null };
  /** False until the shop's Admin access is set up: points from orders and claiming are off. */
  live: boolean;
  /** The club's members in order (buildLeague); absent on the sign-in-only view. */
  league?: League;
};

export const emptyStore = (): ClubStore => ({ v: 1, claims: [], adjust: [] });

const DAY = 86_400_000;
const ms = (iso: string) => Date.parse(iso);
const iso = (t: number) => new Date(t).toISOString();
const addMonths = (t: number, n: number) => {
  const d = new Date(t);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.getTime();
};
const isDate = (v: unknown): v is string => typeof v === "string" && !Number.isNaN(Date.parse(v));
const REWARD_IDS = new Set<string>(rewards.map((r) => r.id));
const STATUSES = new Set<string>(["pending", "issued", "requested", "void"]);

/** The club record from Shopify, defensively: anything malformed is dropped rather than trusted. */
export function parseStore(raw: unknown): ClubStore {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const store = emptyStore();
  for (const k of ["letters", "instagram", "membersOnly"] as const) if (isDate(o[k])) store[k] = o[k];
  const b = o.birthday as Record<string, unknown> | undefined;
  if (b && typeof b.md === "string" && validBirthday(b.md) && isDate(b.set)) store.birthday = { md: b.md, set: b.set };
  if (Array.isArray(o.claims)) {
    for (const c of o.claims as Record<string, unknown>[]) {
      if (!c || typeof c.id !== "string" || !REWARD_IDS.has(c.reward as string) || !Number.isFinite(c.points) || !isDate(c.at) || !STATUSES.has(c.status as string)) continue;
      store.claims.push({
        id: c.id,
        reward: c.reward as RewardId,
        points: Math.max(0, Math.round(c.points as number)),
        at: c.at,
        status: c.status as ClaimStatus,
        ...(typeof c.code === "string" ? { code: c.code } : {}),
        ...(isDate(c.endsAt) ? { endsAt: c.endsAt } : {}),
        ...(typeof c.discount === "string" ? { discount: c.discount } : {}),
      });
    }
  }
  if (Array.isArray(o.adjust)) {
    for (const a of o.adjust as Record<string, unknown>[]) {
      if (a && isDate(a.at) && Number.isFinite(a.points)) store.adjust.push({ at: a.at, points: Math.round(a.points as number), note: typeof a.note === "string" ? a.note : "Adjustment" });
    }
  }
  return store;
}

/** "MM-DD", a day that exists in a leap year. */
export function validBirthday(md: string): boolean {
  const m = /^(\d{2})-(\d{2})$/.exec(md);
  if (!m) return false;
  const d = new Date(Date.UTC(2024, Number(m[1]) - 1, Number(m[2])));
  return d.getUTCMonth() === Number(m[1]) - 1 && d.getUTCDate() === Number(m[2]);
}

/** The birthday in a given year (29 February falls on the 28th in other years). */
function birthdayIn(year: number, md: string): number {
  const [m, d] = md.split("-").map(Number);
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return Date.UTC(year, m - 1, m === 2 && d === 29 && !leap ? 28 : d);
}

/** The room a number of points earned in twelve months qualifies for. */
export function roomFor(points: number): RoomId {
  return [...rooms].reverse().find((r) => points >= r.min)!.id;
}
const roomIndex = (id: RoomId) => rooms.findIndex((r) => r.id === id);

const label = {
  join: "Joined the club",
  letters: "Signed up to the letters",
  instagram: "Followed on Instagram",
  membersOnly: "Joined Members Only",
  birthday: "Happy birthday",
  expired: "Points expired",
};

type Ev =
  | { at: number; kind: "earn"; points: number; what: string }
  | { at: number; kind: "spend"; points: number; what: string }
  | { at: number; kind: "order"; order: LedgerOrder }
  | { at: number; kind: "land"; points: number; what: string; returned: boolean; order: LedgerOrder };

const orderTag = (o: LedgerOrder) => ({ order: o.name, ordered: o.processedAt, ...(o.dropShare ? { dropShare: o.dropShare } : {}) });

/** The member page's numbers, history and wallet, as of `now`. */
export function computeClub(input: ClubInput, now = Date.now(), live = true): ClubView {
  const start = ms(club.startsAt);
  const { store } = input;
  const joinedAt = Math.max(ms(input.createdAt), start);

  // Everything that happens on a fixed date. Orders are scheduled as they are placed, because their rate depends on the
  // room at that moment; what they earn then lands later (`land`).
  const events: Ev[] = [{ at: joinedAt, kind: "earn", points: earnValue("join"), what: label.join }];
  const letters = store.letters ? ms(store.letters) : input.lettersLive ? now : null;
  if (letters !== null) events.push({ at: Math.max(letters, joinedAt), kind: "earn", points: earnValue("letters"), what: label.letters });
  if (store.instagram) events.push({ at: Math.max(ms(store.instagram), joinedAt), kind: "earn", points: earnValue("instagram"), what: label.instagram });
  if (store.membersOnly) events.push({ at: Math.max(ms(store.membersOnly), joinedAt), kind: "earn", points: earnValue("members-only"), what: label.membersOnly });
  if (store.birthday) {
    const from = ms(store.birthday.set) + club.birthdayLeadDays * DAY;
    for (let y = new Date(from).getUTCFullYear(); y <= new Date(now).getUTCFullYear(); y++) {
      const t = birthdayIn(y, store.birthday.md);
      if (t >= from && t >= joinedAt && t <= now) events.push({ at: t, kind: "earn", points: earnValue("birthday"), what: label.birthday });
    }
  }
  for (const a of store.adjust) events.push({ at: ms(a.at), kind: "earn", points: a.points, what: a.note });
  for (const c of store.claims) {
    if (c.status === "void") continue;
    events.push({ at: ms(c.at), kind: "spend", points: c.points, what: rewards.find((r) => r.id === c.reward)!.reward });
  }
  for (const o of input.orders) {
    if (o.cancelledAt || o.test || ms(o.processedAt) < start) continue;
    events.push({ at: ms(o.processedAt), kind: "order", order: o });
  }

  let balance = 0;
  let pending = 0;
  let room: RoomId = rooms[0].id;
  let lastActivity = joinedAt;
  let expiredAt: number | null = null;
  const earnedLog: { at: number; points: number }[] = [];
  const history: HistoryRow[] = [];
  const queue = [...events].sort((a, b) => a.at - b.at);

  const earnedSince = (t: number) => earnedLog.filter((e) => e.at > addMonths(t, -club.windowMonths) && e.at <= t).reduce((s, e) => s + e.points, 0);
  const promote = (t: number) => {
    const qualifies = roomFor(earnedSince(t));
    if (roomIndex(qualifies) > roomIndex(room)) room = qualifies;
  };
  // Twelve months after the last order or reward, whatever is left expires.
  const expireBefore = (t: number) => {
    const deadline = addMonths(lastActivity, club.expiryMonths);
    if (balance > 0 && t > deadline) {
      const at = expiredAt === null || expiredAt < deadline ? deadline : t;
      history.push({ at: iso(at), what: label.expired, points: -balance, status: "Expired" });
      balance = 0;
      expiredAt = at;
    }
  };
  const insert = (ev: Ev) => {
    const i = queue.findIndex((q) => q.at > ev.at);
    if (i === -1) queue.push(ev);
    else queue.splice(i, 0, ev);
  };

  while (queue.length) {
    const ev = queue.shift()!;
    if (ev.at > now) {
      // Only an order's points can still be on their way.
      if (ev.kind === "land" && !ev.returned) {
        pending += ev.points;
        history.push({ at: iso(ev.at), what: ev.what, points: ev.points, status: "Pending", ...orderTag(ev.order) });
      }
      continue;
    }
    expireBefore(ev.at);
    if (ev.kind === "earn") {
      balance += ev.points;
      earnedLog.push({ at: ev.at, points: ev.points });
      history.push({ at: iso(ev.at), what: ev.what, points: ev.points, status: ev.points < 0 ? "Returned" : "Added" });
      promote(ev.at);
    } else if (ev.kind === "spend") {
      balance -= ev.points;
      lastActivity = ev.at;
      history.push({ at: iso(ev.at), what: ev.what, points: -ev.points, status: "Spent" });
    } else if (ev.kind === "order") {
      lastActivity = ev.at;
      const o = ev.order;
      const rate = rooms[roomIndex(room)].multiplier;
      const full = Math.floor(o.subtotal * rate);
      const kept = Math.floor(Math.max(0, o.current) * rate);
      const what = `Order ${o.name}`;
      const tag = orderTag(o);
      const paid = o.financial === "PAID" || o.financial === "PARTIALLY_REFUNDED" || o.financial === "REFUNDED";
      const shipped = o.fulfillment === "FULFILLED" && o.shippedAt;
      const landsAt = shipped ? ms(o.shippedAt!) + club.pendingDays * DAY : null;
      const refundedAt = o.refundedAt ? ms(o.refundedAt) : null;
      if (!paid || landsAt === null) {
        // Not paid or not shipped yet: on its way, at today's value.
        if (kept > 0) {
          pending += kept;
          history.push({ at: iso(ev.at), what, points: kept, status: "Pending", ...tag });
        } else if (refundedAt !== null) history.push({ at: iso(refundedAt), what: `${what}, returned`, points: 0, status: "Returned", ...tag });
      } else if (refundedAt !== null && refundedAt <= landsAt) {
        // Returned before the points landed: only what was kept lands.
        if (kept > 0) insert({ at: landsAt, kind: "land", points: kept, what, returned: false, order: o });
        else history.push({ at: iso(refundedAt), what: `${what}, returned`, points: 0, status: "Returned", ...tag });
      } else {
        insert({ at: landsAt, kind: "land", points: full, what, returned: false, order: o });
        if (refundedAt !== null && full > kept) insert({ at: refundedAt, kind: "land", points: kept - full, what: `${what}, returned`, returned: true, order: o });
      }
    } else {
      balance += ev.points;
      earnedLog.push({ at: ev.at, points: ev.points });
      history.push({ at: iso(ev.at), what: ev.what, points: ev.points, status: ev.returned ? "Returned" : "Added", ...orderTag(ev.order) });
      promote(ev.at);
    }
  }
  expireBefore(now);

  const earned = Math.max(0, earnedSince(now));
  const nextRoom = rooms[roomIndex(room) + 1];
  // Codes are matched against the codes used on the member's orders, so "used" needs no record of its own.
  const used = new Map<string, string>();
  for (const o of input.orders) if (!o.cancelledAt) for (const c of o.discountCodes) used.set(c.toUpperCase(), o.name);

  const wallet: WalletItem[] = store.claims
    .filter((c) => c.status !== "void")
    .map((c) => {
      const usedOn = c.code ? used.get(c.code.toUpperCase()) : undefined;
      const status: WalletStatus =
        c.status === "requested" ? "requested"
        : c.status === "pending" ? "preparing"
        : usedOn ? "used"
        : c.endsAt && ms(c.endsAt) < now ? "expired"
        : "ready";
      return { id: c.id, reward: c.reward, points: c.points, at: c.at, status, code: c.code, endsAt: c.endsAt, usedOn };
    })
    .sort((a, b) => ms(b.at) - ms(a.at));

  return {
    firstName: input.firstName,
    memberSince: input.createdAt,
    room,
    balance: Math.max(0, balance),
    pending,
    earned,
    next: nextRoom ? { room: nextRoom.id, points: Math.max(0, nextRoom.min - earned) } : null,
    expiresOn: balance > 0 ? iso(addMonths(lastActivity, club.expiryMonths)) : null,
    wallet,
    history: history.sort((a, b) => ms(b.at) - ms(a.at)),
    done: { letters: letters !== null, instagram: Boolean(store.instagram), membersOnly: Boolean(store.membersOnly), birthday: store.birthday?.md ?? null },
    live,
  };
}

/** A member as the leaderboard needs them: who they are to the other members, and the same input their own page is built from. */
export type LeagueMember = { id: string; name: string; input: ClubInput };
/** The drop the leaderboard's first table is about (src/data/drops.ts has the full type; the ledger needs only this). */
export type LeagueDrop = { id: string; name: string };

/** "Léo N." for the other members; "A member" when the account has no first name. */
export function leagueName(firstName: string | null | undefined, lastName: string | null | undefined): string {
  const first = (firstName ?? "").trim();
  if (!first) return "A member";
  const initial = (lastName ?? "").trim().charAt(0).toUpperCase();
  return initial ? `${first} ${initial}.` : first;
}

const sameMonth = (iso: string, now: number) => {
  const a = new Date(iso);
  const b = new Date(now);
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth();
};

/**
 * The leaderboard on /members: every member in order of points earned, in three tables (the current drop, this month, all
 * time). Points on their way count, returns come off, expiries are ignored; a drop counts an order's points by the share of
 * its subtotal that was the drop's pieces. Ties share a position, the earlier member first. Each table keeps the top `top`
 * rows plus the member's own. Pure: the API route, /dev/club and scripts run the same arithmetic.
 */
export function buildLeague(members: LeagueMember[], youId: string, opts: { drop?: LeagueDrop; now?: number; top?: number } = {}): League {
  const now = opts.now ?? Date.now();
  const top = opts.top ?? club.leagueTop;
  const scored = members.map((m) => {
    const v = computeClub(m.input, now);
    // Pending rows are dated the day they land, which may be ahead of `now`: they count, placed on the day of the order.
    const counted = v.history.filter((h) => h.status === "Pending" || h.status === "Added" || h.status === "Returned");
    const sum = (rows: HistoryRow[], weight: (h: HistoryRow) => number = () => 1) => Math.max(0, Math.round(rows.reduce((s, h) => s + h.points * weight(h), 0)));
    return {
      id: m.id,
      name: m.name,
      room: v.room,
      since: ms(m.input.createdAt),
      points: {
        all: sum(counted),
        month: sum(counted.filter((h) => sameMonth(h.ordered ?? h.at, now))),
        drop: opts.drop ? sum(counted.filter((h) => h.order), (h) => h.dropShare?.[opts.drop!.id] ?? 0) : 0,
      },
    };
  });

  const table = (id: LeagueTableId, label: string, note: string, empty?: string): LeagueTable => {
    const order = [...scored].sort((a, b) => b.points[id] - a.points[id] || a.since - b.since);
    let rank = 0;
    const rows: (LeagueRow & { id: string })[] = order.map((m, i) => {
      if (i === 0 || m.points[id] < order[i - 1].points[id]) rank = i + 1;
      return { id: m.id, name: m.name, room: m.room, points: m.points[id], rank, ...(m.id === youId ? { you: true } : {}) };
    });
    const scoring = rows.filter((r) => r.points > 0);
    const you = rows.find((r) => r.id === youId) ?? null;
    const strip = (r: LeagueRow & { id: string }): LeagueRow => ({ name: r.name, room: r.room, points: r.points, rank: r.rank, ...(r.you ? { you: true } : {}) });
    // Only members with points make the list; everyone else shares the rank below them, and sees it on their own row.
    const shown = scoring.slice(0, top);
    return {
      id,
      label,
      note,
      rows: shown.map(strip),
      you: you ? strip(you) : null,
      ...(scoring.length ? {} : { empty }),
    };
  };

  return {
    tables: [
      opts.drop
        ? table("drop", opts.drop.name, `Points earned on ${opts.drop.name}'s pieces.`, `Nobody has earned on ${opts.drop.name} yet.`)
        : table("drop", "The drop", "Points earned on the current drop's pieces.", "DIVA, the first drop, opens this table."),
      table("month", "This month", "Points earned this month.", "Nobody has earned this month yet."),
      table("all", "All time", "Points earned since the club opened.", "The table fills as members join."),
    ],
    members: members.length,
    asOf: iso(now),
  };
}
