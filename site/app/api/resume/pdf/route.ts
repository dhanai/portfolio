import { generateResumePdf } from "@/lib/generate-resume-pdf";
import { RESUME_PDF_FILENAME } from "@/lib/resume-data";

export async function GET() {
  const buffer = await generateResumePdf();

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${RESUME_PDF_FILENAME}"`,
      "Cache-Control": "no-store",
    },
  });
}
