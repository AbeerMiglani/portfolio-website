import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, backend engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card in the site's API-docs style. next/og cannot read woff2,
// so the IBM Plex TTFs in src/fonts/ are used here.
export default async function Image() {
  const fonts = join(process.cwd(), "src/fonts");
  const [sans, mono] = await Promise.all([
    readFile(join(fonts, "IBMPlexSans-Bold.ttf")),
    readFile(join(fonts, "IBMPlexMono-Medium.ttf")),
  ]);

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
          background: "#f8f7f5",
          color: "#191714",
          fontFamily: "Plex Sans",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontFamily: "Plex Mono", fontSize: 28 }}>
          <span>{profile.handle}</span>
          <span style={{ color: "#5f5a53", margin: "0 10px" }}>/</span>
          <span style={{ color: "#0a6f8b" }}>api</span>
          <span
            style={{
              marginLeft: 16,
              fontSize: 18,
              color: "#5f5a53",
              border: "2px solid #e3dfd9",
              borderRadius: 6,
              padding: "2px 10px",
            }}
          >
            v2
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Plex Mono", fontSize: 30, color: "#5f5a53" }}>
            <span
              style={{
                color: "#15803d",
                background: "#e3f1e8",
                borderRadius: 6,
                padding: "4px 14px",
                marginRight: 18,
                fontSize: 26,
              }}
            >
              GET
            </span>
            <span style={{ color: "#191714" }}>/</span>
            <span style={{ marginLeft: 18, color: "#15803d" }}>200</span>
            <span style={{ marginLeft: 10 }}>OK</span>
          </div>
          <div style={{ fontSize: 96, letterSpacing: -2, marginTop: 16 }}>{profile.name}</div>
          <div style={{ fontSize: 40, color: "#3f3b35", marginTop: 8 }}>{profile.tagline}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Plex Mono",
            fontSize: 24,
            color: "#5f5a53",
            borderTop: "2px solid #e3dfd9",
            paddingTop: 24,
          }}
        >
          <span>
            {profile.status} · learning {profile.learning.join(", ")}
          </span>
          <span>{profile.siteUrl.replace("https://", "")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Plex Sans", data: sans, style: "normal", weight: 700 },
        { name: "Plex Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
