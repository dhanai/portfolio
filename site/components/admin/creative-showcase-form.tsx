"use client";

import { useEffect, useRef, useState } from "react";
import { AdminSection } from "@/components/admin/form";
import { CreativeShowcaseEditor } from "@/components/admin/creative-showcase-editor";
import { useToast } from "@/components/toast";
import { saveCreativeShowcaseSection } from "@/lib/admin/actions";
import type { CreativeShowcaseData } from "@/lib/defaults/creative-showcase";

export function CreativeShowcaseForm({
  showcase,
}: {
  showcase: CreativeShowcaseData;
}) {
  const { success, error: toastError } = useToast();
  const [enabled, setEnabled] = useState(showcase.enabled);
  const [title, setTitle] = useState(showcase.title);
  const [subtitle, setSubtitle] = useState(showcase.subtitle);
  const [sectionStatus, setSectionStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseline = useRef(
    JSON.stringify({
      enabled: showcase.enabled,
      title: showcase.title,
      subtitle: showcase.subtitle,
    }),
  );

  useEffect(() => {
    setEnabled(showcase.enabled);
    setTitle(showcase.title);
    setSubtitle(showcase.subtitle);
    baseline.current = JSON.stringify({
      enabled: showcase.enabled,
      title: showcase.title,
      subtitle: showcase.subtitle,
    });
  }, [showcase.enabled, showcase.title, showcase.subtitle]);

  useEffect(() => {
    const next = JSON.stringify({ enabled, title, subtitle });
    if (next === baseline.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!title.trim()) {
        toastError("Section title is required");
        return;
      }
      setSectionStatus("saving");
      try {
        const result = await saveCreativeShowcaseSection({
          enabled,
          title,
          subtitle,
        });
        if (result && "error" in result) {
          toastError(result.error);
          setSectionStatus("idle");
          return;
        }
        baseline.current = next;
        if (result && "unchanged" in result && result.unchanged) {
          setSectionStatus("idle");
          return;
        }
        setSectionStatus("saved");
        success("Section saved");
        window.setTimeout(() => setSectionStatus("idle"), 1500);
      } catch (err) {
        toastError(err instanceof Error ? err.message : "Failed to save section");
        setSectionStatus("idle");
      }
    }, 500);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [enabled, title, subtitle, success, toastError]);

  return (
    <div className="mt-8 space-y-6">
      <AdminSection title="Section">
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-[#a3a3a3]">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
              className="accent-[#ff453a]"
            />
            Show on homepage
          </label>
          <p className="text-[10px] uppercase tracking-wider text-[#525252]">
            {sectionStatus === "saving"
              ? "Saving…"
              : sectionStatus === "saved"
                ? "Saved"
                : "Autosaves"}
          </p>
        </div>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-[#737373]">
            Section title
          </span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-[#737373]">
            Section subtitle
          </span>
          <textarea
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            rows={2}
            className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
          />
          <p className="mt-1 text-xs text-[#525252]">
            One line under the section heading on the homepage and /ai.
          </p>
        </label>
      </AdminSection>

      <AdminSection title="Pieces">
        <CreativeShowcaseEditor initialItems={showcase.items} />
      </AdminSection>
    </div>
  );
}
