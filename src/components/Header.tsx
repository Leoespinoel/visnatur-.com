"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { audiences, nav } from "@/data/site";
import { menus, type MenuKey } from "@/data/menu";
import { island } from "@/data/locations";
import { useCart } from "@/lib/cart";
import { useHeroCoords } from "@/lib/hero-location";
import { Wordmark } from "./Wordmark";
import { AnnouncementBar } from "./AnnouncementBar";
import { BagIcon, CloseIcon, MenuIcon } from "./Icons";
import { Carousel } from "./Carousel";
import { MegaTile } from "./MegaTile";

const MENUS = menus();
const isShop = (k: MenuKey) => k === "men" || k === "women";

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
 * Site header. On the pages that open on a full-screen hero (the homepage, /men and /women sliders, the /stories slides)
 * it floats transparent, in white, over the hero and turns solid (with the announcement bar)
 * once the hero has scrolled away. Everywhere else it is the usual sticky white bar.
 */
export function Header() {
  const { count, open, hydrated } = useCart();
  const pathname = usePathname();
  // The burger menu (every screen size). On desktop it opens on Men; hovering a section swaps the panel to it.
  const [menuOpen, setMenuOpen] = useState(false);
  const [mega, setMega] = useState<MenuKey>("men");
  // The side link whose tiles show; back to the section's "all" whenever a section opens.
  const [sub, setSub] = useState("all");
  const openMega = (m: MenuKey) => {
    if (m !== mega) setSub("all");
    setMega(m);
  };
  const toggleMenu = () => {
    if (!menuOpen) {
      setMega("men");
      setSub("all");
    }
    setMenuOpen((v) => !v);
  };
  const [scrolled, setScrolled] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);

  const hero = pathname === "/" || pathname === "/men" || pathname === "/women" || pathname === "/stories";
  const overlay = hero && !scrolled && !menuOpen;

  // Close any open menu when the route changes (state adjustment during render, per React docs).
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    if (menuOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Today's date, client only (empty on the server so the markup matches on hydration).
  const today = useSyncExternalStore(subscribeNever, getToday, getTodayServer);
  const coords = useHeroCoords();

  // Solid once the hero (100svh) is almost gone.
  useEffect(() => {
    if (!hero) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hero]);

  return (
    <>
      {/* Dims the page under the open burger menu (desktop); a click outside the panel closes it. */}
      <div
        className={`hidden md:block fixed inset-0 z-30 bg-black/30 transition-opacity duration-200 ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
    <header
      className={`${hero ? "fixed inset-x-0" : "sticky"} top-0 z-40 border-b transition-[background-color,border-color,color] duration-300 ${
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

      {/* Full width, with container-x's side padding but not its 1440px cap, so on wide screens the menu keeps
          to the left edge and clear of the centred wordmark. */}
      <div className="relative flex h-16 w-full items-center justify-between px-4 md:h-[72px] md:px-8 xl:px-12">
        {/* Left: the burger menu, on every screen size */}
        <button
          type="button"
          className="-ml-2 flex items-center gap-3 p-2"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
          <span className="eyebrow !text-(--hdr-fg) hidden md:inline">{menuOpen ? "Close" : "Menu"}</span>
        </button>

        {/* Centre: wordmark, with the hero slide's coordinates (else the island's) and the date beneath it while over the hero */}
        <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center">
          <Wordmark swapOnScroll />
          <p
            className={`absolute top-full mt-1.5 whitespace-nowrap text-[9px] uppercase tracking-[0.18em] text-white/70 transition-opacity duration-300 md:text-[10px] ${
              overlay && today ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!overlay}
          >
            {coords ?? island.coords} <span className="mx-1.5 opacity-60">|</span> {today}
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

      {/* Burger menu (desktop): the six sections down the left; the one hovered shows its own links down a grey side
          panel and the tiles for the link hovered there, as in the ralphlauren.com mega menu. It covers the page down
          to the bottom of the screen (100% is the header's height) and scrolls when the tiles run longer. */}
      <div
        className={`hidden md:block absolute inset-x-0 top-full h-[calc(100svh-100%)] overflow-y-auto border-b border-line bg-paper text-ink transition-[opacity,visibility] duration-200 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Fills the menu's full height, so the side columns run to the bottom of the screen. */}
        <div className="grid min-h-full grid-cols-[minmax(190px,15%)_1fr]">
          <nav className="border-r border-line py-12 pl-8 pr-6 xl:pl-12" aria-label="Primary">
            <ul className="space-y-6">
              {nav.primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onMouseEnter={() => openMega(item.mega)}
                    onFocus={() => openMega(item.mega)}
                    className={`eyebrow !text-[13px] link-underline ${mega === item.mega ? "!text-ink after:[transform:none]" : "!text-ink-2 hover:!text-ink"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="eyebrow !text-[13px] !text-ink-2 hover:!text-ink link-underline">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          {(Object.keys(MENUS) as MenuKey[]).map((key) => {
            const items = MENUS[key];
            const item = items.find((i) => i.key === sub) ?? items.find((i) => i.key === "all")!;
            return (
              <div key={key} className={mega === key ? "grid min-w-0 grid-cols-[minmax(200px,24%)_1fr]" : "hidden"}>
                <ul className="space-y-5 bg-surface py-12 pl-8 pr-6">
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
                <div className="min-w-0 py-12 pl-10 pr-8 xl:pr-12">
                  <p className="eyebrow border-b border-ink pb-4 !text-ink">{item.heading}</p>
                  <div className="mt-7">
                    {item.note ? (
                      <div className="flex items-end gap-10">
                        <div className="w-[calc((100%-2.25rem)/4)] shrink-0">
                          <MegaTile tile={item.tiles[0]} />
                        </div>
                        <p className="max-w-sm pb-2 font-serif text-xl leading-snug text-ink-2">{item.note}</p>
                      </div>
                    ) : item.grid ? (
                      <div className="grid grid-cols-4 gap-3">
                        {item.tiles.map((t) => (
                          <MegaTile key={t.label} tile={t} />
                        ))}
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
                {MENUS[a.slug].map((i) => (
                  <li key={i.key}>
                    <Link href={i.href} className="font-serif text-2xl">
                      {i.label}
                    </Link>
                    {i.grid && (
                      <ul className="mt-4 mb-2 grid grid-cols-2 gap-x-6 gap-y-3">
                        {/* Skipping the ones that are their own line below (Accessories, Sunglasses); her Swim stays, as his Swim Shorts does. */}
                        {i.tiles.filter((t) => !MENUS[a.slug].some((o) => o.key !== "swim" && o.label === t.label)).map((t) => (
                          <li key={t.label}>
                            <Link href={t.href} className="text-[13px] font-semibold tracking-[0.08em]">
                              {t.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
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
              <Link href="/contact" className="font-serif text-3xl">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    </>
  );
}
