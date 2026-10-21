"use client";

import type { Stage } from "@/data/ground";
import { GroundParticles } from "./GroundParticles";
import { GroundSea } from "./GroundSea";
import { GroundSilhouettes } from "./GroundSilhouettes";

/**
 * The scene behind the panels, the size of the stage, drawn rather than photographed (Leo, 2026-10-21), in layers from
 * the back: black with one pool of tinted light per scene (colour and place from data/ground.ts, the current one shown);
 * the drawn land (ridge and cloud, ferns, mangroves) along the foot; the sea, whose surface rises through the screen as
 * the page goes down (`--sea`); the reef's coral over the sea, so it reads as under the water; the black wash that
 * deepens with the descent (`--descent`); the motes; a still film grain; and a gradient at the foot so the panels' copy
 * reads. Decorative: the panels carry the meaning.
 */
export function GroundStage({ stages, active, progress, rays }: { stages: Stage[]; active: number; progress: number; rays: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      {stages.map((s, i) => (
        <div
          key={s.key}
          className={`ground-tint absolute inset-0 ${i === active ? "opacity-100" : "opacity-0"}`}
          style={{ background: `radial-gradient(ellipse 80% 70% at ${s.tint.at}, ${s.tint.color} 0%, transparent 70%)` }}
        />
      ))}
      <GroundSilhouettes active={active} progress={progress} part="land" />
      <GroundSea rays={rays} />
      <GroundSilhouettes active={active} progress={progress} part="reef" />
      <div className="ground-wash absolute inset-0 bg-black" />
      <GroundParticles mode={stages[active].motes} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden="true">
        <filter id="ground-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ground-grain)" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}
