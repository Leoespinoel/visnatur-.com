/**
 * Rows of badgers drifting in opposite directions behind a section (the pledge figure on /conservation,
 * the community row on the homepage, the big badger in the footer). Put it first in a `relative overflow-hidden` section and give the
 * content after it `relative` so it sits on top. `bottom` stacks them up from the section's bottom edge instead of
 * centring them, so the last row sits just above a border there.
 */
export function BadgerRows({ rows = 16, bottom = false }: { rows?: number; bottom?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex flex-col gap-4 opacity-20 md:gap-6 ${bottom ? "justify-end pb-1" : "justify-center"}`}
      aria-hidden="true"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="badger-row" />
      ))}
    </div>
  );
}
