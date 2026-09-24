import Link from "next/link";
import { InvoiceCreateForm } from "@/components/admin/invoice-create-form";

export default function AdminNewInvoicePage() {
  return (
    <div>
      <div className="mb-2">
        <Link
          href="/admin/invoices"
          className="text-xs uppercase tracking-wider text-[#737373] hover:text-white"
        >
          ← Invoices
        </Link>
      </div>
      <h1 className="text-2xl font-medium">New invoice</h1>
      <p className="mt-2 text-sm text-[#737373]">
        Fills calculate automatically. After create you get a unique link to
        send the client.
      </p>
      <InvoiceCreateForm />
    </div>
  );
}
