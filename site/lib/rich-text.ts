/** Minimal HTML allowlist for proposal goals (bold / italic / underline / lists). */

const ALLOWED_TAGS = new Set([
  "b",
  "strong",
  "i",
  "em",
  "u",
  "br",
  "p",
  "div",
  "ul",
  "ol",
  "li",
]);

export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function richTextIsEmpty(html: string | null | undefined) {
  if (!html?.trim()) return true;
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  return !text;
}

/** Strip everything except formatting + list tags, with no attributes. */
export function sanitizeRichText(raw: string | null | undefined): string {
  const input = String(raw ?? "").trim();
  if (!input) return "";

  if (!/<[a-z/]/i.test(input)) {
    return `<p>${escapeHtml(input).replace(/\n/g, "<br>")}</p>`;
  }

  let html = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(script|style|iframe|object|embed|link|meta|img|a)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "");

  html = html.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (match, tag: string) => {
    const t = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(t)) return "";
    if (t === "br") return "<br>";
    if (match.startsWith("</")) return `</${t}>`;
    return `<${t}>`;
  });

  if (richTextIsEmpty(html)) return "";
  return html;
}

export type RichTextSegment = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type RichTextBlock = {
  segments: RichTextSegment[];
  /** Prefix for list items, e.g. "• " or "1. " */
  marker?: string;
};

/**
 * Flatten sanitized goals HTML into blocks/lines for react-pdf.
 * Supports nested b/i/u, br/p/div breaks, and ul/ol/li lists.
 */
export function richTextToBlocks(raw: string | null | undefined): RichTextBlock[] {
  const html = sanitizeRichText(raw);
  if (!html) return [];

  const blocks: RichTextBlock[] = [];
  let segments: RichTextSegment[] = [];
  let bold = 0;
  let italic = 0;
  let underline = 0;
  let listKind: "ul" | "ol" | null = null;
  let listIndex = 0;
  let inLi = false;
  let pendingMarker: string | undefined;

  const flushBlock = (marker?: string) => {
    const cleaned = segments.filter((s) => s.text.length > 0);
    if (cleaned.length > 0 || marker) {
      blocks.push({
        segments: cleaned.length > 0 ? cleaned : [{ text: "" }],
        marker,
      });
    }
    segments = [];
    pendingMarker = undefined;
  };

  const pushText = (text: string) => {
    if (!text) return;
    const decoded = text
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"');
    if (!decoded) return;
    segments.push({
      text: decoded,
      bold: bold > 0 || undefined,
      italic: italic > 0 || undefined,
      underline: underline > 0 || undefined,
    });
  };

  const tokenRe =
    /<\/?(?:b|strong|i|em|u|br|p|div|ul|ol|li)>|&[a-z]+;|[^<&]+/gi;
  const tokens = html.match(tokenRe) ?? [];

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (lower === "<br>") {
      flushBlock(pendingMarker);
      continue;
    }
    if (lower === "<ul>") {
      flushBlock(pendingMarker);
      listKind = "ul";
      listIndex = 0;
      continue;
    }
    if (lower === "<ol>") {
      flushBlock(pendingMarker);
      listKind = "ol";
      listIndex = 0;
      continue;
    }
    if (lower === "</ul>" || lower === "</ol>") {
      if (inLi) flushBlock(pendingMarker);
      inLi = false;
      listKind = null;
      listIndex = 0;
      continue;
    }
    if (lower === "<li>") {
      if (inLi) flushBlock(pendingMarker);
      inLi = true;
      listIndex += 1;
      pendingMarker =
        listKind === "ol" ? `${listIndex}. ` : listKind === "ul" ? "• " : undefined;
      continue;
    }
    if (lower === "</li>") {
      flushBlock(pendingMarker);
      inLi = false;
      continue;
    }
    if (lower === "<p>" || lower === "<div>") continue;
    if (lower === "</p>" || lower === "</div>") {
      flushBlock(pendingMarker);
      continue;
    }
    if (lower === "<b>" || lower === "<strong>") {
      bold += 1;
      continue;
    }
    if (lower === "</b>" || lower === "</strong>") {
      bold = Math.max(0, bold - 1);
      continue;
    }
    if (lower === "<i>" || lower === "<em>") {
      italic += 1;
      continue;
    }
    if (lower === "</i>" || lower === "</em>") {
      italic = Math.max(0, italic - 1);
      continue;
    }
    if (lower === "<u>") {
      underline += 1;
      continue;
    }
    if (lower === "</u>") {
      underline = Math.max(0, underline - 1);
      continue;
    }
    if (token.startsWith("&")) {
      pushText(token);
      continue;
    }
    pushText(token);
  }

  flushBlock(pendingMarker);
  return blocks.filter(
    (block) =>
      block.segments.some((s) => s.text.trim().length > 0) || Boolean(block.marker),
  );
}
