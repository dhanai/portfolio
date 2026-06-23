import { renderToBuffer } from "@react-pdf/renderer";
import { ResumePdfDocument } from "@/components/resume/resume-pdf-document";
import { getResumeContent } from "@/lib/content";

export async function generateResumePdf(): Promise<Buffer> {
  const data = await getResumeContent();
  return renderToBuffer(<ResumePdfDocument data={data} />);
}
