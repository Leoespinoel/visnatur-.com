/**
 * Generates placeholder imagery as SVG files:
 *   public/products/<slug>.svg and <slug>-detail.svg   one per product
 *   public/images/hero.svg, about.svg, journal-*.svg, category-*.svg
 *
 * Run with:  npm run placeholders   (Node 22.6+ strips the types natively)
 * Replace any file with real photography (same path, .jpg/.webp) and update the
 * image helpers in src/data/products.ts and src/data/site.ts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { products, type Garment, type Product } from "../src/data/products.ts";
import { categories } from "../src/data/site.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = {
  products: join(root, "public", "products"),
  images: join(root, "public", "images"),
};
mkdirSync(out.products, { recursive: true });
mkdirSync(out.images, { recursive: true });

const BONE = "#ffffff";
const INK = "#0a0a0a";
const RED = "#c8102e";
const SERIF = "'Cormorant Garamond', 'Times New Roman', Georgia, serif";
const SANS = "Inter, Helvetica, Arial, sans-serif";

// ---------- colour helpers ----------
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}
/** Mix `a` towards `b` by t (0 = a, 1 = b). */
function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
}
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// ---------- garment silhouettes (viewBox 0 0 400 500) ----------
const SHORT_SLEEVE_BODY =
  "M150 110 Q200 92 250 110 L330 145 L305 205 L272 192 V395 H128 V192 L95 205 L70 145 Z";
const LONG_SLEEVE_BODY =
  "M150 110 Q200 92 250 110 L330 145 L352 335 L292 345 L272 235 V395 H128 V235 L108 345 L48 335 L70 145 Z";
const SLIM_LONG_BODY =
  "M158 110 Q200 95 242 110 L312 142 L330 330 L282 338 L266 230 V395 H134 V230 L118 338 L70 330 L88 142 Z";

type Draw = (fill: string, line: string) => string;

const garments: Record<Garment, Draw> = {
  "swim-short": (fill, line) => `
    <path d="M112 160 H288 V188 H112 Z" fill="${fill}" stroke="${line}" stroke-width="2"/>
    <path d="M112 188 L100 345 H190 L200 268 L210 345 H300 L288 188 Z" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M178 160 V188 M222 160 V188" stroke="${line}" stroke-width="2"/>
    <path d="M190 176 q10 14 20 0" fill="none" stroke="${line}" stroke-width="2"/>
    <path d="M128 215 l10 60 M272 215 l-10 60" stroke="${line}" stroke-width="1.5" stroke-dasharray="3 4"/>`,
  short: (fill, line) => `
    <path d="M112 160 H288 V186 H112 Z" fill="${fill}" stroke="${line}" stroke-width="2"/>
    <path d="M112 186 L104 360 H192 L200 262 L208 360 H296 L288 186 Z" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M160 186 L156 300 M240 186 L244 300" stroke="${line}" stroke-width="1.5"/>
    <path d="M128 200 l8 50 M272 200 l-8 50" stroke="${line}" stroke-width="1.5"/>`,
  trouser: (fill, line) => `
    <path d="M118 120 H282 V146 H118 Z" fill="${fill}" stroke="${line}" stroke-width="2"/>
    <path d="M118 146 L108 470 H190 L200 230 L210 470 H292 L282 146 Z" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M160 146 L152 300 M240 146 L248 300" stroke="${line}" stroke-width="1.5"/>
    <path d="M130 160 l8 46 M270 160 l-8 46" stroke="${line}" stroke-width="1.5"/>`,
  tee: (fill, line) => `
    <path d="${SHORT_SLEEVE_BODY}" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M165 108 q35 32 70 0" fill="none" stroke="${line}" stroke-width="2"/>`,
  polo: (fill, line) => `
    <path d="${SHORT_SLEEVE_BODY}" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M165 108 L200 160 L235 108 L220 100 L200 140 L180 100 Z" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M200 160 V215" stroke="${line}" stroke-width="2"/>
    <circle cx="200" cy="178" r="3" fill="${line}"/><circle cx="200" cy="200" r="3" fill="${line}"/>`,
  rugby: (fill, line) => `
    <defs><clipPath id="rugbyClip"><path d="${LONG_SLEEVE_BODY}"/></clipPath></defs>
    <path d="${LONG_SLEEVE_BODY}" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <g clip-path="url(#rugbyClip)" fill="${BONE}" opacity="0.9">
      <rect x="0" y="200" width="400" height="34"/><rect x="0" y="268" width="400" height="34"/><rect x="0" y="336" width="400" height="34"/>
    </g>
    <path d="M160 104 L200 150 L240 104 L228 96 L200 128 L172 96 Z" fill="${BONE}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M200 150 V205" stroke="${line}" stroke-width="2"/>`,
  knit: (fill, line) => `
    <path d="${LONG_SLEEVE_BODY}" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M165 108 q35 30 70 0" fill="none" stroke="${line}" stroke-width="2"/>
    <path d="M128 370 H272" stroke="${line}" stroke-width="1.5"/>
    <g stroke="${line}" stroke-width="1" opacity="0.5">
      <path d="M135 372 V395 M145 372 V395 M155 372 V395 M165 372 V395 M175 372 V395 M185 372 V395 M195 372 V395 M205 372 V395 M215 372 V395 M225 372 V395 M235 372 V395 M245 372 V395 M255 372 V395 M265 372 V395"/>
      <path d="M170 140 q10 30 0 60 q-10 30 0 60 q10 30 0 60 M200 140 q-10 30 0 60 q10 30 0 60 q-10 30 0 60 M230 140 q10 30 0 60 q-10 30 0 60 q10 30 0 60"/>
    </g>`,
  rashguard: (fill, line) => `
    <path d="${SLIM_LONG_BODY}" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M170 108 q30 24 60 0" fill="none" stroke="${line}" stroke-width="2"/>
    <path d="M140 230 L132 330 M260 230 L268 330" stroke="${line}" stroke-width="1" stroke-dasharray="2 3"/>`,
  shirt: (fill, line) => `
    <path d="${LONG_SLEEVE_BODY}" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M158 104 L200 154 L242 104 L226 94 L200 132 L174 94 Z" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M200 154 V395" stroke="${line}" stroke-width="1.5"/>
    <g fill="${line}"><circle cx="200" cy="185" r="2.5"/><circle cx="200" cy="225" r="2.5"/><circle cx="200" cy="265" r="2.5"/><circle cx="200" cy="305" r="2.5"/><circle cx="200" cy="345" r="2.5"/></g>
    <path d="M140 190 h40 v36 h-40 Z" fill="none" stroke="${line}" stroke-width="1.5"/>`,
  jacket: (fill, line) => `
    <path d="${LONG_SLEEVE_BODY}" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M160 102 L200 150 L240 102 L230 92 L200 126 L170 92 Z" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M200 150 V395" stroke="${line}" stroke-width="1.5"/>
    <g fill="none" stroke="${line}" stroke-width="1.5">
      <path d="M138 180 h44 v40 h-44 Z M218 180 h44 v40 h-44 Z M138 300 h48 v58 h-48 Z M214 300 h48 v58 h-48 Z"/>
      <path d="M138 196 h44 M218 196 h44 M138 316 h48 M214 316 h48"/>
    </g>
    <g fill="${line}"><circle cx="200" cy="180" r="3"/><circle cx="200" cy="230" r="3"/><circle cx="200" cy="280" r="3"/><circle cx="200" cy="330" r="3"/></g>`,
  overshirt: (fill, line) => `
    <path d="${LONG_SLEEVE_BODY}" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M158 104 L200 154 L242 104 L226 94 L200 132 L174 94 Z" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M200 154 V395" stroke="${line}" stroke-width="1.5"/>
    <g fill="none" stroke="${line}" stroke-width="1.5"><path d="M140 185 h42 v44 h-42 Z M218 185 h42 v44 h-42 Z M140 200 h42 M218 200 h42"/></g>
    <g fill="${line}"><circle cx="200" cy="185" r="2.5"/><circle cx="200" cy="235" r="2.5"/><circle cx="200" cy="285" r="2.5"/><circle cx="200" cy="335" r="2.5"/></g>`,
  cap: (fill, line) => `
    <path d="M100 270 A100 100 0 0 1 300 270 Z" fill="${fill}" stroke="${line}" stroke-width="2"/>
    <path d="M200 170 V270 M140 190 Q170 230 180 270 M260 190 Q230 230 220 270" fill="none" stroke="${line}" stroke-width="1.5"/>
    <path d="M100 270 L92 292 Q200 322 332 292 L300 270 Z" fill="${fill}" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="200" cy="172" r="5" fill="${line}"/>`,
  towel: (fill, line) => `
    <g transform="rotate(-6 200 250)">
      <rect x="110" y="110" width="180" height="290" fill="${fill}" stroke="${line}" stroke-width="2"/>
      <g fill="${BONE}" opacity="0.9"><rect x="110" y="150" width="180" height="18"/><rect x="110" y="190" width="180" height="8"/><rect x="110" y="330" width="180" height="18"/><rect x="110" y="310" width="180" height="8"/></g>
      <g stroke="${line}" stroke-width="1.5"><path d="M112 102 V110 M124 102 V110 M136 102 V110 M148 102 V110 M160 102 V110 M172 102 V110 M184 102 V110 M196 102 V110 M208 102 V110 M220 102 V110 M232 102 V110 M244 102 V110 M256 102 V110 M268 102 V110 M280 102 V110"/><path d="M112 400 V408 M124 400 V408 M136 400 V408 M148 400 V408 M160 400 V408 M172 400 V408 M184 400 V408 M196 400 V408 M208 400 V408 M220 400 V408 M232 400 V408 M244 400 V408 M256 400 V408 M268 400 V408 M280 400 V408"/></g>
    </g>`,
  tote: (fill, line) => `
    <path d="M150 200 Q150 120 200 120 Q250 120 250 200" fill="none" stroke="${line}" stroke-width="10" stroke-linecap="round"/>
    <path d="M150 200 Q150 130 200 130 Q250 130 250 200" fill="none" stroke="${fill}" stroke-width="6" stroke-linecap="round"/>
    <rect x="112" y="196" width="176" height="200" fill="${fill}" stroke="${line}" stroke-width="2"/>
    <path d="M112 226 H288" stroke="${line}" stroke-width="1.5"/>
    <text x="200" y="320" text-anchor="middle" font-family="${SERIF}" font-size="22" letter-spacing="3" fill="${line}">VIS NATURÆ</text>`,
};

// ---------- shared scaffolding ----------
function grain(id: string): string {
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="table" tableValues="0 0.06"/></feComponentTransfer>
  </filter>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function productSvg(p: Product, variant: "front" | "detail"): string {
  const base = p.colour.hex;
  const light = luminance(base) > 0.6;
  const top = "#f6f6f6";
  const bottom = "#e4e4e4";
  const fill = light ? mix(base, BONE, 0.3) : base;
  const line = light ? "#3d3d3d" : mix(base, "#000000", 0.4);
  const W = 1200;
  const H = 1500;
  const garment = garments[p.garment](fill, line);

  const transform =
    variant === "front"
      ? `translate(${(W - 400 * 2.2) / 2} 230) scale(2.2)`
      : `translate(${(W - 400 * 3.6) / 2 + 80} -260) scale(3.6)`;

  const caption =
    variant === "front"
      ? `<text x="72" y="${H - 96}" font-family="${SERIF}" font-size="56" fill="${INK}" opacity="0.85">${escapeXml(p.name)}</text>
         <text x="72" y="${H - 52}" font-family="${SANS}" font-size="18" letter-spacing="4" fill="${INK}" opacity="0.55">${escapeXml(p.colour.name.toUpperCase())} · SKETCH · PHOTOGRAPHY TO FOLLOW</text>`
      : `<text x="72" y="${H - 52}" font-family="${SANS}" font-size="18" letter-spacing="4" fill="${INK}" opacity="0.55">${escapeXml(p.fabric.toUpperCase())}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXml(p.name)} placeholder">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    ${grain("g")}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" filter="url(#g)"/>
  <g transform="${transform}">${garment}</g>
  ${caption}
</svg>`;
}

// ---------- editorial scenes ----------
function scene(opts: {
  w: number;
  h: number;
  sky: [string, string];
  sea: [string, string];
  land: string;
  label?: string;
  sun?: boolean;
}): string {
  const { w, h, sky, sea, land, label, sun = true } = opts;
  const horizon = h * 0.58;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeXml(label ?? "Landscape placeholder")}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sea[0]}"/><stop offset="1" stop-color="${sea[1]}"/></linearGradient>
    ${grain("g")}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  ${sun ? `<circle cx="${w * 0.72}" cy="${horizon - h * 0.16}" r="${h * 0.07}" fill="${RED}" opacity="0.9"/>` : ""}
  <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#sea)"/>
  <path d="M0 ${horizon + 6} Q ${w * 0.25} ${horizon - 4} ${w * 0.5} ${horizon + 6} T ${w} ${horizon + 6} V ${horizon + 12} H0 Z" fill="${BONE}" opacity="0.25"/>
  <path d="M0 ${h * 0.78} Q ${w * 0.2} ${h * 0.66} ${w * 0.45} ${h * 0.8} T ${w} ${h * 0.72} V ${h} H0 Z" fill="${land}"/>
  <path d="M0 ${h * 0.9} Q ${w * 0.3} ${h * 0.82} ${w * 0.6} ${h * 0.92} T ${w} ${h * 0.86} V ${h} H0 Z" fill="${mix(land, INK, 0.25)}"/>
  <rect width="${w}" height="${h}" filter="url(#g)"/>
</svg>`;
}

// ---------- write ----------
let count = 0;
for (const p of products) {
  writeFileSync(join(out.products, `${p.slug}.svg`), productSvg(p, "front"));
  writeFileSync(join(out.products, `${p.slug}-detail.svg`), productSvg(p, "detail"));
  count += 2;
}

writeFileSync(
  join(out.images, "hero.svg"),
  scene({ w: 2400, h: 1400, sky: ["#f2f2f2", "#dedede"], sea: ["#1c1c1c", "#0a0a0a"], land: RED, label: "Collection I" }),
);
writeFileSync(
  join(out.images, "hero-portrait.svg"),
  scene({ w: 1200, h: 1600, sky: ["#f2f2f2", "#dedede"], sea: ["#1c1c1c", "#0a0a0a"], land: RED, label: "Collection I" }),
);
writeFileSync(
  join(out.images, "about.svg"),
  scene({ w: 1600, h: 2000, sky: ["#ededed", "#d6d6d6"], sea: [RED, "#8f0b21"], land: "#0a0a0a", label: "Workshop", sun: false }),
);
writeFileSync(
  join(out.images, "conservation.svg"),
  scene({ w: 2400, h: 1200, sky: ["#f4f4f4", "#e0e0e0"], sea: ["#2a2a2a", "#0a0a0a"], land: RED, label: "Conservation" }),
);
const journalScenes = [
  { sky: ["#f2f2f2", "#dcdcdc"] as [string, string], sea: [RED, "#8f0b21"] as [string, string], land: "#0a0a0a" },
  { sky: ["#f6f6f6", "#e6e6e6"] as [string, string], sea: ["#2a2a2a", "#0a0a0a"] as [string, string], land: "#8a8a8a" },
  { sky: ["#efefef", "#d9d9d9"] as [string, string], sea: ["#0a0a0a", "#000000"] as [string, string], land: RED },
];
journalScenes.forEach((s, i) =>
  writeFileSync(join(out.images, `journal-${i + 1}.svg`), scene({ w: 1200, h: 900, ...s, label: `Journal ${i + 1}` })),
);

// Category tiles: the first featured product in each category, framed tall.
for (const c of categories) {
  const p = products
    .filter((x) => x.category === c.slug)
    .sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99))[0];
  writeFileSync(join(out.images, `category-${c.slug}.svg`), productSvg({ ...p, name: c.name }, "front"));
}

console.log(`Wrote ${count} product images and ${7 + journalScenes.length + categories.length} editorial images.`);
