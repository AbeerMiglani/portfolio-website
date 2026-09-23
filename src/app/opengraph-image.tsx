import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, software engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card in the same fanout-inspired style as the site. Uses the
// .woff copy of the pixel font and a TTF of Hanken Grotesk because next/og
// cannot read woff2.
export default async function Image() {
  const fonts = join(process.cwd(), "src/fonts");
  const [pixel, sans] = await Promise.all([
    readFile(join(fonts, "DepartureMono-Regular.woff")),
    readFile(join(fonts, "HankenGrotesk-Bold.ttf")),
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
          background: "#f7f7f8",
          color: "#272727",
          fontFamily: "Hanken",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
          <span style={{ fontFamily: "Departure" }}>{profile.handle}</span>
          <span style={{ background: "#1d1d1d", color: "#fff", fontSize: 16, padding: "4px 10px", borderRadius: 6 }}>
            SWE
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>{profile.name}</div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>
            builds close to the&nbsp;<span style={{ fontFamily: "Departure", fontWeight: 400, letterSpacing: 0 }}>metal.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#6e6e6e" }}>
          <span style={{ fontFamily: "Departure" }}>C++ · Python · Systems</span>
          <span style={{ fontFamily: "Departure" }}>{profile.siteUrl.replace("https://", "")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Hanken", data: sans, style: "normal", weight: 700 },
        { name: "Departure", data: pixel, style: "normal", weight: 400 },
      ],
    },
  );
}
