import { chromium } from "playwright";
const [dir, secs = "4.3"] = process.argv.slice(2);
const FPS = 30, N = Math.round(Number(secs) * FPS);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await p.goto(`file://${dir}/card.html`);
await p.evaluate(() => window.ready);
for (let f = 0; f < N; f++) {
  await p.evaluate((ms) => window.render(ms), (f * 1000) / FPS);
  await p.screenshot({ path: `${dir}/frames/f${String(f).padStart(4, "0")}.png` });
}
await b.close();
console.log("frames", N);
