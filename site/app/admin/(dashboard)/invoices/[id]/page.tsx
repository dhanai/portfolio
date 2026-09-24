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
  getInvoiceLineItems,
  invoicePublicPath,
} from "@/lib/invoices";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { CopyInvoiceLink } from "@/components/admin/copy-invoice-link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string }>;
};

export default async function AdminInvoiceDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { created, saved } = await searchParams;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) notFound();

  const path = invoicePublicPath(invoice.token);
  const absoluteUrl = `${siteConfig.url}${path}`;
  const lineItems = getInvoiceLineItems(invoice);

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
      {saved ? (
        <div className="mb-6 border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Invoice saved. The client link shows the updated details.
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

      <section className="mt-6 border border-white/10 p-6 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#737373]">
              Client
            </p>
            <p className="mt-1 text-white">{invoice.clientName}</p>
            <p className="text-[#a3a3a3]">{invoice.clientEmail}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-[#737373]">
              Lines
            </p>
            <p className="mt-1 text-white">
              {lineItems.length} item{lineItems.length === 1 ? "" : "s"}
              {invoice.includeW9 ? " · W-9 included" : ""}
            </p>
          </div>
        </div>
        <ul className="mt-6 divide-y divide-white/10 border border-white/10">
          {lineItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <p className="min-w-0 whitespace-pre-wrap text-[#d4d4d4]">
                {item.description}
              </p>
              <p className="shrink-0 font-mono text-[#a3a3a3] sm:text-right">
                {item.rateType === "hourly"
                  ? `${formatMoney(item.rate)}/hr × ${item.hours}`
                  : formatMoney(item.rate)}{" "}
                <span className="text-white">{formatMoney(item.amount)}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/admin/invoices/${invoice.id}/edit`}
          className="inline-flex items-center justify-center bg-white px-5 py-2.5 text-sm font-medium text-black hover:opacity-90"
        >
          Edit
        </Link>
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
