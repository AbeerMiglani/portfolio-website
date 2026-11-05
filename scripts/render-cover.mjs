// Compiles the cover letters to PDF with pdflatex, in the résumé's style.
//
//   npm run cover
//     -> resume/out/Abeer_Miglani_Cover_Letter.pdf (the template, with red [placeholders])
//     -> resume/out/Abeer_Miglani_Cover_Letter_<Name>.pdf for each resume/letters/<name>.tex
//   RESUME_PHONE="+91 …" npm run cover
//     -> the same, with the phone number in the header
//
// A tailored letter defines the template's four macros and then inputs it:
//
//   \newcommand{\Company}{…} \newcommand{\Role}{…}
//   \newcommand{\WhyCompany}{…} \newcommand{\Fit}{…}
//   \input{cover-letter}
//
// resume/letters/ and resume/out/ are gitignored: the repo is public, so which
// companies Abeer applies to (and the phone number) stay out of it.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, withPhone } from "./latex.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lettersDir = path.join(root, "resume", "letters");
const outDir = path.join(root, "resume", "out");
const macros = ["Company", "Role", "WhyCompany", "Fit"];

let template = await readFile(path.join(root, "resume", "cover-letter.tex"), "utf8");
const phone = process.env.RESUME_PHONE?.trim();
if (phone) template = withPhone(template, phone, "cover-letter.tex");

const jobs = [{ name: "the template", main: "cover-letter.tex", files: {}, out: "Abeer_Miglani_Cover_Letter.pdf" }];
const tailored = (await readdir(lettersDir).catch(() => [])).filter((file) => file.endsWith(".tex")).sort();
for (const file of tailored) {
  const source = await readFile(path.join(lettersDir, file), "utf8");
  const missing = macros.filter((macro) => !source.includes(`\\newcommand{\\${macro}}`));
  if (missing.length) {
    console.error(`resume/letters/${file} doesn't define ${missing.map((m) => `\\${m}`).join(", ")}, so the PDF would show a [placeholder].`);
    process.exitCode = 1;
    continue;
  }
  const label = path.basename(file, ".tex").split(/[-_]/).map((w) => w[0].toUpperCase() + w.slice(1)).join("_");
  jobs.push({ name: file, main: "letter.tex", files: { "letter.tex": source }, out: `Abeer_Miglani_Cover_Letter_${label}.pdf` });
}

for (const job of jobs) {
  const file = path.join(outDir, job.out);
  const pages = await build({ "cover-letter.tex": template, ...job.files }, job.main, file);
  console.log(`${path.relative(root, file)}: ${pages} page${pages === 1 ? "" : "s"}`);
  if (pages !== 1) {
    console.error(`${job.name} no longer fits on one page; shorten it.`);
    process.exitCode = 1;
  }
}
