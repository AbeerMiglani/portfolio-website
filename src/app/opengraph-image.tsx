import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, software engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card in the site's style. next/og cannot read woff2, so the
// IBM Plex TTFs in src/fonts/ are used here.
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
          background: "#faf9f6",
          color: "#1c1b19",
          fontFamily: "Plex Sans",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Plex Mono", fontSize: 28 }}>
          <span>{profile.handle}</span>
          <span style={{ color: "#6b6760" }}>@portfolio</span>
          <span style={{ color: "#c2410c" }}>:~$</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Plex Mono", fontSize: 30, color: "#6b6760" }}>
            <span style={{ color: "#c2410c", marginRight: 16 }}>$</span>whoami
          </div>
          <div style={{ fontSize: 96, letterSpacing: -2, marginTop: 12 }}>{profile.name}</div>
          <div style={{ fontSize: 40, color: "#3a3833", marginTop: 8 }}>{profile.tagline}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Plex Mono",
            fontSize: 24,
            color: "#6b6760",
            borderTop: "2px solid #e3dfd6",
            paddingTop: 24,
          }}
        >
          <span>redis-cpp · ripple</span>
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
