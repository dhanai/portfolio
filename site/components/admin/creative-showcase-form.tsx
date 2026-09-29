"use client";

import { useEffect, useRef, useState } from "react";
import { AdminSection } from "@/components/admin/form";
import { CreativeShowcaseEditor } from "@/components/admin/creative-showcase-editor";
import { SectionTitleButton } from "@/components/admin/section-title-button";
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
  const [eyebrow, setEyebrow] = useState(showcase.eyebrow);
  const [title, setTitle] = useState(showcase.title);
  const [subtitle, setSubtitle] = useState(showcase.subtitle);
  const [sectionStatus, setSectionStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef({
    enabled: showcase.enabled,
    eyebrow: showcase.eyebrow,
    title: showcase.title,
    subtitle: showcase.subtitle,
  });
  const baseline = useRef(JSON.stringify(draftRef.current));
  const toastRef = useRef({ success, error: toastError });
  toastRef.current = { success, error: toastError };

  useEffect(() => {
    const incoming = JSON.stringify({
      enabled: showcase.enabled,
      eyebrow: showcase.eyebrow,
      title: showcase.title,
      subtitle: showcase.subtitle,
    });
    if (JSON.stringify(draftRef.current) !== baseline.current) return;
    draftRef.current = {
      enabled: showcase.enabled,
      eyebrow: showcase.eyebrow,
      title: showcase.title,
      subtitle: showcase.subtitle,
    };
    baseline.current = incoming;
    setEnabled(showcase.enabled);
    setEyebrow(showcase.eyebrow);
    setTitle(showcase.title);
    setSubtitle(showcase.subtitle);
  }, [showcase.enabled, showcase.eyebrow, showcase.title, showcase.subtitle]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function scheduleSave(patch: Partial<typeof draftRef.current>) {
    draftRef.current = { ...draftRef.current, ...patch };
    if (patch.enabled !== undefined) setEnabled(patch.enabled);
    if (patch.eyebrow !== undefined) setEyebrow(patch.eyebrow);
    if (patch.title !== undefined) setTitle(patch.title);
    if (patch.subtitle !== undefined) setSubtitle(patch.subtitle);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist({ ...draftRef.current });
    }, 1200);
  }

  async function persist(draft: typeof draftRef.current) {
    const next = JSON.stringify(draft);
    if (next === baseline.current) return;
    if (!draft.title.trim()) {
      toastRef.current.error("Section title is required");
      return;
    }
    setSectionStatus("saving");
    try {
      const result = await saveCreativeShowcaseSection(draft);
      if (JSON.stringify(draftRef.current) !== next) return;
      if (result && "error" in result) {
        toastRef.current.error(result.error);
        setSectionStatus("idle");
        return;
      }
      baseline.current = next;
      if (result && "unchanged" in result && result.unchanged) {
        setSectionStatus("idle");
        return;
      }
      setSectionStatus("saved");
      toastRef.current.success("Section saved");
      window.setTimeout(() => setSectionStatus("idle"), 1500);
    } catch (err) {
      if (JSON.stringify(draftRef.current) !== next) return;
      toastRef.current.error(
        err instanceof Error ? err.message : "Failed to save section",
      );
      setSectionStatus("idle");
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <SectionTitleButton
        title={title}
        drawerTitle="Creative section"
        description="Shown on the homepage rail and /ai."
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <label className="flex min-h-11 items-center gap-2 text-sm text-[#a3a3a3]">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) => scheduleSave({ enabled: event.target.checked })}
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
              Eyebrow
            </span>
            <input
              value={eyebrow}
              onChange={(event) => scheduleSave({ eyebrow: event.target.value })}
              className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-3 text-base text-white outline-none focus:border-[#ff453a] sm:text-sm"
            />
            <p className="mt-1 text-xs text-[#525252]">
              Small label above the heading on the homepage and /ai.
            </p>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[#737373]">
              Section title
            </span>
            <input
              value={title}
              onChange={(event) => scheduleSave({ title: event.target.value })}
              required
              className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-3 text-base text-white outline-none focus:border-[#ff453a] sm:text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-[#737373]">
              Section subtitle
            </span>
            <textarea
              value={subtitle}
              onChange={(event) => scheduleSave({ subtitle: event.target.value })}
              rows={3}
              className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-3 text-base text-white outline-none focus:border-[#ff453a] sm:text-sm"
            />
            <p className="mt-1 text-xs text-[#525252]">
              One line under the heading. Leave blank to hide it.
            </p>
          </label>
        </div>
      </SectionTitleButton>

      <AdminSection title="Pieces">
        <CreativeShowcaseEditor initialItems={showcase.items} />
      </AdminSection>
    </div>
  );
}
