"use client";

import { useEffect, useRef, useState } from "react";
import { SectionTitleButton } from "@/components/admin/section-title-button";
import { useToast } from "@/components/toast";
import { saveWorkSectionTitle } from "@/lib/admin/actions";

export function WorkSectionTitleForm({ initialTitle }: { initialTitle: string }) {
  const { success, error: toastError } = useToast();
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseline = useRef(initialTitle);
  const titleRef = useRef(initialTitle);
  const toastRef = useRef({ success, error: toastError });
  toastRef.current = { success, error: toastError };

  useEffect(() => {
    if (titleRef.current !== baseline.current) return;
    titleRef.current = initialTitle;
    baseline.current = initialTitle;
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function scheduleSave(next: string) {
    titleRef.current = next;
    setTitle(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist(titleRef.current);
    }, 1200);
  }

  async function persist(value: string) {
    if (value === baseline.current) return;
    if (!value.trim()) {
      toastRef.current.error("Section title is required");
      return;
    }
    setStatus("saving");
    try {
      const result = await saveWorkSectionTitle(value);
      if (titleRef.current !== value) return;
      if (result && "error" in result) {
        toastRef.current.error(result.error);
        setStatus("idle");
        return;
      }
      baseline.current = value;
      if (result && "unchanged" in result && result.unchanged) {
        setStatus("idle");
        return;
      }
      setStatus("saved");
      toastRef.current.success("Section saved");
      window.setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      if (titleRef.current !== value) return;
      toastRef.current.error(
        err instanceof Error ? err.message : "Failed to save section",
      );
      setStatus("idle");
    }
  }

  return (
    <SectionTitleButton
      title={title}
      drawerTitle="Work section"
      description="Heading under the Work label on the homepage."
    >
      <div className="mb-4 flex justify-end">
        <p className="text-[10px] uppercase tracking-wider text-[#525252]">
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Autosaves"}
        </p>
      </div>
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-[#737373]">
          Section title
        </span>
        <input
          value={title}
          onChange={(event) => scheduleSave(event.target.value)}
          required
          className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-3 text-base text-white outline-none focus:border-[#ff453a] sm:text-sm"
        />
      </label>
    </SectionTitleButton>
  );
}
