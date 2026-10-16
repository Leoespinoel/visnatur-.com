import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./street.css";
import { V2Ticker } from "@/components/v2/Ticker";
import { V2Header } from "@/components/v2/Header";
import { V2Footer } from "@/components/v2/Footer";
import { V2CartDrawer } from "@/components/v2/CartDrawer";
import { V2BodyTone } from "@/components/v2/BodyTone";

/* Archivo with its width axis: condensed black for headlines, expanded for stickers and buttons. */
const archivo = Archivo({
  variable: "--font-v2",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-v2-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vis Naturæ — Made when you order it",
    template: "%s · Vis Naturæ",
  },
  // A preview of the next version of the site: kept out of search until it replaces the classic one.
  robots: { index: false, follow: false },
};

/**
 * /v2: the streetwear version of the site (raw and graphic). The root layout hides the classic header, footer,
 * intro, music and bag on these pages (components/SiteChrome.tsx); the cart itself is shared.
 */
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v2 ${archivo.variable} ${mono.variable} flex min-h-svh flex-col`}>
      <V2Ticker />
      <V2Header />
      <div className="flex-1">{children}</div>
      <V2Footer />
      <V2CartDrawer />
      <V2BodyTone />
    </div>
  );
}
