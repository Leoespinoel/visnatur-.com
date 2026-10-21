"use client";

import { useEffect, useRef } from "react";
import type { Motes } from "@/data/ground";

/**
 * How the motes of one scene move: `vx` / `vy` in px per frame at 60 fps (down is positive), `sway` the sideways wobble,
 * `alpha` and `size` their look, `share` how many of the motes are out (the rest fade away). The scene's look is eased
 * towards whichever is current, so the forest's leaves slow and brighten into the reef's plankton rather than switching.
 */
type Look = { vx: number; vy: number; sway: number; alpha: number; size: number; share: number; color: string };

const LOOKS: Record<Motes, Look> = {
  mist: { vx: 0.12, vy: -0.02, sway: 0.35, alpha: 0.16, size: 2.8, share: 0.35, color: "255, 255, 255" },
  leaves: { vx: 0.06, vy: 0.22, sway: 1.1, alpha: 0.5, size: 1.7, share: 0.7, color: "255, 233, 184" },
  spray: { vx: 0.95, vy: -0.04, sway: 0.3, alpha: 0.45, size: 1.1, share: 1, color: "255, 255, 255" },
  plankton: { vx: 0.03, vy: -0.14, sway: 0.5, alpha: 0.55, size: 1.3, share: 0.85, color: "223, 238, 255" },
  snow: { vx: 0.02, vy: 0.07, sway: 0.2, alpha: 0.32, size: 1.5, share: 0.45, color: "255, 255, 255" },
};

const COUNT = 180;

type Mote = { x: number; y: number; r: number; speed: number; phase: number; on: number };

/**
 * The motes drifting through the scene on a 2D canvas, the size of the stage: mist on the summit, leaves falling in the
 * forest, spray blowing along the shore, plankton rising over the reef, marine snow at the bottom. Light on purpose: one
 * canvas, a few hundred dots, no library. It stops while the tab is hidden, and draws one still frame for visitors who
 * prefer reduced motion.
 */
export function GroundParticles({ mode }: { mode: Motes }) {
  const ref = useRef<HTMLCanvasElement>(null);
  // The scene the loop eases towards, read on every frame without restarting it.
  const target = useRef(mode);
  useEffect(() => {
    target.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const motes: Mote[] = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random(),
      speed: 0.6 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      on: 0,
    }));
    // The look in use, eased towards the scene's own on every frame.
    const look: Look = { ...LOOKS[mode] };

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      raf = 0;
      const dt = Math.min(now - last, 50);
      last = now;
      const t = dt / 16;
      const want = LOOKS[target.current];
      const k = 0.025 * t;
      look.vx += (want.vx - look.vx) * k;
      look.vy += (want.vy - look.vy) * k;
      look.sway += (want.sway - look.sway) * k;
      look.alpha += (want.alpha - look.alpha) * k;
      look.size += (want.size - look.size) * k;
      look.share += (want.share - look.share) * k;
      look.color = want.color;

      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        const out = i / COUNT < look.share ? 1 : 0;
        m.on += (out - m.on) * 0.03 * t;
        m.x += (look.vx * m.speed * t + Math.sin(now / 900 * look.sway + m.phase) * 0.25 * look.sway * t) / w;
        m.y += (look.vy * m.speed * t) / h;
        if (m.x > 1.02) m.x -= 1.04;
        if (m.x < -0.02) m.x += 1.04;
        if (m.y > 1.02) m.y -= 1.04;
        if (m.y < -0.02) m.y += 1.04;
        const a = look.alpha * m.on * (0.6 + 0.4 * Math.sin(now / 700 + m.phase));
        if (a <= 0.005) continue;
        ctx.fillStyle = `rgba(${look.color}, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r * look.size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    if (reduced) {
      // One still frame, with every mote already out.
      motes.forEach((m) => (m.on = 1));
      draw(performance.now());
    } else {
      start();
      document.addEventListener("visibilitychange", onVisibility);
    }
    return () => {
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // The scene's look is read from the ref on every frame, so the loop is set up once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
