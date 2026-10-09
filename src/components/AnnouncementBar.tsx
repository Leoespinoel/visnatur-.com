import { announcements } from "@/data/site";

export function AnnouncementBar() {
  const items = [...announcements, ...announcements];
  return (
    <div className="bg-ink text-paper overflow-hidden border-b border-line/20" aria-label="Announcements">
      <div className="marquee-track py-2">
        {items.map((text, i) => (
          <span key={i} className="eyebrow !text-paper/90 px-8 whitespace-nowrap" aria-hidden={i >= announcements.length}>
            {text}
            <span className="ml-8 opacity-50">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
