import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  daysWorked,
  formatInvoiceDate,
  formatMoney,
  formatWorkedOn,
  getInvoiceLineItems,
  invoiceBalance,
  INVOICE_ISSUER,
  INVOICE_PAYMENT_OPTIONS,
  INVOICE_W9_FILENAME,
  INVOICE_W9_LABEL,
  INVOICE_W9_PUBLIC_PATH,
  invoicePdfFilename,
  invoicePdfPath,
  lineItemsHaveHours,
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
  if (!invoice) {
    return {
      title: { absolute: "Invoice" },
      robots: { index: false, follow: false },
    };
  }

  const title = `Invoice ${invoice.number}`;
  const description =
    invoice.status === "paid"
      ? `Invoice for ${invoice.clientName} - ${formatMoney(invoice.amount)}, paid.`
      : `Invoice for ${invoice.clientName} - ${formatMoney(invoiceBalance(invoice))} due to ${INVOICE_ISSUER.name}.`;
  const path = `/invoice/${token}`;

  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: path,
      siteName: INVOICE_ISSUER.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicInvoicePage({ params }: PageProps) {
  const { token } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { token } });
  if (!invoice) notFound();

  const lineItems = getInvoiceLineItems(invoice);
  const showHours = lineItemsHaveHours(lineItems);
  const worked = daysWorked(lineItems);
  const showDays = worked.length > 0;
  const isPaid = invoice.status === "paid";
  const isPartial = !isPaid && invoice.amountPaid > 0;
  const balance = invoiceBalance(invoice);
  const labelColSpan = (showHours ? 3 : 2) + (showDays ? 1 : 0);
  const jobFacts = [
    invoice.jobNumber
      ? { label: "Job number", value: invoice.jobNumber }
      : null,
    invoice.role ? { label: "Role", value: invoice.role } : null,
    invoice.budgetLine
      ? { label: "Budget line", value: invoice.budgetLine }
      : null,
    showDays
      ? {
          label: "Days worked",
          value: worked.map((day) => formatWorkedOn(day)).join(", "),
        }
      : null,
  ].filter((fact): fact is { label: string; value: string } => fact != null);

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
              <a
                href={invoicePdfPath(invoice.token)}
                download={invoicePdfFilename(invoice.number, invoice.jobNumber)}
                className="mt-4 inline-flex items-center border border-[#18181b] bg-[#18181b] px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white hover:bg-[#27272a]"
              >
                Download invoice
              </a>
            </div>
            <div className="sm:text-right">
              <p
                className={`inline-block text-[10px] font-medium uppercase tracking-[0.16em] ${
                  isPaid ? "text-emerald-700" : "text-[#71717a]"
                }`}
              >
                {isPaid ? "Paid" : isPartial ? "Balance due" : "Amount due"}
              </p>
              <p className="mt-1 font-mono text-3xl font-medium tracking-tight sm:text-4xl">
                {formatMoney(isPartial ? balance : invoice.amount)}
              </p>
              {isPartial ? (
                <p className="mt-1 font-mono text-xs text-[#71717a]">
                  {formatMoney(invoice.amountPaid)} of{" "}
                  {formatMoney(invoice.amount)} paid
                </p>
              ) : null}
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
              <p className="text-sm text-[#52525b]">{INVOICE_ISSUER.phone}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
                Bill to
              </p>
              <p className="mt-2 text-sm font-medium">{invoice.clientName}</p>
              <p className="text-sm text-[#52525b]">{invoice.clientEmail}</p>
            </div>
          </section>

          {jobFacts.length > 0 ? (
            <section className="grid gap-5 border-b border-[#e4e4e7] px-5 py-6 sm:grid-cols-2 sm:px-8 sm:py-8">
              {jobFacts.map((fact) => (
                <div key={fact.label}>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#a1a1aa]">
                    {fact.label}
                  </p>
                  <p className="mt-2 text-sm text-[#18181b]">{fact.value}</p>
                </div>
              ))}
            </section>
          ) : null}

          <section className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="overflow-x-auto border border-[#e4e4e7]">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead className="bg-[#fafafa] text-[10px] uppercase tracking-[0.14em] text-[#71717a]">
                  <tr>
                    {showDays ? (
                      <th className="px-3 py-2.5 font-medium sm:px-4">Day</th>
                    ) : null}
                    <th className="px-3 py-2.5 font-medium sm:px-4">
                      Description
                    </th>
                    <th className="px-3 py-2.5 text-right font-medium sm:px-4">
                      Rate
                    </th>
                    {showHours ? (
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
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-t border-[#e4e4e7]">
                      {showDays ? (
                        <td className="px-3 py-3 align-top whitespace-nowrap text-[#27272a] sm:px-4">
                          {item.workedOn ? formatWorkedOn(item.workedOn) : "-"}
                        </td>
                      ) : null}
                      <td className="max-w-[12rem] px-3 py-3 align-top whitespace-pre-wrap text-[#27272a] sm:max-w-none sm:px-4">
                        {item.description}
                      </td>
                      <td className="px-3 py-3 text-right font-mono align-top whitespace-nowrap sm:px-4">
                        {formatMoney(item.rate)}
                        {item.rateType === "hourly" ? "/hr" : ""}
                      </td>
                      {showHours ? (
                        <td className="px-3 py-3 text-right font-mono align-top sm:px-4">
                          {item.rateType === "hourly" ? item.hours : "-"}
                        </td>
                      ) : null}
                      <td className="px-3 py-3 text-right font-mono align-top whitespace-nowrap sm:px-4">
                        {formatMoney(item.amount)}
                        {item.paid && !isPaid ? (
                          <span className="mt-0.5 block font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-700">
                            Paid
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {isPartial ? (
                    <>
                      <tr className="border-t border-[#e4e4e7]">
                        <td
                          colSpan={labelColSpan}
                          className="px-3 py-2.5 text-right text-[10px] font-medium uppercase tracking-[0.14em] text-[#71717a] sm:px-4"
                        >
                          Total
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap sm:px-4">
                          {formatMoney(invoice.amount)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={labelColSpan}
                          className="px-3 py-2.5 text-right text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-700 sm:px-4"
                        >
                          Paid
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap text-emerald-700 sm:px-4">
                          −{formatMoney(invoice.amountPaid)}
                        </td>
                      </tr>
                    </>
                  ) : null}
                  <tr className="border-t border-[#e4e4e7] bg-[#fafafa]">
                    <td
                      colSpan={labelColSpan}
                      className="px-3 py-3 text-right text-[10px] font-medium uppercase tracking-[0.14em] text-[#71717a] sm:px-4"
                    >
                      {isPaid ? "Total paid" : isPartial ? "Balance due" : "Total due"}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-base font-medium whitespace-nowrap sm:px-4">
                      {formatMoney(isPartial ? balance : invoice.amount)}
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
            {invoice.includeW9 ? (
              <div className="mt-5 border border-[#e4e4e7] px-4 py-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#71717a]">
                  Tax form
                </p>
                <a
                  href={INVOICE_W9_PUBLIC_PATH}
                  download={INVOICE_W9_FILENAME}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#18181b] underline underline-offset-2 hover:opacity-70"
                >
                  Download {INVOICE_W9_LABEL}
                  <span className="font-mono text-xs font-normal text-[#71717a]">
                    {INVOICE_W9_FILENAME}
                  </span>
                </a>
              </div>
            ) : null}
            {invoice.notes ? (
              <p className="mt-5 whitespace-pre-wrap text-sm text-[#52525b]">
                {invoice.notes}
              </p>
            ) : null}
          </section>

          <footer className="border-t border-[#e4e4e7] px-5 py-4 text-center text-[11px] text-[#a1a1aa] sm:px-8">
            Thank you - please include invoice {invoice.number} with your
            payment.
          </footer>
        </article>
      </div>
    </div>
  );
}
