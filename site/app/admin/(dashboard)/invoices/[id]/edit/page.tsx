import Link from "next/link";
import { notFound } from "next/navigation";
import { InvoiceForm } from "@/components/admin/invoice-form";
import { updateInvoiceAction } from "@/lib/admin/invoice-actions";
import { getInvoiceLineItems } from "@/lib/invoices";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditInvoicePage({ params }: PageProps) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) notFound();

  return (
    <div>
      <div className="mb-2">
        <Link
          href={`/admin/invoices/${invoice.id}`}
          className="text-xs uppercase tracking-wider text-[#737373] hover:text-white"
        >
          ← {invoice.number}
        </Link>
      </div>
      <h1 className="text-2xl font-medium">Edit invoice</h1>
      <p className="mt-2 text-sm text-[#737373]">
        Changes update the same client link — no new URL. Drag line items to
        reorder.
      </p>
      <InvoiceForm
        action={updateInvoiceAction}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        successMessage="Invoice saved"
        initial={{
          id: invoice.id,
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          notes: invoice.notes ?? "",
          lineItems: getInvoiceLineItems(invoice),
        }}
      />
    </div>
  );
}
