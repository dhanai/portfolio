"use client";

import { InvoiceForm } from "@/components/admin/invoice-form";
import { createInvoiceAction } from "@/lib/admin/invoice-actions";

export function InvoiceCreateForm({ className }: { className?: string }) {
  return (
    <InvoiceForm
      action={createInvoiceAction}
      submitLabel="Create invoice"
      pendingLabel="Creating…"
      successMessage="Invoice created"
      className={className}
    />
  );
}
