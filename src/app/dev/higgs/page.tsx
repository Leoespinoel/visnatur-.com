import { notFound } from "next/navigation";
import { HiggsRecorder, type FormatKey } from "@/components/HiggsRecorder";

export const metadata = { title: "Higgs field export", robots: { index: false } };

/**
 * Development only: export the Higgs field hero as a video file.
 * `?manual=1&format=portrait` is used by scripts/render-higgs-frames.mjs to pull
 * deterministic frames for an H.264 encode.
 */
export default async function HiggsExportPage({ searchParams }: { searchParams: Promise<{ manual?: string; format?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { manual, format } = await searchParams;
  const initialFormat: FormatKey = format === "portrait" || format === "square" ? format : "landscape";
  return <HiggsRecorder initialFormat={initialFormat} manual={manual === "1"} />;
}
