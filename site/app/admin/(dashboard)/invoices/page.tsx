import Link from "next/link";
import { AdminCreateDrawer } from "@/components/admin/admin-create-drawer";
import { InvoiceCreateForm } from "@/components/admin/invoice-create-form";
import { prisma } from "@/lib/prisma";
import { formatInvoiceDate, formatMoney } from "@/lib/invoices";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: create } = await searchParams;
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
  });

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
                    </p>
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
