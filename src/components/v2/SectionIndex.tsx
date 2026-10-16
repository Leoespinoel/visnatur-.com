import Image from "next/image";
import Link from "next/link";
import { groupByFamily } from "@/data/products";
import { anyAvailable, productsIn, sections, v2Href } from "@/data/v2";
import { Sticker } from "./Sticker";

/**
 * Every section as one huge word per row, like the index of a zine: the counts in mono, a sticker for what can be
 * ordered now, and on hover the row inverts and a picture of the section pops up beside the word.
 */
export function SectionIndex() {
  return (
    <ul className="border-t-[1.5px] border-ink">
      {sections.map((s, i) => {
        const list = productsIn(s);
        const designs = groupByFamily(list).length;
        const now = anyAvailable(list);
        return (
          <li key={s.slug} className="relative border-b-[1.5px] border-ink hover:z-10">
            <Link href={v2Href.section(s.slug)} className="v2-invert group flex items-center gap-4 px-4 py-1 md:gap-8 md:px-6">
              <span className="v2-mono w-8 shrink-0 opacity-60">{String(i + 1).padStart(2, "0")}</span>
              <span className="v2-display text-[17vw] md:text-[9.5vw] xl:text-[8.5rem]">{s.label}</span>
              <span className="pointer-events-none absolute right-[22%] top-1/2 hidden aspect-[4/5] w-36 -translate-y-1/2 rotate-3 border-[1.5px] border-ink bg-white opacity-0 shadow-[6px_6px_0_var(--red)] transition-opacity duration-150 group-hover:opacity-100 md:block xl:w-44">
                <Image src={s.image} alt="" fill unoptimized sizes="176px" className="object-cover" />
              </span>
              <span className="ml-auto flex shrink-0 flex-col items-end gap-2 text-right">
                {now ? (
                  <Sticker tone="red" tilt={-5} className="text-[0.62rem] md:text-[0.7rem]">
                    Order now
                  </Sticker>
                ) : (
                  <span className="v2-mono opacity-60">Soon</span>
                )}
                <span className="v2-mono hidden sm:block">
                  {designs} design{designs === 1 ? "" : "s"} · {list.length} colour{list.length === 1 ? "" : "s"}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
