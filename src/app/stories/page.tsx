import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { communityWall } from "@/data/community";
import {
  eventDates,
  events,
  eventStatusLabels,
  instagramHandle,
  plannedDays,
  sponsorshipMailto,
  sponsorships,
} from "@/data/stories";
import { CommunityWall } from "@/components/CommunityWall";
import { Newsletter } from "@/components/Newsletter";
import { StoryTile } from "@/components/StoryPair";
import { RoomCard } from "@/components/club/RoomCard";
import { rooms } from "@/data/members";
import { FilmHero } from "@/components/FilmHero";
import { MarqueeTrack } from "@/components/MarqueeTrack";
import { kiteFilm } from "@/data/film";
import { WordTicker } from "@/components/WordTicker";
import { EventsRail, type EventItem } from "@/components/EventsRail";
import { EventsOrbit, type OrbitSlide } from "@/components/EventsOrbit";

export const metadata: Metadata = {
  title: "In the wild",
  description: "Films, the journal, events, the community, members, sponsorship, conversations with our partners and the newsletter: the stories behind Vis Naturæ.",
};

/** A section's label and heading on the left, a line of copy on the right. */
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

/** One of a sponsorship's two short lists, between rules. */
function SponsorList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item} className="py-3 text-sm leading-relaxed text-ink-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The two bands: the name on a loop across a black strip, and the red follow line, both the height of the announcement bar above
 * the menu (Leo, 2026-10-21). They frame the film at the head of the page: name then follow line above it, and the other way round
 * below it with `flip` (Leo, 2026-10-21: "switch the order of the band only below the placeholder").
 */
function Bands({ flip = false }: { flip?: boolean }) {
  const name = (
    <div className="theme-dark overflow-hidden py-2">
      {/* The name alone, over and over, like the follow line (Leo, 2026-10-21: "remove the text that is not Vis Naturæ");
          enough copies that half the track is wider than any screen. */}
      <WordTicker size="band" phrases={Array.from({ length: 16 }, () => site.name)} />
    </div>
  );
  /* The follow line: a red band running the other way, the whole strip a link to the profile */
  const follow = (
    <a
      href={site.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow @${instagramHandle} on Instagram`}
      className="theme-red block overflow-hidden py-2 transition-colors hover:bg-red-2"
    >
      <MarqueeTrack as="span" aria-hidden="true" className="marquee-reverse">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className="flex shrink-0 items-center whitespace-nowrap text-[11px] leading-none font-medium uppercase tracking-[0.22em]">
            Follow @{instagramHandle}
            <span className="px-5 md:px-7">·</span>
          </span>
        ))}
      </MarqueeTrack>
    </a>
  );
  return flip ? (
    <>
      {follow}
      {name}
    </>
  ) : (
    <>
      {name}
      {follow}
    </>
  );
}

export default function StoriesPage() {
  const eventItems: EventItem[] = events.map((e) => ({
    title: e.title,
    dates: eventDates(e),
    last: e.end ?? e.start,
    place: e.place,
    sport: e.sport,
    image: e.image,
    alt: e.alt,
    status: e.status && eventStatusLabels[e.status],
    href: e.href,
  }));

  // The events stage (EventsOrbit.tsx): the events themselves once there are any, each leading to its page or to the rail
  // below; until then the kinds of day we plan (data/stories.ts `plannedDays`), each ending in the call to propose one.
  const orbitSlides: OrbitSlide[] =
    events.length > 0
      ? events.map((e) => ({
          key: e.title + e.start,
          eyebrow: e.sport,
          title: e.title,
          meta: `${eventDates(e)} · ${e.place}`,
          dek: e.status && eventStatusLabels[e.status],
          image: e.image,
          alt: e.alt,
          cta: e.href ? { label: e.status === "registrations-open" ? "Register" : "See the event", href: e.href } : { label: "See the events", href: "/stories#events" },
        }))
      : plannedDays.map((d) => ({ ...d, cta: { label: "Propose an event", href: "/stories#sponsorship" } }));

  return (
    <>
      <h1 className="sr-only">In the wild</h1>

      {/* The two bands, then the film, then the two bands again (Leo, 2026-10-21). */}
      <Bands />

      {/* The film at the head of the page (FilmHero.tsx, data/film.ts `kiteFilm`): on tablets and desktops the silent 80-second kite loop,
          on phones the play ring; with a YouTube ID set, a "Watch the film" button opens the full film with sound in the slot (Leo,
          2026-10-21). Exactly as tall as the first screen leaves after the header (--hdr, globals.css) and the four bands (27px each:
          11px type on 8px of padding), so the pair under it shows without scrolling (Leo, 2026-10-21). */}
      <section aria-label="The film" className="theme-dark relative flex h-[calc(100svh-var(--hdr)-108px)] min-h-64 items-center justify-center overflow-hidden">
        <FilmHero loop={kiteFilm.loop} poster={kiteFilm.poster} youtubeId={kiteFilm.youtubeId} title={kiteFilm.title} />
      </section>

      {/* The wall: the two bands again under the film, follow line first, then the people in the pieces and the moments between them */}
      <section id="community" aria-label="In the wild" className="scroll-mt-24 pb-16 md:pb-24">
        <Bands flip />
        <CommunityWall blocks={communityWall} instagram={site.instagram} handle={instagramHandle} />
      </section>

      {/* Events (Leo, 2026-10-21: its own section, split from the club; no top padding, the wall above already leaves the space and
          Leo asked for the white gap between the two to go): the stage with the call for events, then the rail of
          upcoming ones once there are any. */}
      {/* The heading keeps the page margin; the stage runs edge to edge (Leo, 2026-10-21: "make this fill the white space"). */}
      <section id="events" aria-label="Events" className="scroll-mt-24 pb-16 md:pb-24">
        <div className="container-x">
          <BandHeading eyebrow="Events" title={eventItems.length > 0 ? "Upcoming events." : "The first ones are being planned."}>
            Days on the water, on the course and on the trail, hosted or backed by Vis Naturæ.
            {eventItems.length === 0 && " Run a club, a regatta or a tournament? Propose one."}
          </BandHeading>
        </div>
        <EventsOrbit slides={orbitSlides} label={events.length > 0 ? "Upcoming events" : "The days we plan"} />
        {eventItems.length > 0 && (
          <div className="container-x pt-16 md:pt-24">
            <EventsRail events={eventItems} />
          </div>
        )}
      </section>

      {/* The membership (Leo, 2026-10-21: a section of its own below events, advertising the club and its tiers): what joining gives,
          the three rooms from the club page (data/members.ts, RoomCard.tsx), and the way in. Black. */}
      <section id="members" aria-label="Members only" className="theme-dark scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Members only" title="For the people who come back.">
            Free to join. Points on every order, three rooms to move up through, and rewards worth spending them on. The room follows the
            points earned in the last twelve months, and nobody moves down. Members Only goes further: a subscription that goes entirely to
            the wild.
          </BandHeading>
          <ol className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {rooms.map((r) => (
              <li key={r.id}>
                <RoomCard room={r} />
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3 md:mt-16">
            <Link href="/account/register" className="btn btn-primary">
              Join the club
            </Link>
            <Link href="/members" className="btn btn-outline">
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsorship: one picture per kind of applicant, the details folded under it */}
      <section id="sponsorship" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Sponsorship" title="We back people who go all in.">
            Vis Naturæ sponsors athletes and ambassadors, artists, and clubs, teams and events. Not the biggest names: the ones who go all in,
            then rest like they mean it. We read every application and answer within two working days.
          </BandHeading>
          <div className="grid gap-y-10 md:grid-cols-3 md:gap-x-2">
            {sponsorships.map((s) => (
              <article key={s.key}>
                <StoryTile
                  story={{ title: s.title, dek: s.text, image: s.image, alt: s.alt, links: [{ label: s.cta, href: sponsorshipMailto(s) }] }}
                  size="sm"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <details className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[11px] uppercase tracking-[0.18em] [&::-webkit-details-marker]:hidden">
                    What we give &amp; what we look for
                    <span aria-hidden="true" className="text-base leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="grid gap-8 pb-8 pt-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                    <SponsorList title="What we give" items={s.give} />
                    <SponsorList title="What we look for" items={s.lookFor} />
                  </div>
                </details>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter, red above the trust row */}
      <div id="letters" className="scroll-mt-24">
        <Newsletter context="stories" />
      </div>
    </>
  );
}
