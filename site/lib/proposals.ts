import {
  formatInvoiceDate,
  formatMoney,
  INVOICE_ISSUER,
  roundMoney,
} from "@/lib/invoices";

export const PROPOSAL_ISSUER = INVOICE_ISSUER;

export {
  formatInvoiceDate as formatProposalDate,
  formatMoney,
  roundMoney,
};

export const DEFAULT_PAYMENT_SCHEDULE =
  "50% due on contract signing\n50% due on project completion";

export const DEFAULT_TERMS = `1. Dhanai Holtzclaw assumes the client has permission from the rightful owner to use any images or design elements that are provided by the client for inclusion in the project, and will hold harmless, protect, and defend Dhanai Holtzclaw from any claim or suit arising from the use of such elements.

2. Dhanai Holtzclaw retains the right to display graphics and other web content elements as examples of his work in his portfolio and as content features in other projects once the project has been released to the public.`;

export function defaultNextSteps(): string[] {
  return [
    "Accept the proposal as is or discuss desired changes. Please note that changes to the scope of the project can be made at any time, but additional charges may apply.",
    "Finalize and accept this proposal.",
    "Submit initial payment of 50% of the total project fee.",
  ];
}

export function nextStepsIntro(clientLabel: string) {
  return `To proceed with this project, ${clientLabel} is required to take the following steps:`;
}

function randomHex(byteLength: number) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function createProposalToken() {
  return randomHex(16);
}

export function createProposalNumber(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = randomHex(2).toUpperCase();
  return `PROP-${y}${m}${d}-${suffix}`;
}

export function proposalPublicPath(token: string) {
  return `/proposal/${token}`;
}

export function proposalPdfPath(token: string) {
  return `/api/proposal/${token}/pdf`;
}

export function proposalPdfFilename(number: string) {
  return `${number}.pdf`;
}

export function parseStringListJson(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function serializeStringList(items: string[]): string {
  return JSON.stringify(
    items.map((item) => item.trim()).filter(Boolean),
  );
}

export function proposalStatusLabel(status: string) {
  if (status === "accepted") return "Accepted";
  if (status === "declined") return "Declined";
  return "Proposal";
}

export function proposalStatusClass(status: string) {
  if (status === "accepted") return "text-emerald-400";
  if (status === "declined") return "text-[#ff453a]";
  return "text-[#a3a3a3]";
}
