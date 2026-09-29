"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Danger styles the confirm action in red. */
  tone?: "default" | "danger";
};

export type AlertOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
};

type DialogState = {
  mode: "confirm" | "alert";
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  tone: "default" | "danger";
  resolve: (value: boolean) => void;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  alert: (options: AlertOptions) => Promise<void>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const dialogRef = useRef<DialogState | null>(null);
  dialogRef.current = dialog;

  const settle = useCallback((value: boolean) => {
    const current = dialogRef.current;
    if (!current) return;
    dialogRef.current = null;
    setDialog(null);
    current.resolve(value);
  }, []);

  const open = useCallback((next: DialogState) => {
    const current = dialogRef.current;
    if (current) current.resolve(false);
    dialogRef.current = next;
    setDialog(next);
  }, []);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        open({
          mode: "confirm",
          title: options.title,
          message: options.message,
          confirmLabel: options.confirmLabel ?? "Confirm",
          cancelLabel: options.cancelLabel ?? "Cancel",
          tone: options.tone ?? "default",
          resolve,
        });
      }),
    [open],
  );

  const alert = useCallback(
    (options: AlertOptions) =>
      new Promise<void>((resolve) => {
        open({
          mode: "alert",
          title: options.title,
          message: options.message,
          confirmLabel: options.confirmLabel ?? "OK",
          cancelLabel: "",
          tone: "default",
          resolve: () => resolve(),
        });
      }),
    [open],
  );

  return (
    <ConfirmContext.Provider value={{ confirm, alert }}>
      {children}
      <ConfirmDialog dialog={dialog} onSettle={settle} />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return ctx;
}

function ConfirmDialog({
  dialog,
  onSettle,
}: {
  dialog: DialogState | null;
  onSettle: (value: boolean) => void;
}) {
  const titleId = useId();
  const messageId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!dialog) return;
    const alertOnly = dialog.mode === "alert";
    confirmRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onSettle(alertOnly);
      } else if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        onSettle(true);
      }
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [dialog, onSettle]);

  if (!mounted || !dialog) return null;

  const danger = dialog.tone === "danger";

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-black/75 p-4 sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onSettle(dialog.mode === "alert");
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={dialog.message ? messageId : undefined}
        className="w-full max-w-md border border-white/15 bg-[#0a0a0a] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
      >
        <h2 id={titleId} className="text-base font-medium text-white">
          {dialog.title}
        </h2>
        {dialog.message ? (
          <p id={messageId} className="mt-2 text-sm leading-relaxed text-[#a3a3a3]">
            {dialog.message}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          {dialog.mode === "confirm" ? (
            <button
              type="button"
              onClick={() => onSettle(false)}
              className="border border-white/20 px-4 py-2 text-sm text-[#a3a3a3] transition-colors hover:border-white/40 hover:text-white"
            >
              {dialog.cancelLabel}
            </button>
          ) : null}
          <button
            ref={confirmRef}
            type="button"
            onClick={() => onSettle(true)}
            className={
              danger
                ? "bg-[#ff453a] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                : "bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
            }
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
