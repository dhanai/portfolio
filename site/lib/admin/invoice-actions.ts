"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/admin/types";
import {
  calculateLineAmount,
  createInvoiceNumber,
  createInvoiceToken,
  createLineItemId,
  parseLineItemsJson,
  sumLineItems,
  type InvoiceLineItem,
  type InvoiceRateType,
} from "@/lib/invoices";

function normalizeLineItems(items: InvoiceLineItem[]) {
  return items.map((item) => {
    const rateType: InvoiceRateType =
      item.rateType === "fixed" ? "fixed" : "hourly";
    const rate = Number(item.rate) || 0;
    const hours =
      rateType === "hourly" && item.hours != null ? Number(item.hours) : null;
    return {
      id: item.id || createLineItemId(),
      description: String(item.description ?? "").trim(),
      rateType,
      rate,
      hours: rateType === "hourly" ? hours : null,
      amount: calculateLineAmount(rateType, rate, hours),
    } satisfies InvoiceLineItem;
  });
}

function parseInvoiceForm(formData: FormData) {
  const clientName = String(formData.get("clientName") ?? "").trim();
  const clientEmail = String(formData.get("clientEmail") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const rawItems = String(formData.get("lineItemsJson") ?? "");
  const lineItems = normalizeLineItems(parseLineItemsJson(rawItems));

  if (!clientName) return { error: "Client name is required" as const };
  if (!clientEmail || !clientEmail.includes("@")) {
    return { error: "A valid client email is required" as const };
  }
  if (lineItems.length === 0) {
    return { error: "Add at least one line item" as const };
  }
  for (const [index, item] of lineItems.entries()) {
    if (!item.description) {
      return { error: `Line ${index + 1} needs a description` as const };
    }
    if (item.rate < 0) {
      return { error: `Line ${index + 1} has an invalid rate` as const };
    }
    if (item.rateType === "hourly" && (item.hours == null || item.hours <= 0)) {
      return { error: `Line ${index + 1} needs hours` as const };
    }
    if (item.amount <= 0) {
      return { error: `Line ${index + 1} total must be greater than zero` as const };
    }
  }

  const amount = sumLineItems(lineItems);
  if (amount <= 0) return { error: "Total must be greater than zero" as const };

  const first = lineItems[0];

  return {
    data: {
      clientName,
      clientEmail,
      notes,
      lineItems: JSON.stringify(lineItems),
      amount,
      // Keep legacy columns in sync with the first line for older readers
      description: first.description,
      rateType: first.rateType,
      rate: first.rate,
      hours: first.hours,
    },
  };
}

export async function createInvoiceAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseInvoiceForm(formData);
  if ("error" in parsed && parsed.error) return { error: parsed.error };

  const invoice = await prisma.invoice.create({
    data: {
      token: createInvoiceToken(),
      number: createInvoiceNumber(),
      ...parsed.data!,
      status: "sent",
    },
  });

  revalidatePath("/admin/invoices");
  revalidatePath(`/invoice/${invoice.token}`);
  redirect(`/admin/invoices/${invoice.id}?created=1`);
}

export async function updateInvoiceAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Missing invoice id" };

  const existing = await prisma.invoice.findUnique({ where: { id } });
  if (!existing) return { error: "Invoice not found" };

  const parsed = parseInvoiceForm(formData);
  if ("error" in parsed && parsed.error) return { error: parsed.error };

  await prisma.invoice.update({
    where: { id },
    data: parsed.data!,
  });

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  revalidatePath(`/invoice/${existing.token}`);
  redirect(`/admin/invoices/${id}?saved=1`);
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
