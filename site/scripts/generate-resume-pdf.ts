/**
 * Legacy: generates a PDF from React PDF + CMS resume JSON.
 * The live site uses a hand-designed PDF at public/assets/resume/.
 * Pass --generate to overwrite that file (not recommended).
 */
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { generateResumePdf } from "../lib/generate-resume-pdf";
import { RESUME_PDF_FILENAME } from "../lib/resume-data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public/assets/resume");
const outFile = join(outDir, RESUME_PDF_FILENAME);

async function main() {
  if (!process.argv.includes("--generate")) {
    console.log(
      `Skipping PDF generation. The downloadable resume is the static file at public/assets/resume/${RESUME_PDF_FILENAME}.`,
    );
    console.log("To regenerate from code (overwrites that file), run: npm run resume:pdf -- --generate");
    return;
  }

  const buffer = await generateResumePdf();
  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, buffer);
  console.log(`Wrote ${outFile} (${buffer.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
