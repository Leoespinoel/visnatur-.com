"use client";

import { useRef, useState } from "react";
import { HiggsField, LOOP_SECONDS } from "./HiggsField";

const FORMATS = {
  landscape: { width: 1920, height: 1080, label: "16:9 · 1920×1080 (web, YouTube)" },
  portrait: { width: 1080, height: 1920, label: "9:16 · 1080×1920 (Reels, Stories)" },
  square: { width: 1080, height: 1080, label: "1:1 · 1080×1080 (feed)" },
} as const;
export type FormatKey = keyof typeof FORMATS;

const MIME_CANDIDATES = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm"];

/**
 * Records exactly one loop of the Higgs field straight from the canvas with
 * MediaRecorder and downloads it. Chrome gives a .webm, Safari a .mp4. Both
 * loop seamlessly because the animation is periodic.
 */
export function HiggsRecorder({ initialFormat = "landscape", manual = false }: { initialFormat?: FormatKey; manual?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [format, setFormat] = useState<FormatKey>(initialFormat);
  const [mime, setMime] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "recording" | "done" | "unsupported">("idle");
  const [secondsLeft, setSecondsLeft] = useState(LOOP_SECONDS);
  const [download, setDownload] = useState<{ url: string; name: string; size: number } | null>(null);

  const record = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mime = typeof MediaRecorder === "undefined" ? null : (MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m)) ?? null);
    setMime(mime);
    if (!mime) {
      setState("unsupported");
      return;
    }
    if (download) URL.revokeObjectURL(download.url);
    setDownload(null);

    const stream = canvas.captureStream(60);
    const chunks: Blob[] = [];
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 12_000_000 });
    rec.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: mime });
      const ext = mime.startsWith("video/mp4") ? "mp4" : "webm";
      setDownload({ url: URL.createObjectURL(blob), name: `vis-naturae-higgs-field-${format}.${ext}`, size: blob.size });
      setState("done");
      stream.getTracks().forEach((t) => t.stop());
    };

    setState("recording");
    setSecondsLeft(LOOP_SECONDS);
    rec.start(250);
    const started = performance.now();
    const tick = window.setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil(LOOP_SECONDS - (performance.now() - started) / 1000)));
    }, 250);
    window.setTimeout(() => {
      window.clearInterval(tick);
      rec.stop();
    }, LOOP_SECONDS * 1000);
  };

  const size = FORMATS[format];
  // Scale the preview so a 1920px canvas fits on screen; the recording is still full size.
  const scale = Math.min(1, 960 / size.width, 640 / size.height);

  return (
    <div className="container-x py-10">
      <p className="eyebrow mb-3">Development</p>
      <h1 className="display text-4xl md:text-5xl">Higgs field export</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-2">
        Records one full loop ({LOOP_SECONDS}s) straight from the canvas, so the file joins seamlessly when played on repeat.
        Keep this tab in the foreground while it records.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {(Object.keys(FORMATS) as FormatKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFormat(k)}
            disabled={state === "recording"}
            className={`btn ${format === k ? "btn-primary" : "btn-outline"}`}
          >
            {FORMATS[k].label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="button" className="btn btn-primary" onClick={record} disabled={state === "recording"}>
          {state === "recording" ? `Recording… ${secondsLeft}s` : "Record one loop"}
        </button>
        {download && (
          <a href={download.url} download={download.name} className="btn btn-outline">
            Download {download.name} ({(download.size / 1_000_000).toFixed(1)} MB)
          </a>
        )}
        {state === "unsupported" && <span className="text-sm text-red">This browser cannot record canvas video. Use Chrome or Safari.</span>}
        {mime && <span className="eyebrow">{mime}</span>}
      </div>

      <div className="mt-8 overflow-hidden border border-line bg-charcoal" style={{ width: size.width * scale, height: size.height * scale }}>
        <div style={{ width: size.width, height: size.height, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <HiggsField key={format} size={{ width: size.width, height: size.height }} maxDpr={1} canvasRef={canvasRef} manual={manual} />
        </div>
      </div>
    </div>
  );
}
