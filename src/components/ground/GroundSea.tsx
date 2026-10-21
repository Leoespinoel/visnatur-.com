"use client";

/**
 * The sea, drawn: a layer two stages tall whose top edge is the surface, placed by `--sea` (the surface's height as a
 * share of the stage, set per frame by GroundScene from each scene's `sea` stop in data/ground.ts). Off the foot of the
 * screen on the summit and in the forest, at your waist on the shore, above you on the reef, everything at the bottom.
 * The edge is two wave strips sliding sideways (the back one paler), a pale band under the surface, and, while the
 * surface stands high in the screen, three soft beams of light hanging from it. Decorative.
 */
// One wave, four periods across the strip, each a smooth rise and fall; the strip is drawn twice as wide as the stage and
// slides by half its width, two whole periods, so the loop is seamless.
const WAVE = `M0 22 ${Array.from({ length: 4 }, () => "c60 -16 120 -16 180 0 c60 16 120 16 180 0").join(" ")} V44 H0 Z`;

export function GroundSea({ rays }: { rays: boolean }) {
  return (
    <div className="ground-sea absolute inset-x-0" style={{ top: "var(--sea, 125%)", height: "200%" }} aria-hidden="true">
      <svg className="ground-wave ground-wave-back absolute left-0 -top-9 h-11 w-[200%]" viewBox="0 0 1440 44" preserveAspectRatio="none">
        <path d={WAVE} fill="#17434f" />
      </svg>
      <svg className="ground-wave absolute left-0 -top-6 h-11 w-[200%]" viewBox="0 0 1440 44" preserveAspectRatio="none">
        <path d={WAVE} fill="#0c3340" />
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0c3340_0%,#082531_10%,#04141d_40%,#02090f_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(150,210,225,0.16),transparent)]" />
      <div className={`ground-rays absolute inset-x-0 top-0 h-[55%] transition-opacity duration-1000 ${rays ? "opacity-100" : "opacity-0"}`}>
        <span className="absolute top-0 left-[18%] h-full w-28 -skew-x-12 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10),transparent_80%)]" />
        <span className="absolute top-0 left-[44%] h-full w-40 -skew-x-6 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_85%)]" />
        <span className="absolute top-0 left-[68%] h-full w-24 skew-x-6 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.09),transparent_75%)]" />
      </div>
    </div>
  );
}
