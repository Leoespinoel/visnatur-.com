import Image from "next/image";
import type { Room } from "@/data/members";

/**
 * One room of the club: its picture, points, name, rate and perks. On the member page it also says where the member
 * stands: their room ("You are here"), rooms they have been through, and rooms still to reach (faded).
 */
export function RoomCard({ room, state, note }: { room: Room; state?: "current" | "reached" | "locked"; note?: string }) {
  const locked = state === "locked";
  return (
    <div className={`transition-opacity ${locked ? "opacity-45" : ""}`}>
      <div className={`image-frame relative aspect-[4/5] ${state === "current" ? "outline outline-1 outline-offset-4 outline-ink" : ""}`}>
        <Image src={room.image} alt={room.alt} fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className={`object-cover ${locked ? "grayscale" : ""}`} />
        {state === "current" && <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-ink">You are here</span>}
      </div>
      <p className="eyebrow mt-5">{note ?? room.points}</p>
      <h3 className="mt-2 font-serif text-3xl">{room.name}</h3>
      <p className="mt-1 text-sm text-ink-2">{room.rate}</p>
      <ul className="mt-5 divide-y divide-line border-y border-line">
        {room.perks.map((p) => (
          <li key={p} className="py-3 text-sm leading-relaxed text-ink-2">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
