"use client";

import { InvoiceForm } from "@/components/admin/invoice-form";
import { createInvoiceAction } from "@/lib/admin/invoice-actions";

export function InvoiceCreateForm() {
  return (
    <InvoiceForm
      action={createInvoiceAction}
      submitLabel="Create invoice"
      pendingLabel="Creating…"
      successMessage="Invoice created"
    />
  );
}
