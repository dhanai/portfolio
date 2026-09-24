import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  formatInvoiceDate,
  formatMoney,
  INVOICE_ISSUER,
  INVOICE_PAYMENT_OPTIONS,
} from "@/lib/invoices";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { token } });
  if (!invoice) return { title: "Invoice" };
  return {
    title: `Invoice ${invoice.number}`,
    description: `Invoice for ${invoice.clientName} — ${formatMoney(invoice.amount)}`,
    robots: { index: false, follow: false },
  };
}

export default async function PublicInvoicePage({ params }: PageProps) {
  const { token } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { token } });
  if (!invoice) notFound();

  const isHourly = invoice.rateType === "hourly";

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-[#111111]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-14">
        <article className="border border-[#e4e4e7] bg-white shadow-sm">
          <header className="flex flex-col gap-6 border-b border-[#e4e4e7] px-5 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-8 sm:py-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#71717a]">
                Invoice
              </p>
              <h1 className="mt-2 font-mono text-xl font-medium tracking-tight sm:text-2xl">
                {invoice.number}
              </h1>
              <p className="mt-2 text-sm text-[#52525b]">
                {formatInvoiceDate(invoice.createdAt)}
              </p>
            </div>
            <div className="sm:text-right">
              <p
                className={`inline-block text-[10px] font-medium uppercase tracking-[0.16em] ${
                  invoice.status === "paid"
                    ? "text-emerald-700"
                    : "text-[#71717a]"
                }`}
              >
                {invoice.status === "paid" ? "Paid" : "Amount due"}
              </p>
              <p className="mt-1 font-mono text-3xl font-medium tracking-tight sm:text-4xl">
                {formatMoney(invoice.amount)}
              </p>
            </div>
          </header>

          <section className="grid gap-8 border-b border-[#e4e4e7] px-5 py-6 sm:grid-cols-2 sm:px-8 sm:py-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
                From
              </p>
              <p className="mt-2 text-sm font-medium">{INVOICE_ISSUER.name}</p>
              {INVOICE_ISSUER.addressLines.map((line) => (
                <p key={line} className="text-sm text-[#52525b]">
                  {line}
                </p>
              ))}
              <p className="mt-1 text-sm text-[#52525b]">{INVOICE_ISSUER.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
                Bill to
              </p>
              <p className="mt-2 text-sm font-medium">{invoice.clientName}</p>
              <p className="text-sm text-[#52525b]">{invoice.clientEmail}</p>
            </div>
          </section>

          <section className="px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
              Services
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#27272a]">
              {invoice.description}
            </p>

            <div className="mt-8 overflow-hidden border border-[#e4e4e7]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fafafa] text-[10px] uppercase tracking-[0.14em] text-[#71717a]">
                  <tr>
                    <th className="px-3 py-2.5 font-medium sm:px-4">Item</th>
                    <th className="px-3 py-2.5 text-right font-medium sm:px-4">
                      {isHourly ? "Rate" : "Fee"}
                    </th>
                    {isHourly ? (
                      <th className="px-3 py-2.5 text-right font-medium sm:px-4">
                        Hours
                      </th>
                    ) : null}
                    <th className="px-3 py-2.5 text-right font-medium sm:px-4">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#e4e4e7]">
                    <td className="px-3 py-3 align-top sm:px-4">
                      {isHourly ? "Professional services" : "Project fee"}
                    </td>
                    <td className="px-3 py-3 text-right font-mono sm:px-4">
                      {formatMoney(invoice.rate)}
                      {isHourly ? "/hr" : ""}
                    </td>
                    {isHourly ? (
                      <td className="px-3 py-3 text-right font-mono sm:px-4">
                        {invoice.hours}
                      </td>
                    ) : null}
                    <td className="px-3 py-3 text-right font-mono sm:px-4">
                      {formatMoney(invoice.amount)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-[#e4e4e7] bg-[#fafafa]">
                    <td
                      colSpan={isHourly ? 3 : 2}
                      className="px-3 py-3 text-right text-[10px] font-medium uppercase tracking-[0.14em] text-[#71717a] sm:px-4"
                    >
                      Total due
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-base font-medium sm:px-4">
                      {formatMoney(invoice.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <section className="border-t border-[#e4e4e7] px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
              Payment options
            </p>
            <ul className="mt-4 space-y-3">
              {INVOICE_PAYMENT_OPTIONS.map((opt) => (
                <li
                  key={opt.label}
                  className="flex flex-col gap-0.5 border border-[#e4e4e7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#71717a]">
                    {opt.label}
                  </span>
                  <span className="font-mono text-sm text-[#18181b]">
                    {opt.value}
                  </span>
                </li>
              ))}
            </ul>
            {invoice.notes ? (
              <p className="mt-5 whitespace-pre-wrap text-sm text-[#52525b]">
                {invoice.notes}
              </p>
            ) : null}
          </section>

          <footer className="border-t border-[#e4e4e7] px-5 py-4 text-center text-[11px] text-[#a1a1aa] sm:px-8">
            Thank you — please include invoice {invoice.number} with your
            payment.
          </footer>
        </article>
      </div>
    </div>
  );
}
