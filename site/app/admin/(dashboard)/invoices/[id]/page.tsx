import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmit } from "@/components/admin/admin-submit";
import {
  deleteInvoiceAction,
  markInvoicePaidAction,
} from "@/lib/admin/invoice-actions";
import {
  formatInvoiceDate,
  formatMoney,
  invoicePublicPath,
} from "@/lib/invoices";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { CopyInvoiceLink } from "@/components/admin/copy-invoice-link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export default async function AdminInvoiceDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { created } = await searchParams;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) notFound();

  const path = invoicePublicPath(invoice.token);
  const absoluteUrl = `${siteConfig.url}${path}`;

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

      {created ? (
        <div className="mb-6 border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Invoice created. Copy the link below and send it to your client.
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium">{invoice.clientName}</h1>
          <p className="mt-1 font-mono text-sm text-[#a3a3a3]">
            {invoice.number}
          </p>
          <p className="mt-2 text-sm text-[#737373]">
            {formatInvoiceDate(invoice.createdAt)} ·{" "}
            <span
              className={
                invoice.status === "paid" ? "text-emerald-400" : "text-[#a3a3a3]"
              }
            >
              {invoice.status}
            </span>
          </p>
        </div>
        <p className="font-mono text-3xl text-white">
          {formatMoney(invoice.amount)}
        </p>
      </div>

      <section className="mt-8 space-y-3 border border-white/10 p-6">
        <h2 className="text-xs uppercase tracking-wider text-[#737373]">
          Client link
        </h2>
        <CopyInvoiceLink url={absoluteUrl} path={path} />
        <p className="text-xs text-[#525252]">
          Desktop and mobile responsive. Anyone with the link can view the
          invoice — no login required.
        </p>
      </section>

      <section className="mt-6 grid gap-4 border border-white/10 p-6 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373]">
            Client
          </p>
          <p className="mt-1 text-white">{invoice.clientName}</p>
          <p className="text-[#a3a3a3]">{invoice.clientEmail}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373]">
            Billing
          </p>
          <p className="mt-1 text-white">
            {invoice.rateType === "hourly"
              ? `${formatMoney(invoice.rate)}/hr × ${invoice.hours} hrs`
              : `Fixed ${formatMoney(invoice.rate)}`}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs uppercase tracking-wider text-[#737373]">
            Description
          </p>
          <p className="mt-1 whitespace-pre-wrap text-[#d4d4d4]">
            {invoice.description}
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        {invoice.status !== "paid" ? (
          <AdminForm
            action={markInvoicePaidAction}
            successMessage="Marked paid"
            alwaysEnableSubmit
          >
            <input type="hidden" name="id" value={invoice.id} />
            <AdminSubmit label="Mark paid" pendingLabel="Updating…" />
          </AdminForm>
        ) : null}
        <AdminForm
          action={deleteInvoiceAction}
          successMessage="Deleted"
          alwaysEnableSubmit
        >
          <input type="hidden" name="id" value={invoice.id} />
          <button
            type="submit"
            className="border border-white/20 px-5 py-2.5 text-sm text-[#a3a3a3] hover:border-[#ff453a] hover:text-[#ff453a]"
          >
            Delete
          </button>
        </AdminForm>
      </div>
    </div>
  );
}
