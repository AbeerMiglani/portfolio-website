// Compiles resume/resume.tex to PDF with pdflatex (TeX Live, or MacTeX on macOS).
//
//   npm run resume
//     -> public/resume.pdf (web copy, no phone number)
//   RESUME_PHONE="+91 …" npm run resume
//     -> also resume/out/Abeer_Miglani_Resume.pdf (full copy for applications;
//        resume/out/ is gitignored so the phone number never gets committed)
//
// Each copy is built in a temporary folder, so no LaTeX build files end up in the repo.
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "resume", "resume.tex");
const webPdf = path.join(root, "public", "resume.pdf");
const fullPdf = path.join(root, "resume", "out", "Abeer_Miglani_Resume.pdf");

// The phone number goes first in the contact line, before the email link.
const CONTACT_START = "\\small \\href{mailto:";
const escapeTex = (text) => text.replace(/[\\#$%&_{}~^]/g, (c) => (c === "\\" ? "\\textbackslash{}" : `\\${c}`));

async function build(tex, out) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "resume-"));
  try {
    await writeFile(path.join(dir, "resume.tex"), tex);
    let log = "";
    // Twice, so hyperref's bookmark file settles.
    for (let run = 0; run < 2; run++) {
      try {
        log = execFileSync("pdflatex", ["-interaction=nonstopmode", "-halt-on-error", "resume.tex"], {
          cwd: dir,
          encoding: "utf8",
        });
      } catch (error) {
        if (error.code === "ENOENT") throw new Error("pdflatex not found. Install TeX Live (Linux) or MacTeX (macOS).");
        console.error(String(error.stdout ?? "").split("\n").slice(-25).join("\n"));
        throw new Error("pdflatex failed; see the log above.");
      }
    }
    await mkdir(path.dirname(out), { recursive: true });
    await copyFile(path.join(dir, "resume.pdf"), out);
    return Number(log.match(/Output written on .*?\((\d+) pages?/s)?.[1] ?? 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const tex = await readFile(source, "utf8");
const outputs = [{ file: webPdf, tex }];

const phone = process.env.RESUME_PHONE?.trim();
if (phone) {
  if (!tex.includes(CONTACT_START)) throw new Error(`Couldn't find "${CONTACT_START}" in resume.tex to add the phone number.`);
  outputs.push({ file: fullPdf, tex: tex.replace(CONTACT_START, `\\small ${escapeTex(phone)} \\quad \\href{mailto:`) });
}

for (const { file, tex: body } of outputs) {
  const pages = await build(body, file);
  console.log(`${path.relative(root, file)}: ${pages} page${pages === 1 ? "" : "s"}`);
  if (pages !== 1) process.exitCode = 1;
}
if (process.exitCode) console.error("The résumé no longer fits on one page; tighten resume/resume.tex.");
