"use client";

import { useRef } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import {
  AdminCheckbox,
  AdminField,
  AdminSection,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/form";
import {
  CreativeShowcaseEditor,
  type CreativeShowcaseEditorHandle,
} from "@/components/admin/creative-showcase-editor";
import type { ActionResult } from "@/lib/admin/types";
import type { CreativeShowcaseData } from "@/lib/defaults/creative-showcase";

export function CreativeShowcaseForm({
  showcase,
  saveAction,
}: {
  showcase: CreativeShowcaseData;
  saveAction: (formData: FormData) => Promise<ActionResult>;
}) {
  const editorRef = useRef<CreativeShowcaseEditorHandle>(null);

  async function prepareSubmit(form: HTMLFormElement) {
    await editorRef.current?.uploadPendingVideos(form);
  }

  return (
    <AdminForm
      action={saveAction}
      prepareSubmit={prepareSubmit}
      successMessage="Creative showcase saved"
      className="mt-8 space-y-6"
    >
      <AdminSection title="Section">
        <AdminCheckbox
          label="Show on homepage"
          name="enabled"
          defaultChecked={showcase.enabled}
        />
        <AdminField
          label="Section title"
          name="title"
          defaultValue={showcase.title}
          required
        />
        <AdminTextarea
          label="Section subtitle"
          name="subtitle"
          defaultValue={showcase.subtitle}
          rows={2}
          hint="One line under the section heading on the homepage."
        />
      </AdminSection>

      <AdminSection title="Pieces (9×16)">
        <CreativeShowcaseEditor
          ref={editorRef}
          initialItems={showcase.items}
        />
      </AdminSection>

      <AdminSubmit />
    </AdminForm>
  );
}
