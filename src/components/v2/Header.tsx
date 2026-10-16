"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { sections, v2Href } from "@/data/v2";
import { V2Wordmark } from "./Wordmark";

const links = [
  { label: "Shop", href: v2Href.shop },
  { label: "Men", href: `${v2Href.shop}?for=men` },
  { label: "Women", href: `${v2Href.shop}?for=women` },
  { label: "Lookbook", href: v2Href.lookbook },
  { label: "The wild", href: "/conservation" },
];

/**
 * V2 header: the condensed wordmark, five links, and the bag as a black box with its count. Sticky under the
 * ticker. On phones a MENU button opens a black full-screen sheet of giant links and the shop sections.
 */
export function V2Header() {
  const { count, open, hydrated } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);

  // Close the sheet whenever the page changes.
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const bag = hydrated ? count : 0;

  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-ink bg-paper">
      <div className="flex h-14 items-stretch md:h-16">
        <Link href={v2Href.home} aria-label="Vis Naturæ, home" className="flex items-center border-r-[1.5px] border-ink px-4 md:px-6">
          <V2Wordmark className="text-[1.9rem] md:text-[2.4rem]" />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-stretch lg:flex">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="v2-wide v2-invert flex items-center border-r-[1.5px] border-ink px-5 text-[0.8rem]">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-stretch">
          <Link href="/" className="v2-mono hidden items-center border-l-[1.5px] border-ink px-4 text-muted transition-colors hover:text-ink xl:flex">
            Classic site
          </Link>
          <button
            type="button"
            onClick={open}
            aria-label={`Open bag, ${bag} item${bag === 1 ? "" : "s"}`}
            className="v2-wide flex items-center gap-2 border-l-[1.5px] border-ink bg-ink px-4 text-[0.8rem] text-paper transition-colors hover:bg-red md:px-6"
          >
            Bag
            <span className="v2-mono inline-flex h-5 min-w-5 items-center justify-center bg-paper px-1 !text-[0.7rem] text-ink">{bag}</span>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="v2-menu"
            className="v2-wide flex items-center border-l-[1.5px] border-ink px-4 text-[0.8rem] lg:hidden"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Phone menu: giant links on black */}
      <div
        id="v2-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-50 overflow-y-auto bg-ink text-paper"
      >
        <div className="flex h-14 items-center justify-between border-b-[1.5px] border-paper/30 px-4">
          <V2Wordmark className="text-[1.9rem]" />
          <button type="button" onClick={() => setMenuOpen(false)} className="v2-wide px-1 text-[0.8rem]">
            Close
          </button>
        </div>
        <nav aria-label="Menu" className="px-4 pb-10 pt-4">
          <ul>
            {links.map((l) => (
              <li key={l.label} className="border-b-[1.5px] border-paper/20">
                <Link href={l.href} className="v2-display block py-2 text-[17vw] transition-colors hover:text-red">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="v2-mono mt-8 text-paper/60">Sections</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s.slug}>
                <Link href={v2Href.section(s.slug)} className="v2-wide inline-block border-[1.5px] border-paper/40 px-3 py-2 text-[0.75rem] hover:border-paper hover:bg-paper hover:text-ink">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/" className="v2-mono mt-10 inline-block text-paper/60 underline underline-offset-4">
            Classic site
          </Link>
        </nav>
      </div>
    </header>
  );
}
