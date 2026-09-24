"use client";

import { useEffect, useId, useRef, useState } from "react";
import { sanitizeRichText } from "@/lib/rich-text";

type FormatCommand =
  | "bold"
  | "italic"
  | "underline"
  | "insertUnorderedList"
  | "insertOrderedList";

function ToolbarButton({
  label,
  active,
  onMouseDown,
  children,
}: {
  label: string;
  active?: boolean;
  onMouseDown: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(event) => {
        event.preventDefault();
        onMouseDown();
      }}
      className={`min-w-8 px-2 py-1.5 text-xs font-medium ${
        active
          ? "bg-white text-black"
          : "text-[#a3a3a3] hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export function SimpleRichTextEditor({
  name,
  label,
  defaultValue = "",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  const editorId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(() => sanitizeRichText(defaultValue));
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    bullet: false,
    number: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const initial = sanitizeRichText(defaultValue);
    if (el.innerHTML !== initial) {
      el.innerHTML = initial || "";
    }
  }, [defaultValue]);

  function syncFromEditor() {
    const next = sanitizeRichText(ref.current?.innerHTML ?? "");
    setHtml(next);
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      bullet: document.queryCommandState("insertUnorderedList"),
      number: document.queryCommandState("insertOrderedList"),
    });
  }

  function run(command: FormatCommand) {
    ref.current?.focus();
    document.execCommand(command, false);
    syncFromEditor();
  }

  return (
    <div>
      <label
        htmlFor={editorId}
        className="text-xs uppercase tracking-wider text-[#737373]"
      >
        {label}
      </label>
      <div className="mt-1.5 overflow-hidden border border-white/10">
        <div className="flex flex-wrap gap-0.5 border-b border-white/10 bg-black/40 p-1">
          <ToolbarButton
            label="Bold"
            active={active.bold}
            onMouseDown={() => run("bold")}
          >
            <span className="font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={active.italic}
            onMouseDown={() => run("italic")}
          >
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            active={active.underline}
            onMouseDown={() => run("underline")}
          >
            <span className="underline">U</span>
          </ToolbarButton>
          <span aria-hidden className="mx-1 w-px self-stretch bg-white/10" />
          <ToolbarButton
            label="Bullet list"
            active={active.bullet}
            onMouseDown={() => run("insertUnorderedList")}
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={active.number}
            onMouseDown={() => run("insertOrderedList")}
          >
            1. List
          </ToolbarButton>
        </div>
        <div
          id={editorId}
          ref={ref}
          role="textbox"
          aria-multiline
          contentEditable
          suppressContentEditableWarning
          onInput={syncFromEditor}
          onBlur={syncFromEditor}
          onKeyUp={syncFromEditor}
          onMouseUp={syncFromEditor}
          className="min-h-[8rem] bg-[#0a0a0a] px-3 py-2 text-sm leading-relaxed text-white outline-none [&_b]:font-semibold [&_strong]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-0.5"
        />
      </div>
      <input type="hidden" name={name} value={html} readOnly />
      {hint ? <p className="mt-1 text-xs text-[#525252]">{hint}</p> : null}
    </div>
  );
}
