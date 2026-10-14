import Link from "next/link";

export type Crumb = { label: string; href: string };

export function PageIntro({
  eyebrow,
  title,
  lede,
  variant = "editorial",
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  variant?: "editorial" | "listing";
  /** Listing only: the pages above this one, shown as a breadcrumb over the title in place of the eyebrow. */
  crumbs?: Crumb[];
}) {
  if (variant === "listing") {
    return (
      <div className="container-x pt-10 pb-6 md:pt-14 md:pb-8">
        {crumbs ? (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  <Link href={c.href} className="link-underline hover:text-ink">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : (
          eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>
        )}
        <h1 className="headline text-4xl md:text-6xl">{title}</h1>
        {lede && <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-2">{lede}</p>}
      </div>
    );
  }
  return (
    <div className="container-x pt-14 pb-10 md:pt-20 md:pb-14">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="display max-w-4xl text-5xl md:text-7xl">{title}</h1>
      {lede && <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">{lede}</p>}
    </div>
  );
}
