import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatInvoiceDate, formatMoney } from "@/lib/invoices";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium">Invoices</h1>
          <p className="mt-2 text-sm text-[#737373]">
            Create invoices behind admin, then share the unique client link.
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center justify-center bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          + New invoice
        </Link>
      </div>

      <div className="mt-8 overflow-hidden border border-white/10">
        {invoices.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-[#737373]">
            No invoices yet.{" "}
            <Link href="/admin/invoices/new" className="text-white underline">
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
