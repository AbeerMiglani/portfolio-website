// pdflatex helpers shared by the résumé and cover letter scripts.
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// The phone number goes first in the contact line, before the email link. The
// résumé and the cover letter share this header.
const CONTACT_START = "\\small \\href{mailto:";
const escapeTex = (text) => text.replace(/[\\#$%&_{}~^]/g, (c) => (c === "\\" ? "\\textbackslash{}" : `\\${c}`));

export function withPhone(tex, phone, file) {
  if (!tex.includes(CONTACT_START)) throw new Error(`Couldn't find "${CONTACT_START}" in ${file} to add the phone number.`);
  return tex.replace(CONTACT_START, `\\small ${escapeTex(phone)} \\quad \\href{mailto:`);
}

// Writes `files` (name -> source) to a temporary folder, compiles `main` there and
// copies its PDF to `out`, so no LaTeX build files end up in the repo. Returns the
// page count.
export async function build(files, main, out) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "latex-"));
  try {
    for (const [name, source] of Object.entries(files)) await writeFile(path.join(dir, name), source);
    let log = "";
    // Twice, so hyperref's bookmark file settles.
    for (let run = 0; run < 2; run++) {
      try {
        log = execFileSync("pdflatex", ["-interaction=nonstopmode", "-halt-on-error", main], {
          cwd: dir,
          encoding: "utf8",
        });
      } catch (error) {
        if (error.code === "ENOENT") throw new Error("pdflatex not found. Install TeX Live (Linux) or MacTeX (macOS).");
        console.error(String(error.stdout ?? "").split("\n").slice(-25).join("\n"));
        throw new Error(`pdflatex failed on ${main}; see the log above.`);
      }
    }
    await mkdir(path.dirname(out), { recursive: true });
    await copyFile(path.join(dir, main.replace(/\.tex$/, ".pdf")), out);
    return Number(log.match(/Output written on .*?\((\d+) pages?/s)?.[1] ?? 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
