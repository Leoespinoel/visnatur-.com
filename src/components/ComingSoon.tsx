/**
 * A grey veil with "Coming soon" across the picture of a piece, or of a tile that only leads to pieces
 * not on sale yet (see `comingSoon` in data/availability.ts). Place it after the picture inside a
 * positioned box; anything after it (labels, badges, arrows) stays on top. `label={false}` keeps just the veil.
 */
export function ComingSoon({ label = true }: { label?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-500/50">
      {label && <span className="bg-neutral-600/60 px-3 py-2 text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-white md:text-[11px]">Coming soon</span>}
    </div>
  );
}
