"use client";

import type { CSSProperties, ReactNode } from "react";

/** The ink the shapes are drawn in, and the paler ink of the layer behind them. */
const INK = "#06080a";
const BACK = "#101920";
/** The reef's shapes sit inside the water, so their ink is the sea's own dark. */
const DEEP = "#0e3843";

const line = { fill: "none", stroke: INK, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const back = { ...line, stroke: BACK } as const;

/** One drawn scene at the foot of the stage; `on` shows it, and it lifts a little as the page goes on (`lift`, in %). */
function Scene({ on, lift, children, className = "h-[46%]" }: { on: boolean; lift: number; children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      className={`ground-scene-art absolute inset-x-0 bottom-0 w-full ${on ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ transform: `translateY(${lift}%)` } as CSSProperties}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** A tree fern: a fan of fronds from one root, each frond a curve with a toothed stroke along it for the leaflets. */
function Fern({ x, flip = false, scale = 1, ink = INK }: { x: number; flip?: boolean; scale?: number; ink?: string }) {
  const fronds = [
    "M0 0 Q -60 -120 -150 -170",
    "M0 0 Q -30 -150 -80 -230",
    "M0 0 Q 10 -160 30 -250",
    "M0 0 Q 50 -140 120 -210",
    "M0 0 Q 70 -100 170 -130",
  ];
  return (
    <g transform={`translate(${x} 420) scale(${flip ? -scale : scale} ${scale})`} stroke={ink} fill="none" strokeLinecap="round">
      {fronds.map((d) => (
        <g key={d}>
          <path d={d} strokeWidth={5} />
          <path d={d} strokeWidth={20} strokeDasharray="3 8" opacity={0.85} />
        </g>
      ))}
    </g>
  );
}

/** A mangrove: a short trunk and the prop roots arching down from it into the water. */
function Mangrove({ x, scale = 1, ink = INK }: { x: number; scale?: number; ink?: string }) {
  return (
    <g transform={`translate(${x} 0) scale(${scale})`} stroke={ink} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 0 V190" strokeWidth={16} />
      <path d="M0 170 Q -40 290 -120 420" strokeWidth={9} />
      <path d="M0 185 Q -10 300 -40 420" strokeWidth={8} />
      <path d="M0 180 Q 30 290 70 420" strokeWidth={9} />
      <path d="M0 160 Q 80 240 150 420" strokeWidth={7} />
      <path d="M0 150 Q -90 220 -200 420" strokeWidth={6} />
      <path d="M-60 300 Q -70 360 -90 420" strokeWidth={5} />
      <path d="M40 310 Q 60 360 60 420" strokeWidth={5} />
    </g>
  );
}

/** Staghorn coral: a few branching strokes from one foot. */
function Staghorn({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x} 420) scale(${scale})`} stroke={DEEP} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={7}>
      <path d="M0 0 V-90 M0 -40 L-34 -96 M-34 -96 L-52 -140 M-34 -96 L-18 -130 M0 -60 L30 -110 M30 -110 L24 -150 M30 -110 L58 -136" />
    </g>
  );
}

/** Brain coral: a dome of short arcs. */
function Brain({ x, r }: { x: number; r: number }) {
  return (
    <g transform={`translate(${x} 420)`} stroke={DEEP} fill="none" strokeLinecap="round" strokeWidth={6}>
      <path d={`M${-r} 0 A${r} ${r * 0.7} 0 0 1 ${r} 0`} />
      <path d={`M${-r * 0.6} 0 A${r * 0.6} ${r * 0.45} 0 0 1 ${r * 0.6} 0`} />
      <path d={`M${-r * 0.25} 0 A${r * 0.25} ${r * 0.2} 0 0 1 ${r * 0.25} 0`} />
    </g>
  );
}

/**
 * The drawn scenes along the foot of the stage, one per ground, crossfading with the scene in view (`active`, the index
 * in data/ground.ts `stages`): the ridge above the cloud on the summit, tree ferns and trunks in the forest, mangroves
 * standing in the water on the shore, coral on the reef floor. Drawn in ink on the tint, nothing photographed (Leo,
 * 2026-10-21). The reef's layer is placed over the sea by GroundStage, so it reads as under the water.
 */
export function GroundSilhouettes({ active, progress, part }: { active: number; progress: number; part: "land" | "reef" }) {
  const lift = -progress * 8;
  if (part === "reef") {
    return (
      <Scene on={active === 3} lift={lift}>
        <Staghorn x={230} scale={1.1} />
        <Brain x={420} r={90} />
        <Staghorn x={560} scale={0.8} />
        <Brain x={760} r={60} />
        <Staghorn x={900} scale={1.3} />
        <Brain x={1120} r={110} />
        <Staghorn x={1310} scale={0.9} />
        {/* A few fish, short dashes with a flick of tail, higher in the water. */}
        <g stroke={DEEP} strokeWidth={5} strokeLinecap="round" fill="none">
          <path d="M640 150 l30 -4 l-10 10 M1010 110 l26 -3 l-9 9 M1050 140 l22 -3 l-8 8 M330 200 l28 -4 l-10 10" />
        </g>
      </Scene>
    );
  }
  return (
    <>
      {/* The summit: the far ridge, a band of cloud lying in the valley, the near ridge. */}
      <Scene on={active === 0} lift={lift}>
        <defs>
          <filter id="ground-cloud" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
        <path d="M0 250 Q140 180 280 230 T560 190 T840 240 T1120 170 T1440 220 V420 H0 Z" fill={BACK} />
        <g filter="url(#ground-cloud)" fill="#aebcc8" opacity={0.22}>
          <ellipse cx={260} cy={330} rx={260} ry={34} />
          <ellipse cx={760} cy={345} rx={340} ry={40} />
          <ellipse cx={1240} cy={325} rx={280} ry={36} />
        </g>
        <path d="M0 380 Q160 320 320 360 T620 330 T920 370 T1220 320 T1440 350 V420 H0 Z" fill={INK} />
      </Scene>

      {/* The forest: trunks behind, tree ferns in front. */}
      <Scene on={active === 1} lift={lift}>
        <g {...back} strokeWidth={12}>
          <path d="M200 420 L190 40 M640 420 L650 20 M1060 420 L1052 60 M1380 420 L1386 90" />
        </g>
        <Fern x={520} scale={0.6} ink={BACK} />
        <Fern x={1000} flip scale={0.7} ink={BACK} />
        <g {...line} strokeWidth={16}>
          <path d="M360 420 L352 0 M900 420 L908 10" />
        </g>
        <Fern x={120} />
        <Fern x={1320} flip />
        <Fern x={720} scale={0.75} />
      </Scene>

      {/* The shore: mangroves standing in the water, the sea passing through their roots. The layer is taller here so the
          trunks stand well above the surface (at 58% of the screen) and only the roots go under. */}
      <Scene on={active === 2} lift={lift} className="h-[74%]">
        <Mangrove x={720} scale={0.7} ink={BACK} />
        <Mangrove x={440} scale={0.8} ink={BACK} />
        <Mangrove x={1040} scale={0.75} ink={BACK} />
        <Mangrove x={170} />
        <Mangrove x={1290} />
      </Scene>
    </>
  );
}
