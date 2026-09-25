// The site as plain text, for `curl https://portfolio.abbykayo.com` (see the
// rewrite in next.config.ts) and the terminal's own `curl` command. Built from
// src/content, so it never drifts from the page. No phone number, ever.
import { earlier } from "@/content/earlier";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

const WIDTH = 78;

type Style = "bold" | "accent" | "dim";
const ansi: Record<Style, string> = { bold: "\x1b[1m", accent: "\x1b[38;5;208m", dim: "\x1b[2m" };
const RESET = "\x1b[0m";

function wrap(text: string, indent: string, width = WIDTH): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && indent.length + line.length + 1 + word.length > width) {
      lines.push(indent + line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(indent + line);
  return lines;
}

/** Plain-text résumé; `color` adds ANSI escapes for terminals. */
export function resumeText({ color }: { color: boolean }): string {
  const s = (style: Style, text: string) => (color ? `${ansi[style]}${text}${RESET}` : text);
  const heading = (title: string) => ["", s("accent", `## ${title}`), ""];
  const host = profile.siteUrl.replace("https://", "");
  const featuredFirst = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  const out: string[] = [
    "",
    s("bold", profile.name),
    profile.tagline,
    s("dim", `${profile.status} · ${profile.email}`),
    "",
    ...wrap(profile.pitch, ""),
    ...heading("Projects"),
  ];

  for (const project of featuredFirst) {
    const roadmap = project.roadmap;
    const done = roadmap?.filter((m) => m.done).length;
    out.push(`${s("bold", project.title)}  ${s("dim", `${project.dates} · ${project.meta}`)}`);
    if (roadmap) out.push(s("dim", `  roadmap ${done}/${roadmap.length} · next: ${roadmap.find((m) => !m.done)?.label ?? "–"}`));
    out.push(...wrap(project.hook, "  "));
    for (const bullet of project.bullets) out.push(...wrap(bullet, "    ").map((l, i) => (i ? l : `  - ${l.trimStart()}`)));
    if (project.repo) out.push(s("dim", `  ${project.repo.replace("https://", "")}`));
    out.push("");
  }

  out.push(s("accent", "## Earlier"), "");
  for (const item of earlier) {
    out.push(`${s("bold", item.what)} at ${item.org}  ${s("dim", item.when)}`, ...wrap(item.summary, "  "));
  }

  const { education } = profile;
  out.push(...heading("Education"), s("bold", education.school), `${education.degree} · ${education.dates}`);

  out.push(...heading("Skills"));
  for (const [group, items] of Object.entries(profile.skills)) {
    const extra = color ? ansi.dim.length + RESET.length : 0;
    out.push(...wrap(`${s("dim", `${group}:`)} ${items.join(", ")}`, "  ", WIDTH + extra).map((l, i) => (i ? l : l.trimStart())));
  }

  out.push(
    ...heading("Links"),
    ...profile.links.map((l) => `${l.label.padEnd(10)}${l.href}`),
    `${"Résumé".padEnd(10)}${profile.siteUrl}${profile.resume}`,
    "",
    s("dim", `The full site at ${host} has a terminal you can type into.`),
    "",
  );
  return out.join("\n");
}
