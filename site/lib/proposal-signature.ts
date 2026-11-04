import { createHash } from "node:crypto";

/** The parts of a proposal a signature commits to. */
export type ProposalSignedContent = {
  number: string;
  title: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  goals: string | null;
  deliverables: string;
  timeframe: string;
  quoteLabel: string;
  amount: number;
  paymentSchedule: string;
  nextSteps: string;
  terms: string;
  notes: string | null;
};

function norm(value: string | null | undefined) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .trim();
}

/**
 * SHA-256 over the proposal's agreed content. Stored at signing so the admin
 * can tell whether the proposal was edited after the client signed it.
 */
export function proposalContentHash(p: ProposalSignedContent): string {
  const payload = JSON.stringify([
    norm(p.number),
    norm(p.title),
    norm(p.clientName),
    norm(p.clientCompany),
    norm(p.clientEmail),
    norm(p.goals),
    norm(p.deliverables),
    norm(p.timeframe),
    norm(p.quoteLabel),
    p.amount.toFixed(2),
    norm(p.paymentSchedule),
    norm(p.nextSteps),
    norm(p.terms),
    norm(p.notes),
  ]);
  return createHash("sha256").update(payload).digest("hex");
}

export const SIGNATURE_CONSENT_TEXT =
  "I agree to this proposal and its terms, and I agree that typing or drawing my name above is my electronic signature, with the same effect as a handwritten signature.";

/** Max size of a drawn signature PNG data URL (bytes of text). */
export const MAX_SIGNATURE_IMAGE_LENGTH = 300_000;

export function formatSignedAt(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(date);
}
