import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, software engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card in the same terminal style as the site.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "#8b949e" }}>
          <span style={{ color: "#3fb950", marginRight: 16 }}>$</span>whoami
        </div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, marginTop: 16 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 36, color: "#8b949e", marginTop: 32 }}>
          {profile.pitch}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#3fb950", marginTop: 48 }}>
          {profile.siteUrl.replace("https://", "")}
        </div>
      </div>
    ),
    size,
  );
}
