"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/admin/types";
import {
  calculateInvoiceAmount,
  createInvoiceNumber,
  createInvoiceToken,
  type InvoiceRateType,
} from "@/lib/invoices";

function parseRateType(raw: FormDataEntryValue | null): InvoiceRateType | null {
  if (raw === "hourly" || raw === "fixed") return raw;
  return null;
}

function parseMoney(raw: FormDataEntryValue | null) {
  if (raw == null || String(raw).trim() === "") return null;
  const n = Number(String(raw).replace(/[$,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function parseHours(raw: FormDataEntryValue | null) {
  if (raw == null || String(raw).trim() === "") return null;
  const n = Number(String(raw));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export async function createInvoiceAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const clientName = String(formData.get("clientName") ?? "").trim();
  const clientEmail = String(formData.get("clientEmail") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const rateType = parseRateType(formData.get("rateType"));
  const rate = parseMoney(formData.get("rate"));
  const hours = parseHours(formData.get("hours"));
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!clientName) return { error: "Client name is required" };
  if (!clientEmail || !clientEmail.includes("@")) {
    return { error: "A valid client email is required" };
  }
  if (!description) return { error: "Description is required" };
  if (!rateType) return { error: "Choose hourly or fixed rate" };
  if (rate == null) return { error: "Rate is required" };
  if (rateType === "hourly" && (hours == null || hours <= 0)) {
    return { error: "Hours are required for hourly rates" };
  }

  const amount = calculateInvoiceAmount(rateType, rate, hours);
  if (amount <= 0) return { error: "Total must be greater than zero" };

  const invoice = await prisma.invoice.create({
    data: {
      token: createInvoiceToken(),
      number: createInvoiceNumber(),
      clientName,
      clientEmail,
      description,
      rateType,
      rate,
      hours: rateType === "hourly" ? hours : null,
      amount,
      status: "sent",
      notes,
    },
  });

  revalidatePath("/admin/invoices");
  revalidatePath(`/invoice/${invoice.token}`);
  redirect(`/admin/invoices/${invoice.id}?created=1`);
}

export async function deleteInvoiceAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing invoice id" };

  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) return { error: "Invoice not found" };

  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/admin/invoices");
  revalidatePath(`/invoice/${existing.token}`);
  redirect("/admin/invoices");
}

export async function markInvoicePaidAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing invoice id" };

  await prisma.invoice.update({
    where: { id },
    data: { status: "paid" },
  });

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  return { ok: true };
}
