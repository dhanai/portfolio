import { saveCreativeShowcaseFromForm } from "@/lib/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import {
  AdminCheckbox,
  AdminField,
  AdminSection,
  AdminSubmit,
  AdminTextarea,
} from "@/components/admin/form";
import { CreativeShowcaseEditor } from "@/components/admin/creative-showcase-editor";
import type { CreativeShowcaseData } from "@/lib/defaults/creative-showcase";

export function CreativeShowcaseForm({
  showcase,
}: {
  showcase: CreativeShowcaseData;
}) {
  async function action(formData: FormData) {
    "use server";
    return saveCreativeShowcaseFromForm(formData);
  }

  return (
    <AdminForm
      action={action}
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
        <CreativeShowcaseEditor initialItems={showcase.items} />
      </AdminSection>

      <AdminSubmit />
    </AdminForm>
  );
}
