import Link from "next/link";

export type StoryLink = { label: string; href: string };

/** One editorial story: what a banner, a half of a pair or a carousel tile says, and where it leads. */
export type Story = { eyebrow?: string; title: string; dek?: string; image: string; alt: string; links: StoryLink[] };

const titleSize = { xs: "text-2xl md:text-3xl", sm: "text-3xl md:text-4xl", md: "text-4xl md:text-5xl", lg: "text-5xl md:text-7xl" };

/**
 * The copy on a story image, laid out as on ralphlauren.com: a small label, the title, one line,
 * then underlined text links in place of buttons. White, for photographs.
 */
export function StoryCopy({
  eyebrow,
  title,
  dek,
  links,
  align = "left",
  size = "md",
}: Pick<Story, "eyebrow" | "title" | "dek" | "links"> & { align?: "left" | "center"; size?: keyof typeof titleSize }) {
  const center = align === "center";
  return (
    <div className={`max-w-xl text-white ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-3 !text-white/85">{eyebrow}</p>}
      <h2 className={`display ${titleSize[size]}`}>{title}</h2>
      {dek && <p className={`mt-3 max-w-md text-[13px] leading-relaxed text-white/85 ${center ? "mx-auto" : ""}`}>{dek}</p>}
      {links.length > 0 && (
        <div className={`pointer-events-auto mt-5 flex flex-wrap gap-x-7 gap-y-3 ${center ? "justify-center" : ""}`}>
          {links.map((l) => (
            <Link key={l.href + l.label} href={l.href} className="border-b border-white pb-1 text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-70">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
