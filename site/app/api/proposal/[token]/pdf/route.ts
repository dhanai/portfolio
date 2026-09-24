import { NextResponse } from "next/server";
import { generateProposalPdf } from "@/lib/generate-proposal-pdf";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { token } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { token } });
  if (!proposal) {
    return new NextResponse("Proposal not found", { status: 404 });
  }

  try {
    const { buffer, filename } = await generateProposalPdf(proposal);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Proposal PDF generation failed", error);
    return new NextResponse("Failed to generate proposal PDF", { status: 500 });
  }
}
