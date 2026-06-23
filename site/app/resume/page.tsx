import type { Metadata } from "next";
import { ResumeActions } from "@/components/resume-actions";
import { ResumeWeb } from "@/components/resume/resume-web";

export const metadata: Metadata = {
  title: "Resume",
  description: "Dhanai Holtzclaw — Design Engineer resume.",
};

export default function ResumePage() {
  return (
    <>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label-caps text-muted">Resume</p>
            <p className="mt-1 text-sm text-muted">
              Full experience below · PDF export is a condensed one-pager
            </p>
          </div>
          <ResumeActions />
        </div>
      </div>
      <ResumeWeb />
    </>
  );
}
