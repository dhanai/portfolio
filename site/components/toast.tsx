"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ToastType = "success" | "error" | "info";

type Toast = {
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  dismiss: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const dismiss = useCallback(() => setToast(null), []);

  const show = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  const success = useCallback(
    (message: string) => show(message, "success"),
    [show],
  );
  const error = useCallback(
    (message: string) => show(message, "error"),
    [show],
  );
  const info = useCallback((message: string) => show(message, "info"), [show]);

  const value = useMemo(
    () => ({ show, success, error, info, dismiss }),
    [show, success, error, info, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toast={toast} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toast,
  onDismiss,
}: {
  toast: Toast | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 right-6 z-[100] w-full max-w-sm px-6 sm:px-0"
    >
      <ToastItem toast={toast} onDismiss={onDismiss} />
    </div>
  );
}

const toastStyles: Record<ToastType, string> = {
  success: "border-[#30D158]/40",
  error: "border-accent/50",
  info: "border-white/20",
};

const dotStyles: Record<ToastType, string> = {
  success: "bg-[#30D158]",
  error: "bg-accent",
  info: "bg-white/60",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      className={`toast-enter pointer-events-auto flex items-start gap-3 border bg-[#0a0a0a] px-4 py-3 text-sm text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${toastStyles[toast.type]}`}
    >
      <span
        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotStyles[toast.type]}`}
        aria-hidden="true"
      />
      <p className="flex-1 leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-xs uppercase tracking-wider text-[#737373] transition-colors hover:text-white"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
