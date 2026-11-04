"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/admin/types";
import {
  MAX_SIGNATURE_IMAGE_LENGTH,
  proposalContentHash,
} from "@/lib/proposal-signature";

const PNG_DATA_URL = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;

/** Public: the client signs and accepts a proposal from its share link. */
export async function signProposalAction(
  formData: FormData,
): Promise<ActionResult> {
  const token = String(formData.get("token") ?? "").trim();
  const signerName = String(formData.get("signerName") ?? "")
    .replace(/\s+/g, " ")
    .trim();
  const consent = formData.get("consent") === "on";
  const imageRaw = String(formData.get("signatureImage") ?? "").trim();

  if (!token) return { error: "Missing proposal" };
  if (signerName.length < 2 || signerName.length > 120) {
    return { error: "Enter your full name" };
  }
  if (!consent) {
    return { error: "Please agree to sign electronically" };
  }

  let signatureImage: string | null = null;
  if (imageRaw) {
    if (
      imageRaw.length > MAX_SIGNATURE_IMAGE_LENGTH ||
      !PNG_DATA_URL.test(imageRaw)
    ) {
      return { error: "Signature image is invalid. Clear it and try again." };
    }
    signatureImage = imageRaw;
  }

  const proposal = await prisma.proposal.findUnique({ where: { token } });
  if (!proposal) return { error: "Proposal not found" };
  if (proposal.signedAt) return { error: "This proposal is already signed" };
  if (proposal.status === "declined") {
    return { error: "This proposal is no longer open for signature" };
  }

  const h = await headers();
  const signerIp =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null;
  const signerUserAgent = h.get("user-agent")?.slice(0, 500) || null;

  // Only sign if still unsigned, so two submits can't overwrite each other.
  const result = await prisma.proposal.updateMany({
    where: { token, signedAt: null },
    data: {
      signerName,
      signatureImage,
      signedAt: new Date(),
      signerIp,
      signerUserAgent,
      signedHash: proposalContentHash(proposal),
      status: "accepted",
    },
  });
  if (result.count === 0) return { error: "This proposal is already signed" };

  revalidatePath(`/proposal/${token}`);
  revalidatePath("/admin/proposals");
  revalidatePath(`/admin/proposals/${proposal.id}`);
  return { ok: true };
}
