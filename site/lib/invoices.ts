import { randomBytes } from "crypto";

export const INVOICE_ISSUER = {
  name: "Dhanai Holtzclaw",
  addressLines: ["3883 Latrobe St", "Los Angeles, CA 90031"],
  email: "dhanai@undeniable.io",
} as const;

export const INVOICE_PAYMENT_OPTIONS = [
  { label: "Venmo", value: "@takeoutorder" },
  { label: "PayPal", value: "dhanai@undeniable.io" },
  { label: "Zelle", value: "702-321-1971" },
] as const;

export type InvoiceRateType = "hourly" | "fixed";

export type InvoiceRecord = {
  id: string;
  token: string;
  number: string;
  clientName: string;
  clientEmail: string;
  description: string;
  rateType: InvoiceRateType;
  rate: number;
  hours: number | null;
  amount: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function createInvoiceToken() {
  return randomBytes(16).toString("hex");
}

export function createInvoiceNumber(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = randomBytes(2).toString("hex").toUpperCase();
  return `INV-${y}${m}${d}-${suffix}`;
}

export function calculateInvoiceAmount(
  rateType: InvoiceRateType,
  rate: number,
  hours: number | null | undefined,
) {
  if (!Number.isFinite(rate) || rate < 0) return 0;
  if (rateType === "fixed") return roundMoney(rate);
  const h = hours ?? 0;
  if (!Number.isFinite(h) || h < 0) return 0;
  return roundMoney(rate * h);
}

export function roundMoney(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatInvoiceDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function invoicePublicPath(token: string) {
  return `/invoice/${token}`;
}
