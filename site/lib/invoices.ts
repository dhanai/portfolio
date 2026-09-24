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

/** Public path for the downloadable W-9 (filename strips year). */
export const INVOICE_W9_FILENAME = "undeniable-w9-signed.pdf";
export const INVOICE_W9_PUBLIC_PATH = `/assets/invoices/${INVOICE_W9_FILENAME}`;
export const INVOICE_W9_LABEL = "W-9 (Undeniable)";

export type InvoiceRateType = "hourly" | "fixed";

export type InvoiceLineItem = {
  id: string;
  description: string;
  rateType: InvoiceRateType;
  rate: number;
  hours: number | null;
  amount: number;
};

export type InvoiceRecord = {
  id: string;
  token: string;
  number: string;
  clientName: string;
  clientEmail: string;
  description: string;
  rateType: string;
  rate: number;
  hours: number | null;
  lineItems: string;
  amount: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function randomHex(byteLength: number) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function createInvoiceToken() {
  return randomHex(16);
}

export function createInvoiceNumber(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = randomHex(2).toUpperCase();
  return `INV-${y}${m}${d}-${suffix}`;
}

export function createLineItemId() {
  return randomHex(8);
}

export function roundMoney(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateLineAmount(
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

/** @deprecated use calculateLineAmount */
export function calculateInvoiceAmount(
  rateType: InvoiceRateType,
  rate: number,
  hours: number | null | undefined,
) {
  return calculateLineAmount(rateType, rate, hours);
}

export function sumLineItems(items: InvoiceLineItem[]) {
  return roundMoney(items.reduce((sum, item) => sum + item.amount, 0));
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

export function emptyLineItem(): InvoiceLineItem {
  return {
    id: createLineItemId(),
    description: "",
    rateType: "hourly",
    rate: 0,
    hours: null,
    amount: 0,
  };
}

export function parseLineItemsJson(raw: string | null | undefined): InvoiceLineItem[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item): InvoiceLineItem | null => {
        if (!item || typeof item !== "object") return null;
        const row = item as Record<string, unknown>;
        const rateType =
          row.rateType === "fixed" || row.rateType === "hourly"
            ? row.rateType
            : null;
        if (!rateType) return null;
        const rate = Number(row.rate);
        const hours =
          row.hours == null || row.hours === ""
            ? null
            : Number(row.hours);
        const description = String(row.description ?? "").trim();
        const amount = calculateLineAmount(
          rateType,
          Number.isFinite(rate) ? rate : 0,
          hours != null && Number.isFinite(hours) ? hours : null,
        );
        return {
          id: String(row.id ?? createLineItemId()),
          description,
          rateType,
          rate: Number.isFinite(rate) ? rate : 0,
          hours:
            rateType === "hourly" && hours != null && Number.isFinite(hours)
              ? hours
              : null,
          amount,
        };
      })
      .filter((item): item is InvoiceLineItem => item != null);
  } catch {
    return [];
  }
}

/** Prefer lineItems JSON; fall back to legacy single-description invoice fields. */
export function getInvoiceLineItems(invoice: {
  description?: string | null;
  rateType?: string | null;
  rate?: number | null;
  hours?: number | null;
  lineItems?: string | null;
}): InvoiceLineItem[] {
  const fromJson = parseLineItemsJson(invoice.lineItems);
  if (fromJson.length > 0) return fromJson;

  const description = String(invoice.description ?? "").trim();
  if (!description && !(invoice.rate && invoice.rate > 0)) return [];

  const rateType =
    invoice.rateType === "fixed" || invoice.rateType === "hourly"
      ? invoice.rateType
      : "fixed";
  const rate = Number(invoice.rate ?? 0);
  const hours =
    rateType === "hourly" && invoice.hours != null
      ? Number(invoice.hours)
      : null;

  return [
    {
      id: "legacy",
      description: description || "Services",
      rateType,
      rate: Number.isFinite(rate) ? rate : 0,
      hours: hours != null && Number.isFinite(hours) ? hours : null,
      amount: calculateLineAmount(
        rateType,
        Number.isFinite(rate) ? rate : 0,
        hours,
      ),
    },
  ];
}

export function lineItemsHaveHours(items: InvoiceLineItem[]) {
  return items.some((item) => item.rateType === "hourly");
}
