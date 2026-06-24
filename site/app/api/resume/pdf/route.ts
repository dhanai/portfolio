import { readFile } from "fs/promises";
import path from "path";
import { RESUME_PDF_FILENAME } from "@/lib/resume-data";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public/assets/resume",
    RESUME_PDF_FILENAME,
  );

  try {
    const buffer = await readFile(filePath);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${RESUME_PDF_FILENAME}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Resume PDF not found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export const dynamic = "force-static";
