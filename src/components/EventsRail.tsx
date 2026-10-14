"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Carousel } from "./Carousel";

/** An event as the row shows it, with its dates already written out (see `eventDates` in stories.ts). */
export type EventItem = {
  title: string;
  dates: string;
  /** Its last day, ISO: after it the event moves to Past. */
  last: string;
  place: string;
  sport: string;
  image: string;
  alt: string;
  status?: string;
  href?: string;
};

const subscribeNever = () => () => {};
const getToday = () => new Date().toISOString().slice(0, 10);
// On the server every event counts as upcoming; the split happens once the page is in the browser.
const getTodayServer = () => "";

const icon = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true } as const;

function EventCard({ event }: { event: EventItem }) {
  const card = (
    <article className="flex h-full flex-col border border-line bg-paper">
      <div className="image-frame aspect-[16/10]">
        <Image src={event.image} alt={event.alt} fill unoptimized sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-2xl leading-tight">{event.title}</h3>
        <p className="mt-3 flex items-center gap-2.5 text-sm">
          <svg {...icon}>
            <rect x="4" y="5" width="16" height="15" rx="1" />
            <path d="M4 10h16M9 3v4M15 3v4" />
          </svg>
          {event.dates}
        </p>
        <p className="mt-2 flex items-center gap-2.5 text-sm text-ink-2">
          <svg {...icon}>
            <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z" />
            <circle cx="12" cy="10" r="2.2" />
          </svg>
          {event.place}
        </p>
        <p className="eyebrow mt-4 font-semibold">{event.sport}</p>
      </div>
      {event.status && (
        <p className="flex items-center gap-2.5 border-t border-line px-5 py-4 text-sm">
          <span className="h-2 w-2 rounded-full bg-red" aria-hidden />
          {event.status}
        </p>
      )}
    </article>
  );
  if (!event.href) return card;
  return event.href.startsWith("http") ? (
    <a href={event.href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {card}
    </a>
  ) : (
    <Link href={event.href} className="block h-full">
      {card}
    </Link>
  );
}

/**
 * redbull.com's events row: the heading with Upcoming and Past tabs beside it, then a row of event cards
 * (date, place, sport, and a status line). Each tab says so plainly when it has nothing in it.
 */
export function EventsRail({ events }: { events: EventItem[] }) {
  const today = useSyncExternalStore(subscribeNever, getToday, getTodayServer);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const upcoming = events.filter((e) => !today || e.last >= today);
  const past = events.filter((e) => today && e.last < today).reverse();
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end gap-x-10 gap-y-4 md:mb-10">
        <h2 className="display text-4xl md:text-5xl">Events</h2>
        <div role="tablist" aria-label="Events" className="flex gap-7">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`relative pb-2 text-sm transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-red after:transition-transform ${
                tab === t ? "text-ink after:scale-x-100" : "text-muted after:scale-x-0 hover:text-ink"
              }`}
            >
              {t === "upcoming" ? "Upcoming" : "Past"}
            </button>
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <Carousel
          key={tab}
          ariaLabel={`${tab === "upcoming" ? "Upcoming" : "Past"} events`}
          arrows="sides"
          gap="gap-4 md:gap-6"
          itemClassName="w-[80%] sm:w-[45%] md:w-[calc((100%-3rem)/3.2)] lg:w-[calc((100%-4.5rem)/4.2)]"
        >
          {list.map((e) => (
            <EventCard key={e.title + e.last} event={e} />
          ))}
        </Carousel>
      ) : (
        <div className="flex flex-col gap-6 border border-line p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl">
            <p className="font-serif text-2xl md:text-3xl">
              {tab === "upcoming" ? "The first events are being planned." : "Nothing here yet."}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              {tab === "upcoming"
                ? "Days on the water, on the course and on the trail, hosted or backed by Vis Naturæ. Run a club, a regatta or a tournament? Propose one and we may back it."
                : "Every event we host or back is kept here afterwards, with its story."}
            </p>
          </div>
          {tab === "upcoming" && (
            <Link href="/stories#sponsorship" className="btn btn-outline w-fit shrink-0">
              Propose an event
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
