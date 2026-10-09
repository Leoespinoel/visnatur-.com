// Pull deterministic frames of the Higgs field from the dev export page via headless Chromium (CDP).
// Usage: node scripts/render-higgs-frames.mjs <outDir> <landscape|portrait|square> [fps=60] [devUrl=http://localhost:3000]
// Then encode with ffmpeg (any build with libx264, e.g. `npx ffmpeg-static` or Homebrew):
//   ffmpeg -framerate 60 -i <outDir>/f%05d.png -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -movflags +faststart out.mp4
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
const [, , outDir, format = "landscape", fpsArg = "60", base = "http://localhost:3000"] = process.argv;
const LOOP_SECONDS = 20;
const fps = +fpsArg;
const frames = LOOP_SECONDS * fps;
const bin = process.env.CHROME ?? process.env.HOME + "/Library/Caches/ms-playwright/chromium_headless_shell-1194/chrome-mac/headless_shell";
const port = 9600 + Math.floor(Math.random() * 100);
const chrome = spawn(bin, ["--headless", "--disable-gpu", `--remote-debugging-port=${port}`, "--window-size=1400,1000", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(outDir, { recursive: true });
try {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(100); } }
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable");
  await send("Page.navigate", { url: `${base}/dev/higgs?manual=1&format=${format}` });
  for (let i = 0; i < 100; i++) {
    const r = await send("Runtime.evaluate", { expression: "typeof window.__higgsDraw", returnByValue: true });
    if (r.result?.result?.value === "function") break;
    await sleep(250);
  }
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    const t = f / fps;
    const r = await send("Runtime.evaluate", {
      expression: `(() => { window.__higgsDraw(${t}); return document.querySelector("canvas").toDataURL("image/png").slice(22); })()`,
      returnByValue: true,
    });
    const b64 = r.result?.result?.value;
    if (!b64) { console.error("frame failed", f, JSON.stringify(r).slice(0, 300)); process.exit(1); }
    writeFileSync(`${outDir}/f${String(f).padStart(5, "0")}.png`, Buffer.from(b64, "base64"));
    if (f % 100 === 0) console.log(`frame ${f}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  console.log(`done: ${frames} frames in ${outDir}`);
} finally { chrome.kill(); }
