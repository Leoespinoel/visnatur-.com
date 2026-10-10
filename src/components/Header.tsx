"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { categories, nav } from "@/data/site";
import { film } from "@/data/film";
import { useCart } from "@/lib/cart";
import { Wordmark } from "./Wordmark";
import { AnnouncementBar } from "./AnnouncementBar";
import { BagIcon, CloseIcon, MenuIcon } from "./Icons";

/** Mega menu columns and collection tiles, as on kith.com. */
const megaColumns = [
  { title: "Shop", href: "/shop", links: nav.shop.slice(0, 3) },
  { title: "Categories", href: "/shop/all", links: categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}` })) },
  { title: "Vis Naturæ", href: "/about", links: nav.primary.filter((i) => !i.mega) },
];
const megaTiles = [
  { label: "Drop I", href: "/shop", image: "/community/p12.jpg" },
  { label: "Swim", href: "/shop/swim", image: "/community/p6.jpg" },
  { label: "Made in Mauritius", href: "/made-to-order", image: "/images/cutting-table.jpg" },
];

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
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);

  const home = pathname === "/";
  const overlay = home && !scrolled && !menuOpen && !shopOpen;

  // Close any open menu when the route changes (state adjustment during render, per React docs).
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenuOpen(false);
    setShopOpen(false);
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
            {nav.primary.map((item) =>
              item.mega ? (
                <div
                  key={item.href}
                  className="relative flex items-center"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="eyebrow !text-(--hdr-fg) link-underline py-6"
                    aria-haspopup="true"
                    aria-expanded={shopOpen}
                    onFocus={() => setShopOpen(true)}
                  >
                    {item.label}
                  </Link>
                </div>
              ) : (
                <Link key={item.href} href={item.href} className="eyebrow !text-(--hdr-fg) link-underline py-6">
                  {item.label}
                </Link>
              ),
            )}
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

      {/* Mega menu (desktop) */}
      <div
        className={`hidden md:block absolute inset-x-0 top-full border-b border-line bg-paper text-ink transition-[opacity,visibility] duration-200 ${
          shopOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onMouseEnter={() => setShopOpen(true)}
        onMouseLeave={() => setShopOpen(false)}
      >
        {/* Kith-style: columns of links on the left, collection tiles on the right */}
        <div className="container-x grid grid-cols-12 gap-8 py-10">
          {megaColumns.map((col) => (
            <div key={col.title} className="col-span-2">
              <Link href={col.href} className="text-[12px] font-semibold uppercase tracking-[0.1em] link-underline">
                {col.title}
              </Link>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-ink-2 transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-6 grid grid-cols-3 gap-2">
            {megaTiles.map((t) => (
              <Link key={t.href} href={t.href} className="group">
                <div className="image-frame aspect-[4/5]">
                  <Image src={t.image} alt="" fill unoptimized sizes="240px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <p className="mt-2.5 text-[12px] font-medium">{t.label}</p>
              </Link>
            ))}
          </div>
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
          <p className="eyebrow mb-4">Shop</p>
          <ul className="mb-10 space-y-4">
            {nav.shop.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-serif text-3xl">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="eyebrow mb-4">Brand</p>
          <ul className="space-y-4">
            {nav.primary
              .filter((i) => !i.mega)
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
  );
}
