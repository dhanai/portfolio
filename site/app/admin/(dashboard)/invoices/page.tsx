import Link from "next/link";
import { AdminCreateDrawer } from "@/components/admin/admin-create-drawer";
import { InvoiceCreateForm } from "@/components/admin/invoice-create-form";
import { prisma } from "@/lib/prisma";
import {
  formatInvoiceDate,
  formatMoney,
  getInvoiceLineItems,
} from "@/lib/invoices";

export const dynamic = "force-dynamic";

function FirstLinePreview({
  invoice,
}: {
  invoice: Parameters<typeof getInvoiceLineItems>[0];
}) {
  const items = getInvoiceLineItems(invoice);
  const first = items[0];
  const description = first?.description.replace(/\s+/g, " ").trim();
  if (!description) return null;
  const extra = items.length - 1;

  return (
    <p className="mt-1 truncate text-xs text-[#a3a3a3]">
      {description}
      {extra > 0 ? <span className="text-[#525252]"> · +{extra}</span> : null}
    </p>
  );
}

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: create } = await searchParams;
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
  });
  const unpaid = invoices.filter((inv) => inv.status === "sent");
  const unpaidTotal = unpaid.reduce((sum, inv) => sum + inv.amount, 0);
  const drafts = invoices.filter((inv) => inv.status === "draft");
  const draftTotal = drafts.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium">Invoices</h1>
          <p className="mt-2 text-sm text-[#737373]">
            Create invoices behind admin, then share the unique client link.
          </p>
        </div>
        <AdminCreateDrawer
          title="New invoice"
          description="Totals calculate automatically. After you create it, you get a unique link to send the client."
          triggerLabel="+ New invoice"
          queryOpen={create === "1"}
        >
          <InvoiceCreateForm className="space-y-8" />
        </AdminCreateDrawer>
      </div>

      {invoices.length > 0 ? (
        <div className="mt-8 border border-white/10 p-5">
          <p className="text-xs uppercase tracking-wider text-[#737373]">
            Unpaid
          </p>
          <p className="mt-2 font-mono text-3xl font-medium">
            {formatMoney(unpaidTotal)}
          </p>
          <p className="mt-1 text-xs text-[#737373]">
            {unpaid.length} {unpaid.length === 1 ? "invoice" : "invoices"} sent
            and awaiting payment
            {drafts.length > 0
              ? ` · ${formatMoney(draftTotal)} in ${drafts.length} ${drafts.length === 1 ? "draft" : "drafts"}`
              : ""}
          </p>
        </div>
      ) : null}

      <div className="mt-8 overflow-hidden border border-white/10">
        {invoices.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#737373]">
            No invoices yet.{" "}
            <Link href="/admin/invoices?new=1" className="text-white underline">
              Create one
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {invoices.map((inv) => (
              <li key={inv.id}>
                <Link
                  href={`/admin/invoices/${inv.id}`}
                  className="flex flex-col gap-2 px-4 py-4 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">
                      {inv.clientName}{" "}
                      <span className="text-[#525252]">·</span>{" "}
                      <span className="font-mono text-[#a3a3a3]">
                        {inv.number}
                      </span>
                      {inv.jobNumber ? (
                        <>
                          {" "}
                          <span className="text-[#525252]">·</span>{" "}
                          <span className="text-[#a3a3a3]">{inv.jobNumber}</span>
                        </>
                      ) : null}
                    </p>
                    <FirstLinePreview invoice={inv} />
                    <p className="mt-1 truncate text-xs text-[#737373]">
                      {inv.clientEmail} · {formatInvoiceDate(inv.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:shrink-0">
                    <span
                      className={`text-[10px] uppercase tracking-wider ${
                        inv.status === "paid"
                          ? "text-emerald-400"
                          : "text-[#a3a3a3]"
                      }`}
                    >
                      {inv.status}
                    </span>
                    <span className="font-mono text-sm text-white">
                      {formatMoney(inv.amount)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
