import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePdfDocument } from "@/components/invoice/invoice-pdf-document";
import {
  getInvoiceLineItems,
  invoicePdfFilename,
} from "@/lib/invoices";

export type InvoicePdfSource = {
  number: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  description?: string | null;
  rateType?: string | null;
  rate?: number | null;
  hours?: number | null;
  lineItems?: string | null;
};

export async function generateInvoicePdf(
  invoice: InvoicePdfSource,
): Promise<{ buffer: Buffer; filename: string }> {
  const lineItems = getInvoiceLineItems(invoice);
  const buffer = await renderToBuffer(
    <InvoicePdfDocument
      number={invoice.number}
      clientName={invoice.clientName}
      clientEmail={invoice.clientEmail}
      amount={invoice.amount}
      status={invoice.status}
      notes={invoice.notes}
      createdAt={invoice.createdAt}
      lineItems={lineItems}
    />,
  );
  return { buffer, filename: invoicePdfFilename(invoice.number) };
}
