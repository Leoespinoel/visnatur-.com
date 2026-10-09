import Link from "next/link";
import { ArrowIcon } from "./Icons";

export function SectionHeading({
  eyebrow,
  title,
  link,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  link?: { label: string; href: string };
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between ${align === "center" ? "text-center md:justify-center" : ""}`}>
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="display text-4xl md:text-5xl">{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className="eyebrow !text-ink inline-flex items-center gap-2 link-underline">
          {link.label}
          <ArrowIcon width={14} height={14} />
        </Link>
      )}
    </div>
  );
}
