// Compiles resume/resume.tex to PDF with pdflatex (TeX Live, or MacTeX on macOS).
//
//   npm run resume
//     -> public/resume.pdf (web copy, no phone number)
//   RESUME_PHONE="+91 …" npm run resume
//     -> also resume/out/Abeer_Miglani_Resume.pdf (full copy for applications;
//        resume/out/ is gitignored so the phone number never gets committed)
//
// Each copy is built in a temporary folder, so no LaTeX build files end up in the repo.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, withPhone } from "./latex.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "resume", "resume.tex");
const webPdf = path.join(root, "public", "resume.pdf");
const fullPdf = path.join(root, "resume", "out", "Abeer_Miglani_Resume.pdf");

const tex = await readFile(source, "utf8");
const outputs = [{ file: webPdf, tex }];

const phone = process.env.RESUME_PHONE?.trim();
if (phone) outputs.push({ file: fullPdf, tex: withPhone(tex, phone, "resume.tex") });

for (const { file, tex: body } of outputs) {
  const pages = await build({ "resume.tex": body }, "resume.tex", file);
  console.log(`${path.relative(root, file)}: ${pages} page${pages === 1 ? "" : "s"}`);
  if (pages !== 1) process.exitCode = 1;
}
if (process.exitCode) console.error("The résumé no longer fits on one page; tighten resume/resume.tex.");
