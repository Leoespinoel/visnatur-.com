// Overview sheets for the pitch appendix: one image per style showing every colourway side by side,
// flats on top, on model in the middle, details at the bottom (public/overviews/<family>.jpg).
//
//   node scripts/pitch-overviews.mjs
//
// Covers each style that has a measurement spec in chapter 26 of public/pitch.html, takes its
// colourways from src/data/products.ts in shop order, and writes (or refreshes) the sheet's <figure>
// and the colour count in that spec. Re-run after adding a colourway, then republish the artifact copy.

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

const jobs = [];
html = html.replace(specRe, (whole, open, name, mid, rest) => {
  const style = styles.get(name);
  if (!style) {
    console.warn(`no products for "${name}", left as is`);
    return whole;
  }
  const { family, colourways } = style;
  const n = colourways.length;
  const file = `overviews/${family}.jpg`;
  jobs.push({ name, file, colourways });
  const count = `${n} colour${n === 1 ? "" : "s"}`;
  const alt = `${name} in ${n === 1 ? "its one colourway" : `all ${WORDS[n] ?? n} colourways`}: flat, on model and detail`;
  const figure =
    `<figure class="overview"><a class="sheet" href="${file}" target="_blank" rel="noopener">` +
    `<img src="${file}" alt="${alt}" width="${W * n}" height="${H * ROWS.length}" loading="lazy"></a>` +
    `<figcaption class="caption">${n === 1 ? "" : "Left to right: "}${colourways.map((c) => c.colour).join(", ")}. Flat, on model, detail. Previsualisation.</figcaption></figure>`;
  return `${open}${name}${mid}${count}${rest}${figure}`;
});

for (const { name, file, colourways } of jobs) {
  const tiles = [];
  for (const [r, suffix] of ROWS.entries()) {
    for (const [i, { slug }] of colourways.entries()) {
      const input = await sharp(join(root, "public", "products", `${slug}${suffix}.jpg`)).resize(W, H).toBuffer();
      tiles.push({ input, left: i * W, top: r * H });
    }
  }
  await sharp({ create: { width: W * colourways.length, height: H * ROWS.length, channels: 3, background: "#fff" } })
    .composite(tiles)
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(join(root, "public", file));
  console.log(`${file}  ${name}, ${colourways.length} colourways`);
}

writeFileSync(pitchPath, html);
