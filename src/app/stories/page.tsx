import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { communityPosts } from "@/data/community";
import {
  articleHref,
  articles,
  articlesOf,
  eventDates,
  events,
  eventStatusLabels,
  forthcoming,
  instagramHandle,
  instagramTiles,
  kindLabels,
  memberPerks,
  readLabel,
  sponsorshipMailto,
  sponsorships,
} from "@/data/stories";
import { ArticleCard } from "@/components/ArticleCard";
import { Carousel } from "@/components/Carousel";
import { CommunityCard } from "@/components/CommunityCard";
import { Newsletter } from "@/components/Newsletter";
import { PartnerMark } from "@/components/PartnerBand";
import { StoriesHero, type HeroStory } from "@/components/StoriesHero";
import { EventsRail, type EventItem } from "@/components/EventsRail";

export const metadata: Metadata = {
  title: "Community",
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

export default function StoriesPage() {
  const interviews = articlesOf("interview");

  // The slides at the top: every story, then the call for sponsorship.
  const slides: HeroStory[] = [
    ...articles.map((a) => ({
      key: a.slug,
      title: a.title,
      dek: a.dek,
      image: a.hero?.image ?? a.image,
      alt: a.hero?.alt ?? a.alt,
      position: a.hero?.position,
      href: articleHref(a),
      cta: a.video ? "Watch film" : "Read story",
      meta: [kindLabels[a.kind], readLabel(a)],
    })),
    {
      key: "sponsorship",
      title: "We back people who go all in.",
      dek: "Athletes and ambassadors, artists, clubs, teams and events. Tell us what you go all in at.",
      image: "/images/campaign-golf.jpg?v=r1016",
      alt: "Two golfers on a seaside tee, one swinging in a white polo and white shorts, the other in a navy knit polo with a leather golf bag",
      position: "62% 50%",
      href: "/stories#sponsorship",
      cta: "Apply",
      meta: ["Sponsorship", "Athletes, artists, clubs & events"],
    },
  ];

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

  return (
    <>
      <h1 className="sr-only">Community</h1>
      <StoriesHero slides={slides} />

      {/* The page slides up over the foot of the pictures, as on redbull.com: the latest stories, then events */}
      <div className="relative z-10 -mt-6 rounded-t-3xl bg-paper md:-mt-8 md:rounded-t-[2rem]">
        <section id="latest" aria-labelledby="latest-title" className="container-x scroll-mt-24 pt-12 md:pt-16">
          <h2 id="latest-title" className="display mb-8 text-4xl md:mb-10 md:text-5xl">
            Latest
          </h2>
          <Carousel
            ariaLabel="Latest stories"
            arrows="sides"
            gap="gap-4 md:gap-6"
            itemClassName="w-[80%] sm:w-[45%] md:w-[calc((100%-3rem)/3.2)] lg:w-[calc((100%-4.5rem)/4.2)]"
          >
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 31vw, (min-width: 640px) 45vw, 80vw" />
            ))}
          </Carousel>
        </section>

        <section id="events" aria-label="Events" className="container-x scroll-mt-24 py-16 md:py-24">
          <EventsRail events={eventItems} />
        </section>
      </div>

      {/* Press, on black */}
      <section id="press" className="theme-dark scroll-mt-24">
        <div className="container-x grid gap-8 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <p className="eyebrow mb-3">Press</p>
            <h2 className="display text-3xl md:text-4xl">Writing about us?</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-sm leading-relaxed text-ink-2 md:text-base">
              The partners and press deck tells the whole story in one place. For interviews, pictures or anything else, write to us. We answer
              within two working days.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {/* Static page in public/pitch.html, so a plain link rather than a Link. */}
              <a href="/pitch" className="btn btn-primary">
                Partners &amp; press deck
              </a>
              <a href={`mailto:${site.email}?subject=${encodeURIComponent("Press")}`} className="btn btn-outline">
                Press enquiries
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Community and Instagram */}
      <section id="community" className="scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Community" title="In the pieces, out in the world.">
            Wearing Vis Naturæ somewhere worth seeing? Tag @{instagramHandle} or send the picture to{" "}
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Community")}`} className="text-ink underline underline-offset-4">
              {site.email}
            </a>
            . We always ask before we share.
          </BandHeading>
        </div>
        <Carousel ariaLabel="Community" itemClassName="w-[62%] sm:w-[40%] md:w-[calc((100%-2rem)/4.3)] lg:w-[calc((100%-2.5rem)/5.3)]" gap="gap-1.5 md:gap-2">
          {communityPosts.map((post, i) => (
            <CommunityCard key={i} post={post} />
          ))}
        </Carousel>

        <div className="container-x mt-16 md:mt-24">
          <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-3">Instagram</p>
              <h2 className="display text-4xl md:text-5xl">@{instagramHandle}</h2>
            </div>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-fit">
              Follow on Instagram
            </a>
          </div>
          <ul className="grid grid-cols-3 gap-1.5 md:grid-cols-6 md:gap-2">
            {instagramTiles.map((t) => (
              <li key={t.image}>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="group image-frame block aspect-square" aria-label={`${t.alt}, on Instagram`}>
                  <Image src={t.image} alt="" fill unoptimized sizes="(min-width: 768px) 16vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Members Only: the subscription, on grey between the white community and the black sponsorship */}
      <section id="members" className="scroll-mt-24 bg-surface py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="The VN Club · Membership" title="For the people who come back.">
            Free to join, with points, three rooms and rewards. Members Only goes further: a subscription that goes entirely to conservation,
            with member discounts at the clubs and events we partner with.
          </BandHeading>
          <ul className="grid gap-6 md:grid-cols-3">
            {memberPerks.map((p, i) => (
              <li key={p.title} className="flex flex-col border border-line bg-paper p-6 md:p-8">
                <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-8 font-serif text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link href="/members" className="btn btn-primary">
              The VN Club
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsorship: the athletes, artists, clubs and events we back, on black */}
      <section id="sponsorship" className="theme-dark scroll-mt-24 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Sponsorship" title="We back people who go all in.">
            Vis Naturæ sponsors athletes and ambassadors, artists, and clubs, teams and events. Not the biggest names: the ones who go all in,
            then rest like they mean it. We read every application and answer within two working days.
          </BandHeading>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {sponsorships.map((s, i) => {
              // An odd last card takes the whole row on tablets, under a wider picture.
              const wide = sponsorships.length % 2 === 1 && i === sponsorships.length - 1;
              return (
                <article key={s.key} className={`flex flex-col border border-line ${wide ? "md:max-lg:col-span-2" : ""}`}>
                  <div className={`image-frame aspect-[3/2] ${wide ? "md:max-lg:aspect-[2/1]" : ""}`}>
                    <Image src={s.image} alt={s.alt} fill unoptimized sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h3 className="display text-3xl md:text-4xl">{s.title}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-2">{s.text}</p>
                    <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
                      <SponsorList title="What we give" items={s.give} />
                      <SponsorList title="What we look for" items={s.lookFor} />
                    </div>
                    <div className="mt-auto pt-10">
                      <a href={sponsorshipMailto(s)} className="btn btn-primary">
                        {s.cta}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interviews: published ones first, then those still to come */}
      <section id="interviews" className="scroll-mt-24 bg-surface py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Interviews" title="In conversation.">
            The people we work with, in their own words: the workshop that makes every piece, and the partners the ten percent goes to. Each
            conversation goes up once the agreement behind it is signed.
          </BandHeading>
          {interviews.length > 0 && (
            <div className="mb-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {interviews.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {forthcoming.map((f) => (
              <li key={f.name} className="flex flex-col border border-line bg-paper p-6">
                <span className="text-ink-2">
                  <PartnerMark mark={f.mark} />
                </span>
                <h3 className="mt-8 font-serif text-2xl">{f.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{f.focus}</p>
                <p className="eyebrow mt-auto pt-8">Interview to follow</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Newsletter, red above the trust row */}
      <div id="letters" className="scroll-mt-24">
        <Newsletter />
      </div>
    </>
  );
}
