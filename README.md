# Vis Naturæ

Made-to-order clothing label for men and women, made in Mauritius. Every design stays on sale; each piece is cut and sewn in the buyer's size after it is ordered and ships 3–4 weeks later. 10% of every sale price goes to conservation.

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4, with Shopify for checkout, payments and orders.

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
| `npm run shopify:sync` | Create or update every product in Shopify and remove the old order webhook. `-- --dry-run` previews without calling Shopify. |

## Environment variables

See `.env.example`. On Hostinger they go in the site's Environment variables.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, no trailing slash, ASCII form (`https://xn--visnatur-q0a.com`). Used for metadata, the sitemap and product photos sent to Shopify. |
| `SHOPIFY_STORE_DOMAIN` | The store's `….myshopify.com` address. |
| `SHOPIFY_STOREFRONT_TOKEN` | Private Storefront API token from the Headless channel. Creates carts and sends buyers to Shopify checkout. |
| `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET` | Dev Dashboard app (client credentials). Lets `npm run shopify:sync` create products. The site itself doesn't use them. |

Leave the Shopify variables blank and the site runs with checkout off (the bag says so).

## Shopify setup (once)

1. **Store.** Create the store, set the currency to EUR (Settings → General), and set up Shopify Payments, shipping zones and taxes. Match the shipping countries in `shippingCountries` (`src/data/site.ts`), a flat €15 rate and free shipping over €150.
2. **Headless channel.** Install it from the Shopify App Store, create a storefront, and copy its **private** Storefront API token into `SHOPIFY_STOREFRONT_TOKEN`.
3. **Admin app.** In the Shopify Dev Dashboard, create an app in the same organization as the store, give it the scopes in `.env.example`, release a version and install it on the store. Copy the client ID and secret.
4. **Products.** Put the variables in `.env.local` and run `npm run shopify:sync`. It creates all products (handle = slug, one variant per size, stock not tracked) and publishes them to the Headless storefront. Re-run it whenever `src/data/products.ts` changes.
5. **Hostinger.** Add the same variables to the site and redeploy.
6. **Test.** Turn on Shopify's test mode (Bogus Gateway), buy one piece, and check the order arrives in Shopify with its design number and size.

## Where things live

```
src/data/site.ts          brand settings: pledge rate, lead time, shipping threshold, nav, partners, pledged-to-date total
src/data/products.ts      the catalogue (prices in euro cents, colours, sizes, copy)
src/lib/cart.tsx          bag state, persisted in localStorage
src/lib/pledge.ts         the 10% calculation used everywhere
src/lib/shopify.ts        Storefront API client
src/app/api/checkout      checks the bag against the catalogue, then builds a Shopify cart and returns its checkout URL (never trusts client prices)
scripts/shopify-sync.mts  mirrors the catalogue into Shopify
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

## Made to order

Nothing is held in stock and nothing is limited: every product in `src/data/products.ts` is on sale, and each order is cut and sewn in the buyer's size after it is placed. Lead time (`leadTime` in `src/data/site.ts`) runs from the order date. Shopify doesn't track stock for these products, and the site never reads orders.

- `/api/checkout` checks each bag line against the catalogue (the piece exists, the size is one it is made in), then creates a Shopify cart. The design number, colour and lead time travel with each line onto the order.
- Shopify's checkout doesn't return to the site. The bag remembers the cart it sent to checkout and empties itself on the next visit once Shopify reports that cart became an order.
- `/archive` (the old list of closed editions) redirects to `/shop/all`.

## Updating the pledge total

Set `pledgeRaisedCents` in `src/data/site.ts` and redeploy. The Conservation page shows it.

## Deploying

Hosted on Hostinger as a Node.js web app, deployed from GitHub (`main`). Every push redeploys. The build runs `next build --webpack` because Turbopack's loader process fails in Hostinger's build environment. Environment variables live in the Hostinger site settings.

## Still to do before launch

- Real photography. Trademark clearance for the Æ mark.
- Legal entity details in `src/app/legal/*` (company name, address, governing law) and a legal review.
- Order emails: Shopify sends confirmations; edit them in Settings → Notifications.
- A mailing-list provider for the newsletter form (`src/components/Newsletter.tsx`).
- Confirm conservation partners and name them in `src/data/site.ts`.
