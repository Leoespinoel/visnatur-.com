"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { audiences, nav } from "@/data/site";
import { menus, worldPanels, type MenuItem, type MenuKey } from "@/data/menu";
import { releasedDrops } from "@/data/drops";
import { island } from "@/data/locations";
import { useCart } from "@/lib/cart";
import { useHeroCoords } from "@/lib/hero-location";
import { useWishlist } from "@/lib/wishlist";
import { Wordmark } from "./Wordmark";
import { AnnouncementBar } from "./AnnouncementBar";
import {
  AccountIcon,
  ArrowIcon,
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
} from "./Icons";
import { SearchOverlay } from "./SearchOverlay";
import { Carousel } from "./Carousel";
import { MegaTile } from "./MegaTile";

const MENUS = menus();
type Group = (typeof nav.groups)[number]["key"];
type Item = (typeof nav.primary)[number];
const SHOP = nav.primary.filter(
  (i): i is Extract<Item, { group: "shop" }> => i.group === "shop",
);
const WORLD = nav.primary.filter(
  (i): i is Extract<Item, { group: "world" }> => i.group === "world",
);

type SheetKey = (typeof SHOP)[number]["mega"];
type AudienceSlug = (typeof audiences)[number]["slug"];
/** The phone menu's four headlines (Leo, 2026-10-21, after nudeproject.com): the places people tap most. */
const headlines = () => [
  { label: "New in", href: "/shop/all?filter=new" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  /* Collection 01, named here until it is a drop in data/drops.ts; "New" once released. */
  { label: "DIVA", href: "/collections", tag: releasedDrops().length ? "New" : "Soon" },
];

const subscribeNever = () => () => {};
let todayCache = "";
const getToday = () => {
  if (!todayCache) {
    todayCache = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(new Date());
  }
  return todayCache;
};
const getTodayServer = () => "";

/**
 * Site header. On the pages that open on a full-screen hero (the homepage, /men and /women sliders)
 * it floats transparent, in white, over the hero and turns solid (with the announcement bar)
 * once the hero has scrolled away. Everywhere else it is the usual sticky white bar.
 */
export function Header() {
  const { count, open, hydrated } = useCart();
  const wishlist = useWishlist();
  const pathname = usePathname();
  // Two menus instead of a burger on desktop (Leo, 2026-10-16): Shop and The VN World. A menu opens as soon as the
  // pointer rests on its label (Leo, 2026-10-20) and closes when it leaves the header. Shop opens on its first section
  // and hovering a section swaps the panel to it; The VN World is one row of pictures, one per page. On phones the
  // three labels (Shop, World, Origins) stacked badly beside the wordmark, so there a burger opens one sheet with
  // all of it (Leo, 2026-10-21).
  const [menuOpen, setMenuOpen] = useState(false);
  const [group, setGroup] = useState<Group>("shop");
  const [mega, setMega] = useState<MenuKey>("men");
  const [searchOpen, setSearchOpen] = useState(false);
  // The side link whose tiles show; back to the section's "all" whenever a section opens.
  const [sub, setSub] = useState("all");
  // Phones: the second level of the sheet (Signature, Hors série or Made to order) and, under Signature, whose list.
  // The level stays set while its panel slides out, so the content doesn't vanish mid-slide.
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetLevel, setSheetLevel] = useState<SheetKey>("signature");
  const openSheet = (k: SheetKey) => {
    setSheetLevel(k);
    setSheetOpen(true);
  };
  const [sheetAud, setSheetAud] = useState<AudienceSlug>("men");
  const openMega = (m: MenuKey) => {
    if (m !== mega) setSub("all");
    setMega(m);
  };
  // The button that opened the menu or the search; Esc and the search's close button hand focus back to it.
  const trigger = useRef<HTMLButtonElement | null>(null);
  // True while the open menu was opened by hovering, so a click on its label doesn't close it under the mouse.
  const viaHover = useRef(false);
  const openGroup = (g: Group, button: HTMLButtonElement) => {
    trigger.current = button;
    setSearchOpen(false);
    setGroup(g);
    setMega(SHOP[0].mega);
    setSub("all");
    setMenuOpen(true);
  };
  const closeMenu = () => {
    viaHover.current = false;
    setMenuOpen(false);
    setSheetOpen(false);
  };
  const toggleGroup = (g: Group, button: HTMLButtonElement) => {
    if (menuOpen && group === g) {
      if (viaHover.current) return;
      return closeMenu();
    }
    viaHover.current = false;
    openGroup(g, button);
  };
  // Phones: the burger opens the one sheet (its group doesn't matter there) or closes it.
  const toggleBurger = (button: HTMLButtonElement) => {
    if (menuOpen) return closeMenu();
    viaHover.current = false;
    setSheetAud(pathname.startsWith("/women") ? "women" : "men");
    openGroup("shop", button);
  };
  // Hover only for a real mouse: a tap fires a synthetic enter and then a click, which would open and close at once.
  const hoverGroup = (g: Group, e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    viaHover.current = true;
    openGroup(g, e.currentTarget);
  };
  const hoverLink = (e: PointerEvent) => {
    if (e.pointerType === "mouse") closeMenu();
  };
  const toggleSearch = (button: HTMLButtonElement) => {
    trigger.current = button;
    closeMenu();
    setSearchOpen((v) => !v);
  };
  const closeSearch = () => {
    setSearchOpen(false);
    trigger.current?.focus();
  };
  const closeAll = () => {
    closeMenu();
    setSearchOpen(false);
  };
  const [scrolled, setScrolled] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);

  const hero = pathname === "/" || pathname === "/men" || pathname === "/women";
  const overlay = hero && !scrolled && !menuOpen && !searchOpen;

  // Close any open menu when the route changes (state adjustment during render, per React docs).
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) viaHover.current = false;
  }, [menuOpen]);

  const panelOpen = menuOpen || searchOpen;
  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      viaHover.current = false;
      setMenuOpen(false);
      setSearchOpen(false);
      trigger.current?.focus();
    };
    if (panelOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [panelOpen]);

  // Today's date, client only (empty on the server so the markup matches on hydration).
  const today = useSyncExternalStore(subscribeNever, getToday, getTodayServer);
  const coords = useHeroCoords();

  // Solid once the hero (100svh) is almost gone.
  useEffect(() => {
    if (!hero) return;
    const onScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * 0.8);
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
      {/* Dims the page under an open menu or the search (desktop); a click outside the panel closes it. */}
      <div
        className={`hidden md:block fixed inset-0 z-30 bg-black/30 transition-opacity duration-200 ${panelOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeAll}
        aria-hidden="true"
      />
      <header
        className={`${hero ? "fixed inset-x-0" : "sticky"} top-0 z-40 border-b transition-[background-color,border-color,color] duration-300 ${
          overlay
            ? "border-transparent bg-transparent text-white"
            : "border-line bg-paper/90 text-ink backdrop-blur"
        }`}
        style={
          { "--hdr-fg": overlay ? "#ffffff" : "var(--ink)" } as CSSProperties
        }
        data-overlay={overlay ? "" : undefined}
        onMouseLeave={() => {
          if (menuOpen) closeMenu();
        }}
      >
        {/* Announcement bar: hidden while floating over the hero, slides in with the solid header. */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ${overlay ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}
        >
          <div className="overflow-hidden">
            <AnnouncementBar />
          </div>
        </div>

        {/* Full width, with container-x's side padding but not its 1440px cap, so on wide screens the menu keeps
          to the left edge and clear of the centred wordmark. */}
        <div className="relative flex h-16 w-full items-center justify-between px-4 md:h-[72px] md:px-8 xl:px-12">
          {/* Left. Phones: the burger, then the wordmark beside it (as on nude-project.com's phone header, Leo, 2026-10-21), which
            leaves the right side room for all four icons. From md up: the two menus, Shop and The VN World, then Origins, and
            the wordmark moves to the centre. */}
          <div className="flex items-center gap-1.5 md:contents">
            <button
              type="button"
              onClick={(e) => toggleBurger(e.currentTarget)}
              className="-ml-1.5 p-1.5 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <nav
              className="-ml-2 hidden items-center gap-4 md:flex"
              aria-label="Menus"
            >
              {nav.groups.map((g) => {
                const active = menuOpen && group === g.key;
                return (
                  <button
                    key={g.key}
                    type="button"
                    onClick={(e) => toggleGroup(g.key, e.currentTarget)}
                    onPointerEnter={(e) => hoverGroup(g.key, e)}
                    aria-expanded={active}
                    className={`eyebrow !text-(--hdr-fg) link-underline px-2 py-2 ${active ? "after:[transform:none]" : ""}`}
                  >
                    {g.label}
                  </button>
                );
              })}
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  onPointerEnter={hoverLink}
                  className={`eyebrow !text-(--hdr-fg) link-underline px-2 py-2 ${pathname === l.href ? "after:[transform:none]" : ""}`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Wordmark (left on phones, centred from md), with the hero slide's coordinates (else the island's) and the date beneath it while over the hero */}
            <div className="relative flex flex-col items-start md:absolute md:left-1/2 md:-translate-x-1/2 md:items-center">
              <Wordmark swapOnScroll />
              <p
                className={`absolute top-full mt-1.5 whitespace-nowrap text-[9px] uppercase tracking-[0.18em] text-white/70 transition-opacity duration-300 md:text-[10px] ${
                  overlay && today ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!overlay}
              >
                {coords ?? island.coords}{" "}
                <span className="mx-1.5 opacity-60">|</span> {today}
              </p>
            </div>
          </div>

          {/* Right: search, account, wishlist and bag, on every screen (Leo, 2026-10-21: the heart and account on phones too). */}
          <div className="flex items-center md:gap-3">
            <button
              type="button"
              onClick={(e) => toggleSearch(e.currentTarget)}
              className="p-1 md:p-2"
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
            >
              <SearchIcon />
            </button>
            <Link href="/account" className="p-1 md:p-2" aria-label="Account">
              <AccountIcon />
            </Link>
            <Link
              href="/wishlist"
              className="p-1 md:p-2"
              aria-label={`Wishlist, ${wishlist.slugs.length} saved`}
            >
              <HeartIcon filled={wishlist.slugs.length > 0} />
            </Link>
            <button
              type="button"
              onClick={open}
              className="-mr-1.5 flex items-center gap-1 p-1 md:-mr-2 md:gap-2 md:p-2"
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <BagIcon />
              <span
                className="eyebrow !text-(--hdr-fg) tabular-nums"
                aria-hidden="true"
              >
                {hydrated ? count : 0}
              </span>
            </button>
          </div>
        </div>

        {/* Menu (desktop). It covers the page down to the bottom of the screen (100% is the header's height). The VN World
          is one picture per page, side by side (nudeproject.com's Universe). Shop has its sections down the left; the one
          hovered shows its own links down a grey side panel and the tiles for the link hovered there, as in the
          ralphlauren.com mega menu, and scrolls when the tiles run longer. */}
        <div
          className={`hidden md:block absolute inset-x-0 top-full h-[calc(100svh-100%)] overflow-y-auto border-b border-line bg-paper text-ink transition-[opacity,visibility] duration-200 ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          aria-hidden={!menuOpen}
        >
          {group === "world" ? (
            <nav
              aria-label="The VN World"
              className="grid h-full gap-px"
              style={{
                gridTemplateColumns: `repeat(${WORLD.length}, minmax(0, 1fr))`,
              }}
            >
              {WORLD.map((item) => (
                <WorldPanel
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  {...worldPanels[item.mega]}
                />
              ))}
            </nav>
          ) : (
            /* Fills the menu's full height, so the side columns run to the bottom of the screen. */
            <div className="grid min-h-full grid-cols-[minmax(190px,15%)_1fr]">
              <nav
                className="border-r border-line py-12 pl-8 pr-6 xl:pl-12"
                aria-label="Collections"
              >
                <ul className="space-y-6">
                  {SHOP.map((item) => (
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
                </ul>
              </nav>
              {(Object.keys(MENUS) as MenuKey[]).map((key) => {
                const items = MENUS[key];
                const item =
                  items.find((i) => i.key === sub) ??
                  items.find((i) => i.key === "all")!;
                return (
                  <div
                    key={key}
                    className={
                      mega === key
                        ? "grid min-w-0 grid-cols-[minmax(200px,24%)_1fr]"
                        : "hidden"
                    }
                  >
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
                      <p className="eyebrow border-b border-ink pb-4 !text-ink">
                        {item.heading}
                      </p>
                      <div className="mt-7">
                        {item.note ? (
                          <div className="flex items-end gap-10">
                            <div className="w-[calc((100%-2.25rem)/4)] shrink-0">
                              <MegaTile tile={item.tiles[0]} />
                            </div>
                            <p className="max-w-sm pb-2 font-serif text-xl leading-snug text-ink-2">
                              {item.note}
                            </p>
                          </div>
                        ) : item.grid ? (
                          <div className="grid grid-cols-4 gap-3">
                            {item.tiles.map((t) => (
                              <MegaTile key={t.label} tile={t} />
                            ))}
                          </div>
                        ) : (
                          <Carousel
                            key={`${key}-${item.key}`}
                            ariaLabel={item.heading}
                            arrows={item.tiles.length > 4 ? "sides" : "none"}
                            gap="gap-3"
                            itemClassName="w-[calc((100%-2.25rem)/4)]"
                          >
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
          )}
        </div>

        {/* Mobile sheet, from the burger (Leo, 2026-10-21, after nudeproject.com's phone menu): four headlines, the three
            Shop sections as rows that open a second level, then The VN World and Origins after a gap. Account, wishlist
            and the bag are in the bar above. The second level slides in over the first. */}
        <div
          className={`md:hidden absolute inset-x-0 top-full z-30 h-[calc(100svh-100%)] overflow-hidden bg-paper text-ink transition-[opacity,visibility] duration-200 ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          aria-hidden={!menuOpen}
        >
          <nav className="container-x h-full overflow-y-auto pb-10 pt-8" aria-label="Menu">
            <ul className="space-y-1">
              {headlines().map((h) => (
                <li key={h.href}>
                  <Link href={h.href} className="font-serif text-4xl leading-tight">
                    {h.label}
                    {h.tag && <span className="eyebrow ml-3 align-middle !text-red">{h.tag}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-10 border-t border-line">
              {SHOP.map((item) => (
                <li key={item.href}>
                  <SheetRow label={item.label} onClick={() => openSheet(item.mega)} />
                </li>
              ))}
            </ul>
            <ul className="mt-14 border-t border-line">
              {[...WORLD, ...nav.links].map((l) => (
                <li key={l.href}>
                  <SheetRow label={l.label} href={l.href} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Second level: the section's own links, with a Men | Women switch under Signature. */}
          <div
            className={`absolute inset-0 overflow-y-auto bg-paper transition-transform duration-300 motion-reduce:transition-none ${sheetOpen ? "translate-x-0" : "translate-x-full"}`}
            aria-hidden={!sheetOpen}
          >
            <nav className="container-x pb-10" aria-label={SHOP.find((i) => i.mega === sheetLevel)?.label}>
              <button type="button" onClick={() => setSheetOpen(false)} className="flex w-full items-center gap-3 border-b border-line py-4 text-left" tabIndex={sheetOpen ? 0 : -1}>
                <ArrowIcon width={18} height={18} className="rotate-180" />
                <span className="eyebrow !text-ink">{SHOP.find((i) => i.mega === sheetLevel)?.label}</span>
              </button>
              {sheetLevel === "signature" ? (
                <>
                  <div className="mt-6 flex gap-6" role="group" aria-label="For whom">
                    {audiences.map((a) => (
                      <button
                        key={a.slug}
                        type="button"
                        aria-pressed={sheetAud === a.slug}
                        onClick={() => setSheetAud(a.slug)}
                        className={`font-serif text-3xl transition-colors ${sheetAud === a.slug ? "underline decoration-1 underline-offset-8" : "text-muted"}`}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>
                  <AudienceList items={MENUS[sheetAud]} />
                </>
              ) : (
                <ul className="mt-6 space-y-3.5">
                  {MENUS[sheetLevel]
                    .filter((i) => i.key !== "contact")
                    .map((i) => (
                      <li key={i.key}>
                        <Link href={i.href} className="font-serif text-2xl">
                          {i.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </nav>
          </div>
        </div>

        <SearchOverlay open={searchOpen} onClose={closeSearch} />
      </header>
    </>
  );
}

/**
 * One page of The VN World: its picture, full bleed, with its name over the bottom. Side by side the name grows with
 * the panel so the longest ("Members only") stays on one line, and sits clear of the sound button bottom-left.
 */
function WorldPanel({
  href,
  label,
  image,
  position,
  className = "",
}: {
  href: string;
  label: string;
  image: string;
  position?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`group image-frame block ${className}`}>
      <Image
        src={image}
        alt=""
        fill
        unoptimized
        sizes="(min-width: 768px) 34vw, 100vw"
        style={{ objectPosition: position }}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <span
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent"
        aria-hidden="true"
      />
      <span className="display absolute inset-x-5 bottom-5 text-3xl text-white md:inset-x-6 md:bottom-24 md:text-[clamp(1.75rem,3.4vw,3.5rem)]">
        {label}
      </span>
    </Link>
  );
}

/** A row of the phone menu: a link, or a button that opens the second level; the arrow on the right either way. */
function SheetRow({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) {
  const cls = "flex w-full items-center justify-between border-b border-line py-4 text-left text-base";
  const arrow = <ArrowIcon width={18} height={18} />;
  return href ? (
    <Link href={href} className={cls}>
      {label}
      {arrow}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {label}
      {arrow}
    </button>
  );
}

/** One audience's Signature list on the phone: New in, All pieces with its category grid, then the rest. */
function AudienceList({ items }: { items: MenuItem[] }) {
  return (
    <ul className="mt-6 space-y-3.5">
      {items.map((i) => (
        <li key={i.key}>
          <Link href={i.href} className="font-serif text-2xl">
            {i.label}
          </Link>
          {i.grid && (
            <ul className="mt-4 mb-2 grid grid-cols-2 gap-x-6 gap-y-3">
              {/* Skipping the ones that are their own line below (Accessories, Sunglasses); her Swim stays, as his Swim Shorts does. */}
              {i.tiles
                .filter((t) => !items.some((o) => o.key !== "swim" && o.label === t.label))
                .map((t) => (
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
  );
}
