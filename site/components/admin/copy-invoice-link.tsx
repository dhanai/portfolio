"use client";

import { useState } from "react";
import Link from "next/link";

export function CopyInvoiceLink({
  url,
  path,
}: {
  url: string;
  path: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <code className="min-w-0 flex-1 truncate border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-[#d4d4d4] sm:text-sm">
        {url}
      </code>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={copy}
          className="bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <Link
          href={path}
          target="_blank"
          className="border border-white/20 px-4 py-2 text-sm text-white hover:border-white/40"
        >
          Open →
        </Link>
      </div>
    </div>
  );
}
