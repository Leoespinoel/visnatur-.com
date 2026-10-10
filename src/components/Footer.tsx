import Link from "next/link";
import { nav, site } from "@/data/site";
import { Wordmark } from "./Wordmark";
import { Newsletter } from "./Newsletter";
import { TrustBar } from "./TrustBar";

export function Footer() {
  return (
    <footer>
      <TrustBar />
      <div className="theme-dark">
        <div className="container-x grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Wordmark size="sm" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-2">{site.tagline} {site.description.split(". ").slice(1).join(". ")}</p>
          </div>
          <FooterCol title="Shop" links={nav.footer.shop} />
          <FooterCol title="Brand" links={nav.footer.brand} />
          <FooterCol title="Help" links={nav.footer.help} />
          <div className="md:col-span-2 md:col-start-11">
            <Newsletter compact />
          </div>
        </div>
        <div className="border-t border-line">
          <div className="container-x flex flex-col gap-3 py-5 text-[11px] text-muted md:flex-row md:items-center md:justify-between">
            <p>
              © {site.foundedYear} {site.name}. Made to order in Mauritius.
            </p>
            <p className="flex flex-wrap gap-x-5 gap-y-1">
              <span>EUR · Ships across Europe</span>
              <span>Visa · Mastercard · Amex · Apple Pay · Google Pay</span>
              <Link href="/legal/terms" className="link-underline">
                Terms
              </Link>
              <Link href="/legal/privacy" className="link-underline">
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string; plain?: boolean }[] }) {
  return (
    <div className="md:col-span-2">
      <p className="eyebrow mb-5">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            {l.plain ? (
              <a href={l.href} className="text-sm text-ink-2 hover:text-ink link-underline">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="text-sm text-ink-2 hover:text-ink link-underline">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
