"use client";

import { useEffect, useState } from "react";

export const clubTabs = [
  { id: "your-rewards", label: "Your rewards" },
  { id: "rewards", label: "Rewards" },
  { id: "level-up", label: "Level up" },
  { id: "rooms", label: "Spots" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "faq", label: "FAQ" },
];

/**
 * The member page's sections, as on nude-project.com's: a row that sticks under the header, with a red dot on the
 * section in view. Scrolls sideways on phones.
 */
export function ClubTabs() {
  const [top, setTop] = useState(0);
  const [active, setActive] = useState(clubTabs[0].id);

  // Stick just under the site header, whatever its height (the announcement bar comes and goes).
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const measure = () => setTop(header.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const sections = clubTabs.map((t) => document.getElementById(t.id)).filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (seen) setActive(seen.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="The lineup" className="sticky z-30 border-b border-line bg-paper/90 backdrop-blur" style={{ top }}>
      <ul className="no-scrollbar container-x flex gap-8 overflow-x-auto md:justify-between">
        {clubTabs.map((t) => (
          <li key={t.id} className="shrink-0">
            <a
              href={`#${t.id}`}
              aria-current={active === t.id ? "true" : undefined}
              className={`eyebrow flex items-center gap-2 py-4 transition-colors ${active === t.id ? "!text-ink" : "hover:!text-ink"}`}
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full transition-colors ${active === t.id ? "bg-red" : "bg-transparent"}`} />
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
