"use client";

import { rooms } from "@/data/members";
import type { ClubView } from "@/lib/club-ledger";
import { useRevealOnce } from "@/lib/use-reveal";
import { RollingNumber } from "@/components/RollingNumber";
import { ClubCard } from "./ClubCard";
import { longDate, pts, roomNo, roomOf } from "./format";

/** Where a number of points sits on the meter: the rooms are evenly spaced, the points between them are not. */
function position(points: number): number {
  const last = rooms.length - 1;
  for (let i = 0; i < last; i++) {
    if (points < rooms[i + 1].min) return (i + (points - rooms[i].min) / (rooms[i + 1].min - rooms[i].min)) / last;
  }
  return 1;
}

/** The meter across the three rooms, with "You are here". */
function RoomMeter({ view }: { view: ClubView }) {
  const [ref, shown] = useRevealOnce<HTMLDivElement>(0.4);
  const current = roomNo(view.room);
  const at = position(Math.max(view.earned, rooms[current].min));
  return (
    <div ref={ref}>
      <div className="flex justify-between">
        {rooms.map((r, i) => (
          <span key={r.id} className={`eyebrow ${i === current ? "!text-ink" : ""}`}>
            {r.name}
          </span>
        ))}
      </div>
      <div
        className="relative mt-5 h-0.5 bg-white/15"
        role="meter"
        aria-label="Points earned in the last twelve months"
        aria-valuemin={0}
        aria-valuemax={rooms[rooms.length - 1].min}
        aria-valuenow={view.earned}
        aria-valuetext={`${pts(view.earned)} points, ${roomOf(view.room).name}`}
      >
        <span
          className="absolute inset-0 origin-left bg-red transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] motion-reduce:transition-none"
          style={{ transform: `scaleX(${shown ? at : 0})` }}
        />
        {rooms.map((r, i) => (
          <span
            key={r.id}
            aria-hidden="true"
            className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${i <= current ? "bg-red" : "bg-[#3a3a3a]"}`}
            style={{ left: `${(i / (rooms.length - 1)) * 100}%` }}
          />
        ))}
        <span
          aria-hidden="true"
          className="absolute top-1/2 -translate-x-1/2 transition-[left] duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] motion-reduce:transition-none"
          style={{ left: `${(shown ? at : 0) * 100}%` }}
        >
          <span className="absolute left-1/2 top-0 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red bg-paper" />
          {/* Centred under the marker, or kept inside the bar at either end. */}
          <span
            className={`absolute top-4 whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-ink ${at > 0.85 ? "right-0" : at < 0.15 ? "left-0" : "left-1/2 -translate-x-1/2"}`}
          >
            You are here
          </span>
        </span>
      </div>
      <p className="mt-14 text-sm leading-relaxed text-ink-2">
        {view.next ? (
          <>
            <span className="text-ink">
              {pts(view.next.points)} points to {roomOf(view.next.room).name}.
            </span>{" "}
          </>
        ) : (
          <span className="text-ink">{roomOf(view.room).name}. It stays yours. </span>
        )}
        {pts(view.earned)} points earned in the last twelve months.
      </p>
    </div>
  );
}

/** Points to spend, what is on its way, the card and the meter. Black. */
export function ClubStatus({ view }: { view: ClubView }) {
  return (
    <section aria-label="Your points" className="theme-dark">
      <div className="container-x grid gap-14 py-16 md:grid-cols-12 md:items-center md:gap-x-10 md:py-24">
        <div className="md:col-span-7">
          <p className="eyebrow">Points to spend</p>
          <p className="display mt-5 text-[28vw] leading-[0.8] md:text-[10rem]">
            <RollingNumber value={pts(view.balance)} />
          </p>
          <div className="mt-7 space-y-1.5 text-sm leading-relaxed text-ink-2">
            {view.pending > 0 && <p>{pts(view.pending)} more on their way. Points from an order land three weeks after it ships.</p>}
            {view.expiresOn && <p>They keep while you order or claim at least once a year. Next date: {longDate(view.expiresOn)}.</p>}
            {!view.live && <p>Points from orders, and claiming rewards, switch on very soon.</p>}
          </div>
        </div>
        <div className="md:col-span-5">
          <ClubCard view={view} />
        </div>
        <div className="md:col-span-12 md:mt-6">
          <RoomMeter view={view} />
        </div>
      </div>
    </section>
  );
}
