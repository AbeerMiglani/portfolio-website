// Renders resume/resume.html to PDF with headless Chromium.
//
//   npm run resume
//     -> public/resume.pdf (web copy, no phone number)
//   RESUME_PHONE="+91 …" npm run resume
//     -> also resume/out/Abeer_Miglani_Resume.pdf (full copy for applications;
//        resume/out/ is gitignored so the phone number never gets committed)
//
// Uses the locally installed Google Chrome, or the browser at CHROMIUM_PATH.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "resume", "resume.html");
const webPdf = path.join(root, "public", "resume.pdf");
const fullPdf = path.join(root, "resume", "out", "Abeer_Miglani_Resume.pdf");
const pdfOptions = { format: "A4", printBackground: true, preferCSSPageSize: true };

// Counts page objects in the generated PDF; the résumé should stay on one page.
const pageCount = (pdf) => (pdf.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) ?? []).length;

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : { channel: "chrome" },
);

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(source).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const outputs = [{ file: webPdf, pdf: await page.pdf({ ...pdfOptions, path: webPdf }) }];

  const phone = process.env.RESUME_PHONE?.trim();
  if (phone) {
    await page.evaluate((value) => {
      const span = document.createElement("span");
      span.textContent = value;
      document.querySelector("[data-contact-primary]").prepend(span);
    }, phone);
    await mkdir(path.dirname(fullPdf), { recursive: true });
    outputs.push({ file: fullPdf, pdf: await page.pdf({ ...pdfOptions, path: fullPdf }) });
  }

  for (const { file, pdf } of outputs) {
    const pages = pageCount(pdf);
    console.log(`${path.relative(root, file)}: ${pages} page${pages === 1 ? "" : "s"}`);
    if (pages !== 1) process.exitCode = 1;
  }
  if (process.exitCode) console.error("The résumé no longer fits on one page; tighten resume/resume.html.");
} finally {
  await browser.close();
}
