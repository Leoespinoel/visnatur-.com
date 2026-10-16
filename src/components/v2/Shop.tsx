"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { getSection, productsIn, sections, streetFamilies, v2Href } from "@/data/v2";
import { V2Grid } from "./ProductTile";

const audiences = [
  { key: "", label: "All" },
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
] as const;

type For = "men" | "women" | undefined;

function readFor(value: string | null): For {
  return value === "men" || value === "women" ? value : undefined;
}

/**
 * The V2 listing: ALL / MEN / WOMEN (`?for=`) and the section chips over the contact-sheet grid. Without a
 * `section` it lists everything. Render inside <Suspense> (it reads the search params); `V2ShopFallback` is the
 * server-rendered list for everyone.
 */
export function V2Shop({ section }: { section?: string }) {
  const audience = readFor(useSearchParams().get("for"));
  return <V2ShopView section={section} audience={audience} />;
}

export function V2ShopFallback({ section }: { section?: string }) {
  return <V2ShopView section={section} audience={undefined} />;
}

function V2ShopView({ section, audience }: { section?: string; audience: For }) {
  const current = section ? getSection(section) : undefined;
  const list = current ? productsIn(current) : products;
  const groups = streetFamilies(list, audience);
  const query = audience ? `?for=${audience}` : "";
  const here = current ? v2Href.section(current.slug) : v2Href.shop;

  const chip = "v2-wide inline-flex h-9 items-center border-[1.5px] border-ink px-3 text-[0.7rem] transition-colors";
  const on = "bg-ink text-paper";
  const off = "bg-paper hover:bg-ink hover:text-paper";

  return (
    <>
      <div className="flex flex-col gap-3 border-b-[1.5px] border-ink px-4 py-4 md:flex-row md:items-center md:px-6">
        <div className="flex shrink-0" role="group" aria-label="Who for">
          {audiences.map((a, i) => (
            <Link
              key={a.key}
              href={a.key ? `${here}?for=${a.key}` : here}
              aria-current={(audience ?? "") === a.key ? "true" : undefined}
              className={`${chip} ${(audience ?? "") === a.key ? on : off} ${i > 0 ? "-ml-[1.5px]" : ""}`}
            >
              {a.label}
            </Link>
          ))}
        </div>
        <nav aria-label="Sections" className="no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0 xl:overflow-visible">
          <ul className="flex gap-1.5 xl:flex-wrap">
            <li>
              <Link href={`${v2Href.shop}${query}`} aria-current={!current ? "page" : undefined} className={`${chip} ${!current ? on : off}`}>
                Everything
              </Link>
            </li>
            {sections.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`${v2Href.section(s.slug)}${query}`}
                  aria-current={current?.slug === s.slug ? "page" : undefined}
                  className={`${chip} whitespace-nowrap ${current?.slug === s.slug ? on : off}`}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="v2-mono shrink-0 text-muted md:ml-auto">
          {groups.length} design{groups.length === 1 ? "" : "s"}
        </p>
      </div>

      {groups.length ? (
        <V2Grid groups={groups} />
      ) : (
        <div className="px-4 py-24 text-center md:px-6">
          <p className="v2-display text-[14vw] md:text-[8rem]">Not yet.</p>
          <p className="mt-4 text-sm text-ink-2">Nothing here for {audience} yet. It&rsquo;s coming.</p>
          <Link href={here} className="v2-btn mt-8">
            See everything
          </Link>
        </div>
      )}
    </>
  );
}
