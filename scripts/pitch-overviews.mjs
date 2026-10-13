// Overview sheets for the pitch appendix: one image per style showing every colourway side by side,
// flats on top, on model in the middle, details at the bottom (public/overviews/<family>.jpg).
//
//   node scripts/pitch-overviews.mjs                                  every style
//   node scripts/pitch-overviews.mjs "Cabana Hoodie" "Riviera Hoodie"  only these styles
//
// Covers each style that has a measurement spec in chapter 26 of public/pitch.html, takes its
// colourways from src/data/products.ts in shop order, and writes (or refreshes) the sheet's <figure>
// and the colour count in that spec. Re-run after adding a colourway or replacing photos, then
// republish the artifact copy.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pitchPath = join(root, "public", "pitch.html");
const outDir = join(root, "public", "overviews");
mkdirSync(outDir, { recursive: true });

const W = 300;
const H = 375;
const ROWS = ["", "-model", "-detail"];
const WORDS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

// name -> { family, colourways: [{ slug, colour }] }, in the order products.ts lists them
const styles = new Map();
const src = readFileSync(join(root, "src", "data", "products.ts"), "utf8");
for (const [, slug, name, family, colour] of src.matchAll(
  /slug: "([^"]+)",[\s\S]*?name: "([^"]+)",[\s\S]*?family: "([^"]+)",[\s\S]*?colour: \{ name: "([^"]+)"/g,
)) {
  if (!styles.has(name)) styles.set(name, { family, colourways: [] });
  styles.get(name).colourways.push({ slug, colour });
}

let html = readFileSync(pitchPath, "utf8");
const specRe = /(<details class="spec"><summary><span class="nm">)([^<]+)(<\/span><span class="meta">)\d+ colours?( · [^<]*<\/span><\/summary><div class="spec-body"><p class="small">[\s\S]*?<\/p>)(<figure class="overview">[\s\S]*?<\/figure>)?/g;

const only = process.argv.slice(2);

// Build the sheets first so each URL can carry a hash of its image: Hostinger serves public files with
// a one-year max-age, so a rebuilt sheet needs a new URL to reach browsers that cached the old one.
const sheets = new Map();
for (const [, , name] of html.matchAll(specRe)) {
  if (only.length > 0 && !only.includes(name)) continue;
  const style = styles.get(name);
  if (!style) {
    console.warn(`no products for "${name}", left as is`);
    continue;
  }
  const { family, colourways } = style;
  const tiles = [];
  for (const [r, suffix] of ROWS.entries()) {
    for (const [i, { slug }] of colourways.entries()) {
      const input = await sharp(join(root, "public", "products", `${slug}${suffix}.jpg`)).resize(W, H).toBuffer();
      tiles.push({ input, left: i * W, top: r * H });
    }
  }
  const jpg = await sharp({ create: { width: W * colourways.length, height: H * ROWS.length, channels: 3, background: "#fff" } })
    .composite(tiles)
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  const file = `overviews/${family}.jpg`;
  writeFileSync(join(root, "public", file), jpg);
  sheets.set(name, `${file}?v=${createHash("sha1").update(jpg).digest("hex").slice(0, 8)}`);
  console.log(`${file}  ${name}, ${colourways.length} colourways`);
}

html = html.replace(specRe, (whole, open, name, mid, rest) => {
  const file = sheets.get(name);
  if (!file) return whole;
  const { colourways } = styles.get(name);
  const n = colourways.length;
  const count = `${n} colour${n === 1 ? "" : "s"}`;
  const alt = `${name} in ${n === 1 ? "its one colourway" : n === 2 ? "both colourways" : `all ${WORDS[n] ?? n} colourways`}: flat, on model and detail`;
  const figure =
    `<figure class="overview"><a class="sheet" href="${file}" target="_blank" rel="noopener">` +
    `<img src="${file}" alt="${alt}" width="${W * n}" height="${H * ROWS.length}" loading="lazy"></a>` +
    `<figcaption class="caption">${n === 1 ? "" : "Left to right: "}${colourways.map((c) => c.colour).join(", ")}. Flat, on model, detail. Previsualisation.</figcaption></figure>`;
  return `${open}${name}${mid}${count}${rest}${figure}`;
});

writeFileSync(pitchPath, html);
