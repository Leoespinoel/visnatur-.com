"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Higgs field.
 *
 * A lattice of points seen from a low angle, the way the Higgs field is usually
 * drawn: a flat field that ripples, and a single excitation (the red "particle")
 * that gathers the field around it as it moves through. Rendered on a canvas so
 * it loops forever at retina sharpness with no video file to download.
 *
 * The whole animation is periodic with period LOOP_SECONDS, so a recording of
 * exactly one loop joins seamlessly (see /dev/higgs).
 */

export const LOOP_SECONDS = 20;

const BG = "#0a0a0a";
const WHITE = [255, 255, 255] as const;
const RED = [200, 16, 46] as const; // brand red #c8102e

const TAU = Math.PI * 2;

type Props = {
  className?: string;
  /** Fixed pixel size (for recording). Omit to fill the parent element. */
  size?: { width: number; height: number };
  /** Cap on devicePixelRatio. Recording wants exactly 1. */
  maxDpr?: number;
  /** Receives the canvas element (for recording). */
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  /** Grid density multiplier. 1 = default. */
  density?: number;
  /** Render a single still frame instead of animating. */
  still?: boolean;
  /** Frame export: no animation loop; exposes window.__higgsDraw(t) to draw any moment. */
  manual?: boolean;
};

declare global {
  interface Window {
    __higgsDraw?: (t: number) => void;
  }
}

export function HiggsField({ className = "", size, maxDpr = 2, canvasRef, density = 1, still = false, manual = false }: Props) {
  const localRef = useRef<HTMLCanvasElement | null>(null);
  const ref = canvasRef ?? localRef;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = still || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    // Projected screen coordinates, reused every frame.
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let pz = new Float32Array(0); // height of the field at the point, for colouring
    let pd = new Float32Array(0); // depth 0 (far) .. 1 (near)

    const resize = () => {
      const rect = size ?? canvas.getBoundingClientRect();
      dpr = Math.min(maxDpr, size ? 1 : window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (size) {
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
      // Density scales with width so phones get a lighter grid.
      cols = Math.round(Math.min(110, Math.max(40, w / 14)) * density);
      rows = Math.round(Math.min(64, Math.max(36, h / 16)) * density);
      const n = cols * rows;
      px = new Float32Array(n);
      py = new Float32Array(n);
      pz = new Float32Array(n);
      pd = new Float32Array(n);
    };

    /* Ambient field: a few slow travelling waves whose periods all divide the loop. */
    const ambient = (x: number, y: number, t: number) => {
      const p = (t / LOOP_SECONDS) * TAU;
      return (
        0.16 * Math.sin(x * 2.1 + p * 2) +
        0.12 * Math.sin(y * 3.3 - p * 3 + 1.3) +
        0.08 * Math.sin((x + y) * 4.2 + p * 4) +
        0.05 * Math.sin((x * 1.7 - y * 2.9) * 2.0 - p * 5)
      );
    };

    /* The particle wanders on a closed path with the loop's period. */
    const particle = (t: number) => {
      const p = (t / LOOP_SECONDS) * TAU;
      return {
        x: 0.7 * Math.sin(p) + 0.22 * Math.sin(p * 3 + 0.7),
        y: -0.2 + 0.55 * Math.sin(p * 2 + 1.1) + 0.12 * Math.cos(p * 3),
      };
    };

    const draw = (t: number) => {
      const c = ctx;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.fillStyle = BG;
      c.fillRect(0, 0, w, h);

      const part = particle(t);
      // Field depth in world units (centred on 0).
      const ey = 1.5;
      // Camera: looking down at the plane from a low angle.
      const camY = 0.82; // height above the field
      const camZ = 1.45; // distance behind the near edge
      const focal = 0.9 * h;
      const horizon = h * 0.33;
      // Every row spans 1.15x the viewport on screen, so in world space the field is a fan
      // that widens with distance. The grid then fills any aspect ratio, phone or ultrawide.
      const halfSpan = (0.575 * w) / focal; // world half-width per unit of depth

      let i = 0;
      for (let r = 0; r < rows; r++) {
        const y = -ey + (2 * ey * r) / (rows - 1); // -ey (near) .. +ey (far)
        const depth = y + ey + camZ; // > 0
        const ex = halfSpan * depth;
        for (let col = 0; col < cols; col++, i++) {
          const x = -ex + (2 * ex * col) / (cols - 1);
          const dx = x - part.x;
          const dy = y - part.y;
          const d2 = dx * dx + dy * dy;
          // The excitation: a Gaussian well that pulls the field down, with a ring that lifts around it.
          const well = Math.exp(-d2 * 9) * -0.42 + Math.exp(-d2 * 2.2) * 0.1;
          const z = ambient(x, y, t) + well;

          // Project. World: x right, y away from camera, z up.
          const s = focal / depth;
          px[i] = w / 2 + x * s;
          py[i] = horizon + (camY - z * 0.6) * s;
          pz[i] = z;
          pd[i] = 1 - (y + ey) / (2 * ey);
        }
      }

      const red = part;
      const near = (x: number, y: number) => {
        const dx = x - red.x;
        const dy = y - red.y;
        return Math.exp(-(dx * dx + dy * dy) * 5);
      };

      // Lines across (rows), near rows brighter.
      c.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        const y = -ey + (2 * ey * r) / (rows - 1);
        const dFade = 0.06 + 0.3 * Math.pow(1 - (y + ey) / (2 * ey), 1.4);
        c.beginPath();
        for (let col = 0; col < cols; col++) {
          const k = r * cols + col;
          if (col === 0) c.moveTo(px[k], py[k]);
          else c.lineTo(px[k], py[k]);
        }
        c.strokeStyle = `rgba(${WHITE[0]},${WHITE[1]},${WHITE[2]},${dFade.toFixed(3)})`;
        c.stroke();
      }
      // Lines along (columns), fainter.
      for (let col = 0; col < cols; col += 2) {
        c.beginPath();
        for (let r = 0; r < rows; r++) {
          const k = r * cols + col;
          if (r === 0) c.moveTo(px[k], py[k]);
          else c.lineTo(px[k], py[k]);
        }
        c.strokeStyle = "rgba(255,255,255,0.05)";
        c.stroke();
      }

      // Points. Each one is white, warming to red as it is caught by the excitation.
      i = 0;
      for (let r = 0; r < rows; r++) {
        const y = -ey + (2 * ey * r) / (rows - 1);
        const ex = halfSpan * (y + ey + camZ);
        for (let col = 0; col < cols; col++, i++) {
          const x = -ex + (2 * ex * col) / (cols - 1);
          const n = near(x, y);
          const depth = pd[i];
          const a = 0.18 + 0.55 * depth + 0.4 * n;
          const rad = (0.6 + 1.3 * depth) * (1 + 1.6 * n);
          const cr = Math.round(WHITE[0] + (RED[0] - WHITE[0]) * n);
          const cg = Math.round(WHITE[1] + (RED[1] - WHITE[1]) * n);
          const cb = Math.round(WHITE[2] + (RED[2] - WHITE[2]) * n);
          c.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(1, a).toFixed(3)})`;
          c.beginPath();
          c.arc(px[i], py[i], rad, 0, TAU);
          c.fill();
        }
      }

      // The particle itself: a soft red glow at the bottom of the well.
      {
        const depth = red.y + ey + camZ;
        const s = focal / depth;
        const z = ambient(red.x, red.y, t) - 0.32;
        const sx = w / 2 + red.x * s;
        const sy = horizon + (camY - z * 0.6) * s;
        const rr = 0.012 * s;
        const g = c.createRadialGradient(sx, sy, 0, sx, sy, rr * 7);
        g.addColorStop(0, "rgba(200,16,46,0.85)");
        g.addColorStop(0.35, "rgba(200,16,46,0.35)");
        g.addColorStop(1, "rgba(200,16,46,0)");
        c.fillStyle = g;
        c.beginPath();
        c.arc(sx, sy, rr * 7, 0, TAU);
        c.fill();
        c.fillStyle = "#ff3b55";
        c.beginPath();
        c.arc(sx, sy, rr, 0, TAU);
        c.fill();
      }

      // Vignette: fade the far edge into the background and darken the sides.
      const vg = c.createLinearGradient(0, 0, 0, h);
      vg.addColorStop(0, "rgba(10,10,10,1)");
      vg.addColorStop(0.3, "rgba(10,10,10,0.55)");
      vg.addColorStop(0.55, "rgba(10,10,10,0)");
      vg.addColorStop(1, "rgba(10,10,10,0.35)");
      c.fillStyle = vg;
      c.fillRect(0, 0, w, h);
      const hg = c.createLinearGradient(0, 0, w, 0);
      hg.addColorStop(0, "rgba(10,10,10,0.6)");
      hg.addColorStop(0.2, "rgba(10,10,10,0)");
      hg.addColorStop(0.8, "rgba(10,10,10,0)");
      hg.addColorStop(1, "rgba(10,10,10,0.6)");
      c.fillStyle = hg;
      c.fillRect(0, 0, w, h);
    };

    resize();

    if (manual) {
      window.__higgsDraw = draw;
      draw(0);
      return () => {
        delete window.__higgsDraw;
      };
    }

    if (reduced) {
      draw(3.2);
      return;
    }

    let raf = 0;
    let running = true;
    let visible = true;
    const start = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      if (visible && !document.hidden) draw(((now - start) / 1000) % LOOP_SECONDS);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const ro = size
      ? null
      : new ResizeObserver(() => {
          resize();
        });
    ro?.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io.disconnect();
    };
  }, [ref, size, maxDpr, density, still, manual]);

  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden="true" style={{ background: BG }} />;
}
