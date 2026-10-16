import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { accountLinks, accountTiles } from "@/data/account";

/**
 * The account pages (/account, /wishlist), after nudeproject.com's: their own menu under the header, the page,
 * then five studio pictures into the shop.
 */
export function AccountPage({ current, children }: { current: string; children: ReactNode }) {
  return (
    <>
      <nav aria-label="Account" className="border-b border-line">
        <ul className="no-scrollbar flex gap-7 overflow-x-auto px-4 md:justify-center md:gap-10 md:px-8">
          {accountLinks.map((l) => (
            <li key={l.label} className="shrink-0">
              <Link
                href={l.href}
                aria-current={l.href === current ? "page" : undefined}
                className={`eyebrow link-underline block py-4 ${l.href === current ? "!text-ink after:[transform:none]" : "hover:!text-ink"}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {children}

      <ul className="no-scrollbar flex snap-x snap-mandatory gap-px overflow-x-auto md:grid md:grid-cols-5" aria-label="Shop">
        {accountTiles().map((t) => (
          <li key={t.label} className="w-[64%] shrink-0 snap-start md:w-auto">
            <Link href={t.href} className="group image-frame block aspect-[2/3]">
              <Image src={t.image} alt="" fill unoptimized sizes="(min-width: 768px) 20vw, 64vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <span className="absolute bottom-4 left-4 rounded-full border border-ink/70 bg-paper/75 px-4 py-2 text-[13px] text-ink backdrop-blur-sm">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
