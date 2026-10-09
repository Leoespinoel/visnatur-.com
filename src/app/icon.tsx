import { ImageResponse } from "next/og";
import { loadBrandFont } from "@/lib/brand-font";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
          fontSize: 50,
          fontFamily: "Cormorant",
          paddingBottom: 6,
        }}
      >
        Æ
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: font, weight: 500, style: "normal" }] },
  );
}
