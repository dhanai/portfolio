"use client";

import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmit } from "@/components/admin/admin-submit";
import {
  AdminCheckbox,
  AdminField,
  AdminTextarea,
} from "@/components/admin/form";
import { InvoiceLineItemsEditor } from "@/components/admin/invoice-line-items-editor";
import type { ActionResult } from "@/lib/admin/types";
import type { InvoiceLineItem } from "@/lib/invoices";

export type InvoiceFormValues = {
  id?: string;
  clientName: string;
  clientEmail: string;
  notes: string;
  includeW9?: boolean;
  lineItems?: InvoiceLineItem[];
};

export function InvoiceForm({
  action,
  initial,
  submitLabel,
  pendingLabel,
  successMessage,
}: {
  action: (formData: FormData) => Promise<ActionResult | void>;
  initial?: Partial<InvoiceFormValues>;
  submitLabel: string;
  pendingLabel: string;
  successMessage: string;
}) {
  return (
    <AdminForm
      action={action}
      successMessage={successMessage}
      alwaysEnableSubmit
      className="mt-8 space-y-8"
    >
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <section className="grid gap-6 border border-white/10 p-6 sm:grid-cols-2">
        <AdminField
          label="Client name"
          name="clientName"
          required
          defaultValue={initial?.clientName ?? ""}
        />
        <AdminField
          label="Client email"
          name="clientEmail"
          type="email"
          required
          defaultValue={initial?.clientEmail ?? ""}
        />
      </section>

      <InvoiceLineItemsEditor initialItems={initial?.lineItems} />

      <section className="space-y-4 border border-white/10 p-6">
        <AdminTextarea
          label="Notes (optional)"
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ""}
          hint="Shown on the invoice under payment options."
        />
        <AdminCheckbox
          label="Include W-9 download link for the client"
          name="includeW9"
          defaultChecked={initial?.includeW9 ?? false}
        />
        <p className="text-xs text-[#525252]">
          When checked, the invoice page shows a download for{" "}
          <code className="text-[#a3a3a3]">undeniable-w9-signed.pdf</code>.
        </p>
      </section>

      <div className="flex justify-end">
        <AdminSubmit label={submitLabel} pendingLabel={pendingLabel} />
      </div>
    </AdminForm>
  );
}
