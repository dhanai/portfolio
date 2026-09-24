import { NextResponse } from "next/server";
import { generateInvoicePdf } from "@/lib/generate-invoice-pdf";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { token } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { token } });
  if (!invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  try {
    const { buffer, filename } = await generateInvoicePdf(invoice);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Invoice PDF generation failed", error);
    return new NextResponse("Failed to generate invoice PDF", { status: 500 });
  }
}
