import Image from "next/image";
import Link from "next/link";
import { pledgePercentLabel } from "@/lib/pledge";
import { site } from "@/data/site";
import { sections, v2Href } from "@/data/v2";
import { V2Wordmark } from "./Wordmark";

/** The brand pages are still the classic ones. */
const brand = [
  { label: "Made to order", href: "/made-to-order" },
  { label: "In the wild", href: "/stories" },
  { label: "Origins", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const help = [
  { label: "Shipping & delivery", href: "/made-to-order#shipping" },
  { label: "Sizing", href: "/made-to-order#sizing" },
  { label: "Returns", href: "/legal/returns" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
];

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="v2-mono text-paper/50">{title}</p>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="v2-wide text-[0.8rem] transition-colors hover:text-red">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Black footer: link columns, the badger sticker, and the wordmark cropped huge along the bottom edge. */
export function V2Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="grid gap-10 px-4 pb-10 pt-14 sm:grid-cols-2 md:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Image src="/brand/badger-mark.png" alt="" width={852} height={300} className="v2-cutout w-40 -rotate-6" />
          <p className="mt-6 text-sm leading-relaxed text-paper/75">
            {site.name}. Clothing for men and women, cut and sewn by hand in Mauritius. {pledgePercentLabel()} of profits goes to
            conservation.
          </p>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="v2-mono mt-4 inline-block underline underline-offset-4 hover:text-red">
            Instagram
          </a>
        </div>
        <Column title="Shop" links={[{ label: "Everything", href: v2Href.shop }, ...sections.slice(0, 6).map((s) => ({ label: s.label, href: v2Href.section(s.slug) })), { label: "Lookbook", href: v2Href.lookbook }]} />
        <Column title="Vis Naturæ" links={brand} />
        <Column title="Help" links={help} />
      </div>

      <div className="v2-mono flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-paper/20 px-4 py-4 text-paper/60 md:px-6">
        <span>
          © {site.foundedYear} {site.name} · Made in Mauritius
        </span>
        <Link href="/" className="underline underline-offset-4 hover:text-paper">
          Classic site →
        </Link>
      </div>

      {/* The wordmark, cropped by the bottom edge. */}
      <div aria-hidden="true" className="pointer-events-none -mb-[3.2vw] select-none overflow-hidden px-2 leading-none">
        <V2Wordmark className="block text-center text-[20.5vw]" />
      </div>
    </footer>
  );
}
