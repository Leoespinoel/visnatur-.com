import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { club, clubFaqs, earn, rewards, rooms } from "@/data/members";
import { memberPerks, membersMailto } from "@/data/stories";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "The VN Club",
  description: "The Vis Naturæ membership: free to join, points on every order, three rooms and rewards. Members Only, the subscription, goes entirely to conservation.",
};

/** The in-page tabs, as on nude-project.com/pages/reward-landing: anchors to each section below. */
const tabs = [
  { id: "rooms", label: "Rooms" },
  { id: "level-up", label: "Level up" },
  { id: "rewards", label: "Rewards" },
  { id: "members-only", label: "Members Only" },
  { id: "faq", label: "FAQ" },
];

/** A section's label and heading on the left, a line of copy on the right (as on /stories). */
function BandHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-12">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="display text-4xl md:text-5xl">{title}</h2>
      </div>
      {children && <div className="max-w-md text-sm leading-relaxed text-ink-2">{children}</div>}
    </div>
  );
}

/** Bands run white → black → grey → white → black → red, ending on red above the footer like the other editorial pages. */
export default function MembersPage() {
  return (
    <>
      {/* Access: what the club is, the two ways in and the tabs. White. */}
      <section id="access" className="scroll-mt-24">
        <div className="container-x pt-14 pb-12 md:pt-20 md:pb-16">
          <p className="eyebrow mb-4">The VN World · Membership</p>
          <h1 className="display max-w-4xl text-5xl md:text-7xl">
            The VN <em className="italic">Club</em>.
          </h1>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="text-base leading-relaxed text-ink-2 md:col-span-6 md:text-lg">
              Free to join. Points on every order, three rooms to move up through, and rewards worth spending them on. Members Only goes one
              step further: a subscription that goes entirely to conservation.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end">
              <a href={club.joinMailto} className="btn btn-primary">
                Become a member
              </a>
              <a href={club.memberMailto} className="btn btn-outline">
                I&rsquo;m a member
              </a>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted">Points start counting when member accounts open. Until then, joining is by email and the welcome points are credited then.</p>
          <nav aria-label="On this page" className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-4">
            {tabs.map((t) => (
              <a key={t.id} href={`#${t.id}`} className="eyebrow !text-ink link-underline">
                {t.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Rooms: the three parts of the club, each with its perks. Black. */}
      <section id="rooms" className="theme-dark scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Rooms" title="Three rooms, one club.">
            Each room is its own part of the club, with its own perks. The room follows the points earned in the last twelve months, and nobody
            moves down.
          </BandHeading>
          <ol className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {rooms.map((r) => (
              <li key={r.name}>
                <div className="image-frame aspect-[4/5]">
                  <Image src={r.image} alt={r.alt} fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <p className="eyebrow mt-5">{r.points}</p>
                <h3 className="mt-2 font-serif text-3xl">{r.name}</h3>
                <p className="mt-1 text-sm text-ink-2">{r.rate}</p>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {r.perks.map((p) => (
                    <li key={p} className="py-3 text-sm leading-relaxed text-ink-2">
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Level up: ways to earn points. Grey. */}
      <section id="level-up" className="scroll-mt-24 bg-surface py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Level up" title="Ways to earn." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {earn.map((e) => (
              <li key={e.action} className="flex flex-col justify-between gap-8 border border-line bg-paper p-6">
                <p className="font-serif text-4xl">{e.points}</p>
                <p className="text-sm leading-relaxed text-ink-2">{e.action}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rewards: what points turn into. White. */}
      <section id="rewards" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Rewards" title="What points turn into." />
          <ul className="divide-y divide-line border-y border-line md:max-w-3xl">
            {rewards.map((r) => (
              <li key={r.reward} className="flex items-baseline justify-between gap-6 py-5">
                <span className="font-serif text-xl md:text-2xl">{r.reward}</span>
                <span className="eyebrow shrink-0 !text-ink">{r.points} points</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Members Only: the paid subscription on top of any room, all of it to conservation. Black. */}
      <section id="members-only" className="theme-dark scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Members Only · Subscription" title="All of it to conservation.">
            A subscription on top of any room. None of it stays with the brand. In return, members get discounts at the clubs and events Vis
            Naturæ partners with. The price is announced with the first partner clubs.
          </BandHeading>
          <ul className="grid gap-6 md:grid-cols-3">
            {memberPerks.map((p, i) => (
              <li key={p.title} className="flex flex-col border border-line p-6 md:p-8">
                <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-8 font-serif text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={membersMailto} className="btn btn-primary">
              Join Members Only
            </a>
            <Link href="/conservation" className="btn btn-outline">
              Where it goes
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ, grouped as on the reference page. Red, above the footer. */}
      <section id="faq" className="theme-red scroll-mt-24">
        <div className="container-x py-16 md:py-24">
          <SectionHeading eyebrow="FAQ" title="Asked often." />
          <div className="space-y-10 md:max-w-3xl">
            {clubFaqs.map((g) => (
              <div key={g.group}>
                <p className="eyebrow mb-3">{g.group}</p>
                <div className="divide-y divide-line border-y border-line">
                  {g.items.map((f) => (
                    <details key={f.q} className="group py-5">
                      <summary className="flex items-center justify-between gap-6 font-serif text-xl md:text-2xl">
                        {f.q}
                        <span className="text-muted transition-transform group-open:rotate-45" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <p className="pt-4 text-sm leading-relaxed text-ink-2 md:max-w-2xl">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
