import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The measurement sheets from the pitch appendix (chapter 26 of public/pitch.html), read once at build
 * so the Made to order page always shows the same numbers as the pitch. Server-only: it reads the file system.
 */

export type MeasurementPoint = { label: string; values: string[]; tolerance: string };

export type MeasurementSpec = {
  name: string;
  /** e.g. "9 colours · S M L" */
  meta: string;
  description: string;
  overview?: { src: string; alt: string; width: number; height: number; caption: string };
  /** e.g. "Point, cm" (sunglasses are in mm) */
  pointHeader: string;
  sizes: string[];
  points: MeasurementPoint[];
  notes: { term: string; detail: string }[];
};

export type MeasurementGroup = { label: string; specs: MeasurementSpec[] };

const ENTITIES: Record<string, string> = { amp: "&", quot: '"', "#39": "'", apos: "'", lt: "<", gt: ">", nbsp: " " };

function text(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&(amp|quot|#39|apos|lt|gt|nbsp);/g, (_, e: string) => ENTITIES[e])
    .trim();
}

function first(re: RegExp, html: string): string | undefined {
  return re.exec(html)?.[1];
}

function parseSpec(html: string): MeasurementSpec {
  const head = [...(first(/<thead>([\s\S]*?)<\/thead>/, html) ?? "").matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => text(m[1]));
  const img = /<img src="([^"]+)" alt="([^"]*)" width="(\d+)" height="(\d+)"/.exec(html);
  const caption = first(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/, html);

  return {
    name: text(first(/<span class="nm">([\s\S]*?)<\/span>/, html) ?? ""),
    meta: text(first(/<span class="meta">([\s\S]*?)<\/span>/, html) ?? ""),
    description: text(first(/<p class="small">([\s\S]*?)<\/p>/, html) ?? ""),
    overview: img
      ? {
          src: img[1].startsWith("/") ? img[1] : `/${img[1]}`,
          alt: text(img[2]),
          width: Number(img[3]),
          height: Number(img[4]),
          caption: text(caption ?? ""),
        }
      : undefined,
    // First column is the point name, last is the tolerance.
    pointHeader: head[0] ?? "Point, cm",
    sizes: head.slice(1, -1),
    points: [...(first(/<tbody>([\s\S]*?)<\/tbody>/, html) ?? "").matchAll(/<tr><th scope="row">([\s\S]*?)<\/th>([\s\S]*?)<\/tr>/g)].map(
      ([, label, cells]) => {
        const values = [...cells.matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => text(m[1]));
        return { label: text(label), values: values.slice(0, -1), tolerance: values.at(-1) ?? "" };
      },
    ),
    notes: [...html.matchAll(/<dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd>/g)].map(([, term, detail]) => ({ term: text(term), detail: text(detail) })),
  };
}

function load(): MeasurementGroup[] {
  const pitch = readFileSync(join(process.cwd(), "public", "pitch.html"), "utf8");
  const start = pitch.indexOf('<section class="slide" id="c26"');
  const appendix = start < 0 ? "" : pitch.slice(start, pitch.indexOf("</section>", start));

  const groups = appendix
    .split('<div class="spec-group">')
    .slice(1)
    .map((chunk) => ({
      label: text(first(/<p class="eyebrow">([\s\S]*?)<\/p>/, chunk) ?? ""),
      specs: [...chunk.matchAll(/<details class="spec">([\s\S]*?)<\/details>/g)].map((m) => parseSpec(m[1])),
    }))
    .filter((g) => g.specs.length > 0);

  // Fail the build rather than ship an empty section if the appendix markup changes.
  if (groups.length === 0) throw new Error("No measurement specs found in chapter 26 of public/pitch.html");
  return groups;
}

export const measurementGroups: MeasurementGroup[] = load();
