"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { grounds, stages } from "@/data/ground";
import { GroundHud } from "./GroundHud";
import { GroundStage } from "./GroundStage";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * The descent (Leo, 2026-10-21, after junkbranding.com): a stage stuck under the header for the whole scene, the panels
 * (GroundPanel) pulled up over it and scrolling past with the page's own scroll. On every scroll frame the scene reads
 * where the panels stand against a reading line a little way down the screen: the panel at the line is the one in view,
 * its stage's picture shows, and the altitude on the HUD slides from its height to the next panel's as the line crosses
 * the gap between them. `--descent` (0 at the summit, 1 at the bottom) goes on the stage for the wash; `--px` / `--py` on
 * the root follow the pointer for the copy's parallax (`.ground-depth`). The HUD shows while the scene is on screen and
 * fades over whatever follows it. While mounted, `data-ground-snap` on <html> lets the page snap near each panel.
 */
export function GroundScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [altitude, setAltitude] = useState(stages[0].altitude);
  // How far down the scenes the reading line is, 0 at the summit, 1 at the bottom: where the HUD's marker rides.
  const [progress, setProgress] = useState(0);
  const [rays, setRays] = useState(false);
  const [hud, setHud] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    document.documentElement.setAttribute("data-ground-snap", "");
    const header = document.querySelector("header");
    const measure = () => header && document.documentElement.style.setProperty("--hdr", `${header.offsetHeight}px`);
    measure();
    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-ground-panel]"));
    const top = stages[0].altitude;
    const floor = stages[stages.length - 1].altitude;

    let raf = 0;
    const update = () => {
      raf = 0;
      const hdr = header?.offsetHeight ?? 0;
      const vh = window.innerHeight;
      // The reading line: a little way down the part of the screen under the header.
      const line = hdr + (vh - hdr) * 0.45;
      const tops = panels.map((p) => p.getBoundingClientRect().top);
      let i = 0;
      for (let k = 0; k < tops.length; k++) if (tops[k] <= line) i = k;
      // The panel's own altitude while the next one is still below the screen; then, as the next one's top rises from
      // the foot of the screen to the reading line, the readout slides to its altitude.
      const a = Number(panels[i].dataset.altitude);
      const s = Number(panels[i].dataset.stage);
      let alt = a;
      let scene = s;
      if (i < panels.length - 1) {
        const t = clamp((vh - tops[i + 1]) / (vh - line));
        alt = a + (Number(panels[i + 1].dataset.altitude) - a) * t;
        scene = s + (Number(panels[i + 1].dataset.stage) - s) * t;
      }
      const d = clamp((top - alt) / (top - floor));
      // The sea's surface slides between the scenes' stops as the reading line crosses from one to the next.
      const lo = Math.min(Math.floor(scene), stages.length - 1);
      const hi = Math.min(lo + 1, stages.length - 1);
      const sea = stages[lo].sea + (stages[hi].sea - stages[lo].sea) * (scene - lo);
      stage.current?.style.setProperty("--descent", d.toFixed(3));
      stage.current?.style.setProperty("--sea", `${sea.toFixed(2)}%`);
      setActive(s);
      setAltitude(Math.round(alt));
      setProgress(clamp(scene / (stages.length - 1)));
      // Light comes down through the water while the surface stands in the top third of the screen or just above it.
      setRays(sea < 36 && sea > -40);
      const r = el.getBoundingClientRect();
      setHud(r.top < vh && r.bottom > hdr + (vh - hdr) * 0.55);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.removeAttribute("data-ground-snap");
    };
  }, []);

  // The pointer's place across the scene, −1…1 each way, for the copy's parallax; still under reduced motion.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      el.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      el.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  // Which ground the HUD lights: none on the summit, all three passed at the bottom.
  const ground = active - 1;

  return (
    <div ref={root} className="ground-scene theme-dark relative">
      <div ref={stage} className="ground-stage">
        <GroundStage stages={stages} active={active} progress={progress} rays={rays} />
      </div>
      <div className="ground-panels relative z-10">{children}</div>
      <GroundHud grounds={grounds} active={ground} progress={progress} altitude={altitude} shown={hud} />
    </div>
  );
}
