"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { audiences, nav } from "@/data/site";
import { menus, type MenuKey, type MenuTile } from "@/data/menu";
import { film } from "@/data/film";
import { useCart } from "@/lib/cart";
import { Wordmark } from "./Wordmark";
import { AnnouncementBar } from "./AnnouncementBar";
import { BagIcon, CloseIcon, MenuIcon } from "./Icons";
import { Carousel } from "./Carousel";

const MENUS = menus();
const isShop = (k: MenuKey) => k === "men" || k === "women";

/** A tall photo with its label across the bottom, as in the ralphlauren.com mega menu. */
function MegaTile({ tile }: { tile: MenuTile }) {
  if (tile.packshot) {
    return (
      // Packshots are shot on white, so the tile stays white (and the label dark) in either theme.
      <Link href={tile.href} className="group relative block aspect-[3/4] overflow-hidden border border-line bg-white">
        <Image src={tile.image} alt="" fill unoptimized sizes="20vw" className="object-contain p-6 pb-20 transition-transform duration-700 group-hover:scale-[1.03]" />
        <span className="absolute inset-x-0 bottom-0 px-4 pb-7 text-center font-serif text-[clamp(15px,1.35vw,20px)] uppercase leading-snug tracking-[0.14em] text-[#0a0a0a]">
          {tile.label}
        </span>
      </Link>
    );
  }
  return (
    <Link href={tile.href} className="group relative block aspect-[3/4] overflow-hidden bg-paper-2">
      <Image src={tile.image} alt="" fill unoptimized sizes="20vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-7 pt-24 text-center font-serif text-[clamp(15px,1.35vw,20px)] uppercase leading-snug tracking-[0.14em] text-white">
        {tile.label}
      </span>
    </Link>
  );
}

const subscribeNever = () => () => {};
let todayCache = "";
const getToday = () => {
  if (!todayCache) {
    todayCache = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "2-digit", year: "numeric" }).format(new Date());
  }
  return todayCache;
};
const getTodayServer = () => "";

/**
 * Site header. On the homepage it floats transparent, in white, over the
 * full-screen hero and turns solid (with the announcement bar) once the hero
 * has scrolled away. Everywhere else it is the usual sticky white bar.
 */
export function Header() {
  const { count, open, hydrated } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // Which mega menu is open (Men / Women). Closing waits a moment so the pointer can cross
  // from one nav item to the next, or down into the panel, without it flickering shut.
  const [mega, setMega] = useState<MenuKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // The side link whose tiles show; back to the categories whenever a section opens.
  const [sub, setSub] = useState("all");
  const openMega = (m: MenuKey) => {
    clearTimeout(closeTimer.current);
    if (m !== mega) setSub("all");
    setMega(m);
  };
  const keepMega = () => clearTimeout(closeTimer.current);
  const closeMega = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(null), 120);
  };
  const [scrolled, setScrolled] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);

  const home = pathname === "/";
  const overlay = home && !scrolled && !menuOpen && !mega;

  // Close any open menu when the route changes (state adjustment during render, per React docs).
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
    setMega(null);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Today's date, client only (empty on the server so the markup matches on hydration).
  const today = useSyncExternalStore(subscribeNever, getToday, getTodayServer);

  // Solid once the hero (100svh) is almost gone.
  useEffect(() => {
    if (!home) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [home]);

  return (
    <header
      className={`${home ? "fixed inset-x-0" : "sticky"} top-0 z-40 border-b transition-[background-color,border-color,color] duration-300 ${
        overlay ? "border-transparent bg-transparent text-white" : "border-line bg-paper/90 text-ink backdrop-blur"
      }`}
      style={{ "--hdr-fg": overlay ? "#ffffff" : "var(--ink)" } as CSSProperties}
      data-overlay={overlay ? "" : undefined}
    >
      {/* Announcement bar: hidden while floating over the hero, slides in with the solid header. */}
      <div className={`grid transition-[grid-template-rows] duration-300 ${overlay ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
        <div className="overflow-hidden">
          <AnnouncementBar />
        </div>
      </div>

      <div className="container-x relative flex h-16 items-center justify-between md:h-[72px]">
        {/* Left: nav (desktop) / menu button (mobile) */}
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="md:hidden -ml-2 p-2"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {nav.primary.map((item) => (
              // The brand pages only fit beside the centred wordmark on wide screens.
              <div
                key={item.href}
                className={`relative items-center ${isShop(item.mega) ? "flex" : "hidden min-[1400px]:flex"}`}
                onMouseEnter={() => openMega(item.mega)}
                onMouseLeave={closeMega}
              >
                <Link
                  href={item.href}
                  className={`eyebrow !text-(--hdr-fg) link-underline py-6 ${mega === item.mega ? "after:[transform:none]" : ""}`}
                  aria-haspopup="true"
                  aria-expanded={mega === item.mega}
                  onFocus={() => openMega(item.mega)}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Centre: wordmark, with place and date beneath it while over the film */}
        <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center">
          <Wordmark swapOnScroll />
          <p
            className={`absolute top-full mt-1.5 whitespace-nowrap text-[9px] uppercase tracking-[0.18em] text-white/70 transition-opacity duration-300 md:text-[10px] ${
              overlay && today ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!overlay}
          >
            {film.location} <span className="mx-1.5 opacity-60">|</span> {today}
          </p>
        </div>

        {/* Right: bag */}
        <div className="flex items-center gap-6">
          <Link href="/conservation" className="hidden lg:inline eyebrow !text-red link-underline">
            10% to conservation
          </Link>
          <button
            type="button"
            onClick={open}
            className="-mr-2 flex items-center gap-2 p-2"
            aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
          >
            <BagIcon />
            <span className="eyebrow !text-(--hdr-fg) tabular-nums" aria-hidden="true">
              {hydrated ? count : 0}
            </span>
          </button>
        </div>
      </div>

      {/* Mega menus (desktop), as on ralphlauren.com: each header item's links down a grey side panel; hovering
          one swaps the tiles on the right to that link's own (the panel opens on its "all" item). */}
      <div
        className={`hidden md:block absolute inset-x-0 top-full border-b border-line bg-paper text-ink transition-[opacity,visibility] duration-200 ${
          mega ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onMouseEnter={keepMega}
        onMouseLeave={closeMega}
      >
        {(Object.keys(MENUS) as MenuKey[]).map((key) => {
          const items = MENUS[key];
          const item = items.find((i) => i.key === sub) ?? items.find((i) => i.key === "all")!;
          return (
            <div key={key} className={mega === key ? "grid grid-cols-[minmax(220px,22%)_1fr]" : "hidden"}>
              <ul className="space-y-5 bg-surface py-12 pl-8 pr-6 min-[1440px]:pl-[calc((100vw-1440px)/2+2rem)]">
                {items.map((i) => (
                  <li key={i.key}>
                    <Link
                      href={i.href}
                      onMouseEnter={() => setSub(i.key)}
                      onFocus={() => setSub(i.key)}
                      className={`font-serif text-[21px] leading-none underline-offset-[6px] transition-colors hover:text-ink ${i.key === item.key ? "text-ink underline" : "text-ink-2"}`}
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="min-w-0 py-12 pl-10 pr-8 min-[1440px]:pr-[calc((100vw-1440px)/2+2rem)]">
                <p className="eyebrow border-b border-ink pb-4 !text-ink">{item.heading}</p>
                <div className="mt-7">
                  {item.note ? (
                    <div className="flex items-end gap-10">
                      <div className="w-[calc((100%-2.25rem)/4)] shrink-0">
                        <MegaTile tile={item.tiles[0]} />
                      </div>
                      <p className="max-w-sm pb-2 font-serif text-xl leading-snug text-ink-2">{item.note}</p>
                    </div>
                  ) : (
                    <Carousel key={`${key}-${item.key}`} ariaLabel={item.heading} arrows={item.tiles.length > 4 ? "sides" : "none"} gap="gap-3" itemClassName="w-[calc((100%-2.25rem)/4)]">
                      {item.tiles.map((t) => (
                        <MegaTile key={t.label} tile={t} />
                      ))}
                    </Carousel>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute inset-x-0 top-full z-30 h-[calc(100svh-4rem)] bg-paper text-ink overflow-y-auto transition-[opacity,visibility] duration-200 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="container-x py-8" aria-label="Mobile">
          {audiences.map((a) => (
            <div key={a.slug} className="mb-10">
              <p className="eyebrow mb-4">{a.name}</p>
              <ul className="space-y-3.5">
                {MENUS[a.slug]
                  .filter((i) => i.key !== "archive")
                  .map((i) => (
                    <li key={i.key}>
                      <Link href={i.href} className="font-serif text-2xl">
                        {i.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
          <p className="eyebrow mb-4">Brand</p>
          <ul className="space-y-4">
            {nav.primary
              .filter((i) => !isShop(i.mega))
              .map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-serif text-3xl">
                    {l.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/archive" className="font-serif text-3xl">
                Archive
              </Link>
            </li>
            <li>
              <Link href="/contact" className="font-serif text-3xl">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
