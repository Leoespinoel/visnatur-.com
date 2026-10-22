import Image from "next/image";
import Link from "next/link";
import { clubSignInHref } from "@/data/account";
import { earn, earnPictures, rewards, rooms } from "@/data/members";
import { memberPerks, membersMailto } from "@/data/stories";
import { BandHeading } from "./BandHeading";
import { Newsletter } from "@/components/Newsletter";
import { ClubFaq } from "./ClubFaq";
import { RoomCard } from "./RoomCard";

/** The in-page tabs, as on nude-project.com/pages/reward-landing: anchors to each section below. */
const tabs = [
  { id: "rooms", label: "Spots" },
  { id: "level-up", label: "Level up" },
  { id: "rewards", label: "Rewards" },
  { id: "members-only", label: "Members Only" },
  { id: "faq", label: "FAQ" },
];

/**
 * /members for everyone who isn't signed in: what the club is and how to join. Bands run white → black → grey → white →
 * black → red, ending on red above the footer like the other editorial pages.
 */
export function ClubPublic() {
  return (
    <>
      {/* Access: what the club is, the two ways in and the tabs. White. */}
      <section id="access" className="scroll-mt-24">
        <div className="container-x pt-14 pb-12 md:pt-20 md:pb-16">
          <p className="eyebrow mb-4">The VN World · Membership</p>
          <h1 className="display max-w-4xl text-5xl md:text-7xl">
            The <em className="italic">lineup</em>.
          </h1>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="text-base leading-relaxed text-ink-2 md:col-span-6 md:text-lg">
              Free to join. Points on every order, three spots to move up through, and rewards worth spending them on. Members Only goes one
              step further: a subscription that goes entirely to the wild.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end">
              <Link href="/account/register" className="btn btn-primary">
                Become a member
              </Link>
              <a href={clubSignInHref} className="btn btn-outline">
                I&rsquo;m a member
              </a>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted">Your account is your membership: an email and a code, no password. Points start counting the day they show in it; join before then and the welcome points are waiting.</p>
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
          <BandHeading eyebrow="Spots" title="Three spots, one lineup.">
            Each spot comes with its own perks. Your spot follows the points earned in the last twelve months, and nobody moves down.
          </BandHeading>
          <ol className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {rooms.map((r) => (
              <li key={r.name}>
                <RoomCard room={r} />
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
              <li key={e.action} className="flex flex-col border border-line bg-paper">
                <div className="image-frame aspect-square">
                  <Image src={earnPictures[e.id]} alt="" fill unoptimized sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                  <p className="font-serif text-4xl">{e.points}</p>
                  <p className="text-sm leading-relaxed text-ink-2">{e.action}</p>
                </div>
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

      {/* Members Only: the paid subscription on top of any room, all of it to the wild. Black. */}
      <section id="members-only" className="theme-dark scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Members Only · Subscription" title="All of it to the wild.">
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
          </div>
        </div>
      </section>

      {/* FAQ, grouped as on the reference page. Red, above the footer. */}
      <ClubFaq />
      {/* The letters, red, last, said for the club. */}
      <Newsletter />
    </>
  );
}
