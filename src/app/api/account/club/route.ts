import { currentDrop } from "@/data/drops";
import { club, rewards } from "@/data/members";
import { buildLeague, cleanSocials, computeClub, emptyStore, leagueName, validBirthday, type ClubStore, type ClubView, type League } from "@/lib/club-ledger";
import { createCode, findCode, loadClub, loadLeagueMembers, saveClub, tagCustomer, type Loaded } from "@/lib/club-store";
import { asCustomer, customerApi } from "@/lib/customer-account";
import { adminConfigured } from "@/lib/shopify-admin";

/**
 * The signed-in member's club page (/members): GET is their points, room, rewards and history; POST is something they
 * do there: { action: "claim", reward } | { action: "letters" } | { action: "birthday", md: "MM-DD" } | { action: "instagram" }
 * | { action: "socials", socials: { instagram?, tiktok?, strava? } } (the handles other members can find them by on /stories).
 * Who they are comes from their own sign-in (Customer Account API); their orders and club record come from the Admin API,
 * which only this server can reach. Every answer carries the page's new numbers, so it never needs to ask again.
 * Each live answer also carries the leaderboard (every member in order), from a cached read of all members with this member's
 * own fresh input put in, so what they just did shows in their row at once.
 */

const ME = /* GraphQL */ `
  query ClubMe {
    customer { id firstName lastName creationDate emailAddress { marketingState } }
  }
`;
type Me = { customer: { id: string; firstName: string | null; lastName: string | null; creationDate: string; emailAddress: { marketingState: string } | null } };

const LETTERS = /* GraphQL */ `
  mutation Letters {
    customerEmailMarketingSubscribe { emailAddress { marketingState } userErrors { message } }
  }
`;
type Letters = { customerEmailMarketingSubscribe: { emailAddress: { marketingState: string } | null; userErrors: { message: string }[] } };

const noStore = { "Cache-Control": "no-store" };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: noStore });

const input = (me: Me["customer"], loaded: Pick<Loaded, "orders" | "store">) => ({
  firstName: me.firstName ?? "",
  createdAt: me.creationDate,
  lettersLive: me.emailAddress?.marketingState === "SUBSCRIBED",
  orders: loaded.orders,
  store: loaded.store,
});

function view(me: Me["customer"], loaded: Pick<Loaded, "orders" | "store">, live = true, league?: League): ClubView {
  return { ...computeClub(input(me, loaded), Date.now(), live), ...(league ? { league } : {}) };
}

/** The member's page with the leaderboard, which never stops the page: without it the band shows the member alone. */
async function withLeague(me: Me["customer"], loaded: Pick<Loaded, "orders" | "store">): Promise<ClubView> {
  let league: League | undefined;
  try {
    const me_ = { id: me.id, name: leagueName(me.firstName, me.lastName), input: input(me, loaded) };
    const members = [me_, ...(await loadLeagueMembers()).filter((m) => m.id !== me.id)];
    const drop = currentDrop();
    league = buildLeague(members, me.id, drop ? { drop: { id: drop.id, name: drop.name } } : {});
  } catch (err) {
    console.error("Leaderboard: not built", err);
  }
  return view(me, loaded, true, league);
}

/** Reads, changes and saves the club record, starting over if someone else saved it in between. */
async function mutate(id: string, change: (store: ClubStore) => void): Promise<Loaded> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const loaded = await loadClub(id);
    const store: ClubStore = structuredClone(loaded.store);
    change(store);
    const saved = await saveClub(id, store, loaded.digest);
    if (saved.ok) return { ...loaded, store, digest: saved.digest };
    console.warn("Club save retried:", saved.error);
  }
  throw new Error("Club record kept changing");
}

/** Records what is first seen on Shopify (the letters, the Members Only tag) and settles claims a crash left half done. */
async function settle(id: string, loaded: Loaded, lettersLive: boolean): Promise<Loaded> {
  const now = new Date().toISOString();
  const store: ClubStore = structuredClone(loaded.store);
  let changed = false;
  if (lettersLive && !store.letters) {
    store.letters = now;
    changed = true;
  }
  if (loaded.tags.includes(club.membersOnlyTag) && !store.membersOnly) {
    store.membersOnly = now;
    changed = true;
  }
  for (const c of store.claims) {
    if (c.status !== "pending" || !c.code || Date.now() - Date.parse(c.at) < 10 * 60_000) continue;
    const discount = await findCode(c.code);
    c.status = discount ? "issued" : "void";
    if (discount) c.discount = discount;
    changed = true;
  }
  if (!changed) return loaded;
  const saved = await saveClub(id, store, loaded.digest).catch(() => null);
  return { ...loaded, store, digest: saved?.ok ? saved.digest : loaded.digest };
}

export async function GET() {
  return asCustomer("We couldn't load your club.", async (token) => {
    const { customer: me } = await customerApi<Me>(token, ME);
    // Until the Admin settings are on the server, and the app has the access the club needs (npm run club:setup),
    // the page shows what the sign-in alone can tell rather than an error.
    const signInOnly = () => json(view(me, { orders: [], store: emptyStore() }, false));
    if (!adminConfigured()) return signInOnly();
    try {
      const loaded = await settle(me.id, await loadClub(me.id), me.emailAddress?.marketingState === "SUBSCRIBED");
      return json(await withLeague(me, loaded));
    } catch (err) {
      console.error("Club: Admin API refused, showing the sign-in view", err);
      return signInOnly();
    }
  });
}

/** VN-XXXX-XXXX, without the letters and figures that read alike. */
function makeCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const chars = [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
  return `VN-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

const inMonths = (n: number) => {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString();
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Bad request." }, 400);
  }

  return asCustomer("We couldn't save that. Please try again.", async (token) => {
    const { customer: me } = await customerApi<Me>(token, ME);
    if (!adminConfigured()) return json({ error: "This opens very soon." }, 503);
    const now = new Date().toISOString();

    switch (body.action) {
      case "instagram": {
        const loaded = await mutate(me.id, (s) => void (s.instagram ??= now));
        return json({ view: await withLeague(me, loaded) });
      }

      case "socials": {
        // Sharing is the member's choice: what they send replaces what was there, and sending nothing takes them off the search.
        const socials = cleanSocials(body.socials);
        const loaded = await mutate(me.id, (s) => {
          if (socials) s.socials = socials;
          else delete s.socials;
        });
        return json({ view: await withLeague(me, loaded) });
      }

      case "birthday": {
        const md = typeof body.md === "string" ? body.md : "";
        if (!validBirthday(md)) return json({ error: "Please choose a month and a day." }, 422);
        const current = await loadClub(me.id);
        if (current.store.birthday) return json({ error: "Your birthday is already in. Write to us to change it." }, 409);
        const loaded = await mutate(me.id, (s) => void (s.birthday ??= { md, set: now }));
        return json({ view: await withLeague(me, loaded) });
      }

      case "letters": {
        const result = await customerApi<Letters>(token, LETTERS);
        const { emailAddress, userErrors } = result.customerEmailMarketingSubscribe;
        if (userErrors.length) return json({ error: userErrors.map((e) => e.message).join(" ") }, 422);
        const subscribed = emailAddress?.marketingState === "SUBSCRIBED";
        const loaded = subscribed ? await mutate(me.id, (s) => void (s.letters ??= now)) : await loadClub(me.id);
        return json({ view: await withLeague(me, loaded), message: subscribed ? undefined : "Check your inbox to confirm. Your points land once you have." });
      }

      case "claim": {
        const reward = rewards.find((r) => r.id === body.reward);
        if (!reward) return json({ error: "Bad request." }, 400);
        const id = crypto.randomUUID().slice(0, 8);
        const code = reward.kind === "experience" ? undefined : makeCode();
        const endsAt = inMonths(club.codeMonths);

        // Spend the points first, with the version check: of two claims at once, only one can save.
        let spent: Loaded | null = null;
        for (let attempt = 0; attempt < 3 && !spent; attempt++) {
          const loaded = await loadClub(me.id);
          const { balance } = view(me, loaded);
          if (balance < reward.cost) return json({ error: `You need ${(reward.cost - balance).toLocaleString("en-GB")} more points for this.`, view: await withLeague(me, loaded) }, 422);
          const store: ClubStore = structuredClone(loaded.store);
          store.claims.push({ id, reward: reward.id, points: reward.cost, at: now, status: code ? "pending" : "requested", ...(code ? { code, endsAt } : {}) });
          const saved = await saveClub(me.id, store, loaded.digest);
          if (saved.ok) spent = { ...loaded, store, digest: saved.digest };
        }
        if (!spent) return json({ error: "Please try again." }, 409);

        if (!code) {
          await tagCustomer(me.id, [club.requestTag]).catch((err) => console.error("Club request tag failed", err));
          return json({ view: await withLeague(me, spent), requested: true });
        }

        let discount: string | null = null;
        try {
          discount = await createCode(me.id, reward, code, endsAt);
        } catch (err) {
          console.error("Club code failed", err);
        }
        const loaded = await mutate(me.id, (s) => {
          const c = s.claims.find((x) => x.id === id);
          if (!c) return;
          c.status = discount ? "issued" : "void";
          if (discount) c.discount = discount;
        });
        if (!discount) return json({ error: "We couldn't make your code. Your points are untouched.", view: await withLeague(me, loaded) }, 502);
        return json({ view: await withLeague(me, loaded), code, endsAt });
      }

      default:
        return json({ error: "Bad request." }, 400);
    }
  });
}
