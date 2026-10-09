import { ImageResponse } from "next/og";
import { loadBrandFont } from "@/lib/brand-font";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await loadBrandFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#c8102e",
          fontSize: 140,
          fontFamily: "Cormorant",
          paddingBottom: 14,
        }}
      >
        Æ
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: font, weight: 500, style: "normal" }] },
  );
}
