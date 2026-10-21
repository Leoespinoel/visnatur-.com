import { rooms, type RoomId } from "@/data/members";

/** Small formatters for the member page. Dates are shown in UTC, as Shopify stores them. */
export const pts = (n: number) => Math.abs(n).toLocaleString("en-GB");
export const signed = (n: number) => `${n < 0 ? "−" : "+"}${pts(n)}`;
export const longDate = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
export const shortDate = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
export const monthYear = (iso: string) => new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
export const two = (n: number) => String(n).padStart(2, "0");
export const roomOf = (id: RoomId) => rooms.find((r) => r.id === id)!;
export const roomNo = (id: RoomId) => rooms.findIndex((r) => r.id === id);

/** "14 July" from "07-14". */
export const dayMonth = (md: string) => {
  const [m, d] = md.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, m - 1, d)));
};

/** Media queries for client components, false on the server. */
export function mediaStore(query: string) {
  return {
    subscribe: (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    get: () => window.matchMedia(query).matches,
    server: () => false,
  };
}
