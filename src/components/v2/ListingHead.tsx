import Link from "next/link";
import { v2Href } from "@/data/v2";
import { leadTimeLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";
import { Sticker } from "./Sticker";

/** Listing header: a breadcrumb, the title as big as it goes, one line, and two stickers. */
export function ListingHead({ title, line, crumb = true }: { title: string; line: string; crumb?: boolean }) {
  return (
    <header className="relative overflow-hidden border-b-[1.5px] border-ink px-4 pb-6 pt-8 md:px-6 md:pb-8 md:pt-10">
      {crumb && (
        <p className="v2-mono text-muted">
          <Link href={v2Href.shop} className="hover:text-ink">
            Shop
          </Link>{" "}
          / {title}
        </p>
      )}
      <h1 className="v2-display mt-3 break-words text-[22vw] md:text-[14vw] xl:text-[12rem]">{title}</h1>
      <p className="mt-4 max-w-md text-sm text-ink-2 md:text-base">{line}</p>
      <div className="pointer-events-none absolute right-4 top-8 hidden flex-col items-end gap-3 md:right-8 md:flex">
        <Sticker tone="black" tilt={5} className="text-[0.72rem]">
          Made when you order it
        </Sticker>
        <Sticker tilt={-3} className="text-[0.72rem]">
          {pledgePercentLabel()} to the wild
        </Sticker>
        <span className="v2-mono mt-1 text-muted">Ships in {leadTimeLabel()}</span>
      </div>
    </header>
  );
}
