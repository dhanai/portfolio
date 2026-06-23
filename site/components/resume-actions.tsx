"use client";

import { RESUME_PDF_FILENAME } from "@/lib/resume-data";

const PDF_API = "/api/resume/pdf";

export function ResumeActions() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href={PDF_API}
        download={RESUME_PDF_FILENAME}
        className="inline-flex items-center gap-2 bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Download PDF
        <span className="text-accent">↓</span>
      </a>
    </div>
  );
}
