import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { loadBrandFont } from "@/lib/brand-font";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await loadBrandFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#ffffff",
          color: "#0a0a0a",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 34, letterSpacing: 10, textTransform: "uppercase" }}>
          <span>Vis Natur</span>
          <span style={{ color: "#c8102e", fontSize: 44, letterSpacing: 0, marginLeft: -12 }}>Æ</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, lineHeight: 1.0 }}>Made once you order it.</div>
          <div style={{ fontSize: 34, marginTop: 28, color: "#c8102e" }}>
            Made-to-order menswear · 10% of every sale to conservation
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: font, weight: 500, style: "normal" }] },
  );
}
