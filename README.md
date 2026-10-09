# Vis Naturæ

Made-to-order menswear and resort label, made in Mauritius. Every design is released once, in a numbered edition of twelve (accessories twenty-four), made as one batch after its order window closes, then retired. Outerwear and heavy knits are one of one. 10% of every sale price goes to conservation.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and Stripe Checkout.

## Run it

Node 22.6+ is required (the machine this was set up on uses nvm: `source ~/.nvm/nvm.sh`).

```bash
npm install
cp .env.example .env.local   # then fill in the keys (see below)
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build (type-checks and lints). |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint. |
| `npm run placeholders` | Regenerate the placeholder SVG imagery in `public/`. |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, no trailing slash. Used for Stripe redirects, metadata and the sitemap. |
| `STRIPE_SECRET_KEY` | Stripe secret key. Use `sk_test_…` while testing. Leave blank and the site runs with checkout disabled (the button shows a clear message). |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `/api/webhook`. Locally: `stripe listen --forward-to localhost:3000/api/webhook`. |

Test a payment with card `4242 4242 4242 4242`, any future expiry, any CVC.

## Where things live

```
src/data/site.ts          brand settings: pledge rate, lead time, shipping threshold, nav, partners, pledged-to-date total
src/data/products.ts      the catalogue (prices in euro cents, colours, sizes, copy)
src/lib/cart.tsx          bag state, persisted in localStorage
src/lib/pledge.ts         the 10% calculation used everywhere
src/app/api/checkout      builds the Stripe Checkout session from the catalogue (never trusts client prices)
src/app/api/webhook       receives checkout.session.completed (currently logs the order)
scripts/generate-placeholders.mts   draws the placeholder garment sketches
```

## Swapping in real photography

Images are referenced by path, so replace the files and keep the names, or change the helpers:

- Product images: `public/products/<slug>.svg` and `<slug>-detail.svg`. Rename the extension in `productImages()` in `src/data/products.ts` if you move to `.jpg`/`.webp`.
- Hero, category tiles, journal, about and conservation images: `public/images/*.svg`, referenced in `src/data/site.ts` and the page files.
- Once real photos are in, remove the `unoptimized` prop from the `<Image>` tags so Next.js serves resized versions.

## Intro animation

Every full page load opens with a red wipe carrying the wordmark (about 5.5 s: the letters slow towards the final Æ, then everything holds for a beat before the wipe-out; click or any key skips it; client-side navigation never replays it; reduced-motion users never see it). It is `src/components/IntroOverlay.tsx` with its keyframes under "Intro" in `src/app/globals.css`. Turn it off by setting `intro: false` in `src/data/site.ts`.

## Brand mark

The logo is the wordmark itself: VIS NATUR in black with the final Æ in brand red, slightly larger. The Æ alone is used where only a mark fits (favicon, app icon). The font file in `src/assets/` is under the SIL Open Font License (see the OFL text beside it), which permits use in logos and commercial work. It is used by `src/app/icon.tsx`, `apple-icon.tsx` and `opengraph-image.tsx` to render the favicon, home-screen icon and share image at build time. The header lockup is in `src/components/Wordmark.tsx`; standalone SVGs are in `public/brand/`.

Before printing labels or filing a trademark, have a clearance search run for Æ figurative marks in class 25 (EUIPO eSearch plus / TMview).

## Editions, drops and stock

Each product carries a `drop` (which order window it belongs to, see `drops` in `src/data/site.ts`) and an `edition`: `{ kind: "edition" }` for a numbered run (size defaults to `site.editionSize.core`, accessories pass `size`), or `{ kind: "one-of-one" }` for a single garment that already exists in the one size listed. There is no inventory database: **Stripe is the record**.

- `src/lib/editions.ts` holds the pure logic: window state (upcoming / open / closed), units sold and reserved per design, and the availability state a page shows (`available`, `reserved`, `sold`, `closed`, `upcoming`). Server and client code share it.
- `src/lib/inventory.ts` reads Stripe: every unit in a completed Checkout session is sold, every unit in an open session from the last 30 minutes is reserved. Sessions carry their units as `slug:size,slug:size` in metadata. The snapshot includes its own timestamp so window states are never judged against `Date.now()` during a render.
- Pages read this through a cached function tagged `inventory`. The webhook (`/api/webhook`) clears that cache on `checkout.session.completed` and `checkout.session.expired`, so counts update immediately and an abandoned checkout releases its numbers.
- `/api/checkout` re-reads Stripe uncached before creating a session and refuses units that are sold out, closed, not yet open, or held by another checkout. Sessions expire after 30 minutes (`reservationMinutes`).
- Unit numbers are assigned in order of payment; the webhook logs "n of 12" for each unit so it can be sewn in.
- A sold-out edition, a closed window, or a sold one-of-one moves to `/archive`; product URLs stay live in that state so shared links don't break. Designs in a drop that has not opened yet return 404 and are left out of the sitemap.
- Sold something in person? Add its slug to `soldOffline` in `src/data/site.ts` (once per unit) and redeploy.
- The webhook logs `OVERSOLD` if more units are paid for than the edition holds. Refund the later one by hand in the Stripe dashboard.
- Drop dates in `src/data/site.ts` are placeholders until the maker confirms a schedule. Lead time runs from the closing date, not the order date.

Without a Stripe key every unit shows as available.

## Updating the pledge total

Set `pledgeRaisedCents` in `src/data/site.ts` and redeploy. The Conservation page shows it.

## Deploying

Push to GitHub and import the repo at vercel.com. Add the three environment variables in the Vercel project settings, set `NEXT_PUBLIC_SITE_URL` to the real domain, and point a Stripe webhook at `https://<domain>/api/webhook` for the `checkout.session.completed` event.

## Still to do before launch

- Real photography. Trademark clearance for the Æ mark.
- Legal entity details in `src/app/legal/*` (company name, address, governing law) and a legal review.
- Order emails and an order record: hook them into `src/app/api/webhook/route.ts`.
- A mailing-list provider for the newsletter form (`src/components/Newsletter.tsx`).
- Confirm conservation partners and name them in `src/data/site.ts`.
