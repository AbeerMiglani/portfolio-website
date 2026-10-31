import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { profile } from "@/content/profile";
import { themeColors } from "@/lib/theme";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  // A variable font: one file per subset covers every weight from 100 to 700.
  weight: "variable",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  // Static files, one per weight, and each is preloaded. Anything heavier
  // than 500 in Mono is drawn as faux bold, so add the weight here first.
  weight: ["400", "500"],
});

const title = `${profile.name} · Software Engineer`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description: profile.pitch,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description: profile.pitch,
    siteName: profile.name,
  },
  twitter: { card: "summary_large_image", title, description: profile.pitch },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
  ],
};

// Runs before first paint so the page never flashes the wrong theme. With no
// stored choice (or blocked storage) it follows the system setting. A stored
// choice also recolours the browser toolbar, once the theme-color tags exist.
const themeScript = `(() => {
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch {}
  const stored = saved === "light" || saved === "dark";
  const theme = stored ? saved : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  if (!stored) return;
  const colors = ${JSON.stringify(themeColors)};
  const tint = () => document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", colors[theme]));
  tint();
  document.addEventListener("DOMContentLoaded", tint);
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
