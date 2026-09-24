"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/admin/types";
import {
  createProposalNumber,
  createProposalToken,
  DEFAULT_PAYMENT_SCHEDULE,
  DEFAULT_TERMS,
  defaultNextSteps,
  parseStringListJson,
  roundMoney,
  serializeStringList,
} from "@/lib/proposals";

function parseProposalForm(formData: FormData) {
  const clientName = String(formData.get("clientName") ?? "").trim();
  const clientCompany = String(formData.get("clientCompany") ?? "").trim();
  const clientEmail = String(formData.get("clientEmail") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const goals = String(formData.get("goals") ?? "").trim() || null;
  const timeframe = String(formData.get("timeframe") ?? "").trim();
  const quoteLabel = String(formData.get("quoteLabel") ?? "").trim();
  const paymentSchedule =
    String(formData.get("paymentSchedule") ?? "").trim() ||
    DEFAULT_PAYMENT_SCHEDULE;
  const terms =
    String(formData.get("terms") ?? "").trim() || DEFAULT_TERMS;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const amountRaw = Number(formData.get("amount"));
  const amount = roundMoney(Number.isFinite(amountRaw) ? amountRaw : 0);

  const deliverables = parseStringListJson(
    String(formData.get("deliverablesJson") ?? ""),
  );
  const nextStepsRaw = parseStringListJson(
    String(formData.get("nextStepsJson") ?? ""),
  );
  const nextSteps =
    nextStepsRaw.length > 0 ? nextStepsRaw : defaultNextSteps();

  if (!clientName) return { error: "Client name is required" as const };
  if (!clientEmail || !clientEmail.includes("@")) {
    return { error: "A valid client email is required" as const };
  }
  if (!title) return { error: "Project title is required" as const };
  if (deliverables.length === 0) {
    return { error: "Add at least one deliverable" as const };
  }
  if (!timeframe) return { error: "Timeframe is required" as const };
  if (!quoteLabel) return { error: "Quote label is required" as const };
  if (amount <= 0) return { error: "Amount must be greater than zero" as const };

  return {
    data: {
      clientName,
      clientCompany,
      clientEmail,
      title,
      goals,
      deliverables: serializeStringList(deliverables),
      timeframe,
      quoteLabel,
      amount,
      paymentSchedule,
      nextSteps: serializeStringList(nextSteps),
      terms,
      notes,
    },
  };
}

export async function createProposalAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseProposalForm(formData);
  if ("error" in parsed && parsed.error) return { error: parsed.error };

  const proposal = await prisma.proposal.create({
    data: {
      token: createProposalToken(),
      number: createProposalNumber(),
      ...parsed.data!,
      status: "sent",
    },
  });

  revalidatePath("/admin/proposals");
  revalidatePath(`/proposal/${proposal.token}`);
  redirect(`/admin/proposals/${proposal.id}?created=1`);
}

export async function updateProposalAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing proposal id" };

  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing) return { error: "Proposal not found" };

  const parsed = parseProposalForm(formData);
  if ("error" in parsed && parsed.error) return { error: parsed.error };

  await prisma.proposal.update({
    where: { id },
    data: parsed.data!,
  });

  revalidatePath("/admin/proposals");
  revalidatePath(`/admin/proposals/${id}`);
  revalidatePath(`/proposal/${existing.token}`);
  redirect(`/admin/proposals/${id}?saved=1`);
}

export async function deleteProposalAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing proposal id" };

  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing) return { error: "Proposal not found" };

  await prisma.proposal.delete({ where: { id } });
  revalidatePath("/admin/proposals");
  revalidatePath(`/proposal/${existing.token}`);
  redirect("/admin/proposals");
}

export async function markProposalAcceptedAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing proposal id" };

  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing) return { error: "Proposal not found" };

  await prisma.proposal.update({
    where: { id },
    data: { status: "accepted" },
  });

  revalidatePath("/admin/proposals");
  revalidatePath(`/admin/proposals/${id}`);
  revalidatePath(`/proposal/${existing.token}`);
  return { ok: true };
}

export async function markProposalDeclinedAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing proposal id" };

  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing) return { error: "Proposal not found" };

  await prisma.proposal.update({
    where: { id },
    data: { status: "declined" },
  });

  revalidatePath("/admin/proposals");
  revalidatePath(`/admin/proposals/${id}`);
  revalidatePath(`/proposal/${existing.token}`);
  return { ok: true };
}
