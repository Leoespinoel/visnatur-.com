/**
 * Rows of badgers drifting in opposite directions behind a section (the pledge figure on /conservation,
 * the community row on the homepage, the big badger in the footer). Put it first in a `relative overflow-hidden` section and give the
 * content after it `relative` so it sits on top.
 */
export function BadgerRows({ rows = 16 }: { rows?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-4 opacity-20 md:gap-6" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="badger-row" />
      ))}
    </div>
  );
}
