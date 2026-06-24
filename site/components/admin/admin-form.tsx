"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useToast } from "@/components/toast";
import { serializeForm } from "@/lib/admin/serialize-form";
import type { ActionResult } from "@/lib/admin/types";

type AdminFormContextValue = {
  isDirty: boolean;
  alwaysEnableSubmit: boolean;
  isPreparing: boolean;
};

const AdminFormContext = createContext<AdminFormContextValue>({
  isDirty: false,
  alwaysEnableSubmit: false,
  isPreparing: false,
});

export function useAdminForm() {
  return useContext(AdminFormContext);
}

type AdminFormProps = {
  action: (formData: FormData) => Promise<ActionResult | void>;
  successMessage?: string;
  unchangedMessage?: string;
  alwaysEnableSubmit?: boolean;
  prepareSubmit?: (form: HTMLFormElement) => Promise<void>;
  className?: string;
  children: React.ReactNode;
};

export function AdminForm({
  action,
  successMessage = "Saved",
  unchangedMessage = "No changes to save",
  alwaysEnableSubmit = false,
  prepareSubmit,
  className,
  children,
}: AdminFormProps) {
  const { success, error: toastError, info } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const baselineRef = useRef("");
  const [isDirty, setIsDirty] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const syncDirty = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    setIsDirty(serializeForm(form) !== baselineRef.current);
  }, []);

  const resetBaseline = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    baselineRef.current = serializeForm(form);
    setIsDirty(false);
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    baselineRef.current = serializeForm(form);
  }, []);

  const [, formAction] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => {
      try {
        const result = await action(formData);

        if (result && "error" in result) {
          toastError(result.error);
          return result;
        }

        if (result && "unchanged" in result) {
          info(unchangedMessage);
          return result;
        }

        if (result && "ok" in result) {
          success(successMessage);
          resetBaseline();
          return result;
        }

        success(successMessage);
        resetBaseline();
        return { ok: true as const };
      } catch (err) {
        if (isRedirectError(err)) throw err;
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        toastError(message);
        return { error: message };
      }
    },
    null,
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (!prepareSubmit) return;

      event.preventDefault();
      const form = event.currentTarget;

      setIsPreparing(true);
      try {
        await prepareSubmit(form);
        formAction(new FormData(form));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not prepare save";
        toastError(message);
      } finally {
        setIsPreparing(false);
      }
    },
    [formAction, prepareSubmit, toastError],
  );

  return (
    <AdminFormContext.Provider
      value={{ isDirty, alwaysEnableSubmit, isPreparing }}
    >
      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        className={className}
        onInput={syncDirty}
        onChange={syncDirty}
      >
        {children}
      </form>
    </AdminFormContext.Provider>
  );
}
