/**
 * Pre-generates static resume PDF for deploy/CDN.
 * Usage: npm run resume:pdf
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
  const buffer = await generateResumePdf();
  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, buffer);
  console.log(`Wrote ${outFile} (${buffer.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
