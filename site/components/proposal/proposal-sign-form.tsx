"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { signProposalAction } from "@/lib/proposal-sign-action";

type Mode = "type" | "draw";

const p = "text-sm leading-relaxed text-[#3d4a55]";
const inputClass =
  "w-full border border-[#1a2229]/20 bg-white/70 px-3 py-2.5 text-sm text-[#12181e] outline-none transition-colors focus:border-[#1fa89a]";

/** Exported signature width/height in px; keeps the stored PNG small. */
const EXPORT_W = 600;
const EXPORT_H = 180;

export function ProposalSignForm({
  token,
  defaultName,
  consentText,
}: {
  token: string;
  defaultName: string;
  consentText: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("type");
  const [name, setName] = useState(defaultName);
  const [consent, setConsent] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#12181e";
    setHasInk(false);
  }, []);

  useEffect(() => {
    if (mode !== "draw") return;
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [mode, setupCanvas]);

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
    const ctx = e.currentTarget.getContext("2d");
    if (ctx && last.current) {
      ctx.beginPath();
      ctx.arc(last.current.x, last.current.y, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = "#12181e";
      ctx.fill();
    }
    setHasInk(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const next = point(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last.current = next;
  }

  function onPointerUp() {
    drawing.current = false;
    last.current = null;
  }

  function exportSignature(): string | null {
    const canvas = canvasRef.current;
    if (!canvas || !hasInk) return null;
    const out = document.createElement("canvas");
    out.width = EXPORT_W;
    out.height = EXPORT_H;
    const ctx = out.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(canvas, 0, 0, EXPORT_W, EXPORT_H);
    return out.toDataURL("image/png");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError("Enter your full name");
      return;
    }
    if (mode === "draw" && !hasInk) {
      setError("Draw your signature, or switch to Type");
      return;
    }
    if (!consent) {
      setError("Please agree to sign electronically");
      return;
    }

    const formData = new FormData();
    formData.set("token", token);
    formData.set("signerName", name);
    formData.set("consent", "on");
    if (mode === "draw") {
      const image = exportSignature();
      if (image) formData.set("signatureImage", image);
    }

    startTransition(async () => {
      const result = await signProposalAction(formData);
      if (result && "error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  const tab = (value: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(value)}
      aria-pressed={mode === value}
      className={`border-b pb-1 text-sm transition-colors ${
        mode === value
          ? "border-[#12181e] text-[#12181e]"
          : "border-transparent text-[#6b7c8a] hover:text-[#12181e]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="signerName" className="text-sm font-medium text-[#12181e]">
          Full name
        </label>
        <input
          id="signerName"
          name="signerName"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputClass} mt-2`}
          maxLength={120}
          required
        />
      </div>

      <div>
        <div className="flex items-center gap-5">
          <span className="text-sm font-medium text-[#12181e]">Signature</span>
          {tab("type", "Type")}
          {tab("draw", "Draw")}
        </div>

        {mode === "type" ? (
          <div className="mt-3 flex h-28 items-center border border-[#1a2229]/20 bg-white/70 px-5">
            <p
              className="truncate font-serif text-3xl italic text-[#12181e]"
              aria-live="polite"
            >
              {name.trim() || "Your name"}
            </p>
          </div>
        ) : (
          <div className="mt-3">
            <canvas
              ref={canvasRef}
              aria-label="Draw your signature"
              className="block h-28 w-full cursor-crosshair touch-none border border-[#1a2229]/20 bg-white/70"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              onPointerCancel={onPointerUp}
            />
            <div className="mt-2 flex justify-between">
              <p className="text-xs text-[#6b7c8a]">
                Sign with your mouse, trackpad, or finger.
              </p>
              <button
                type="button"
                onClick={setupCanvas}
                className="text-xs text-[#3d4a55] underline-offset-2 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#1fa89a]"
        />
        <span className={p}>{consentText}</span>
      </label>

      {error ? (
        <p className="text-sm text-[#9f1239]" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center bg-[#12181e] px-6 py-3 text-sm font-medium text-[#eef2f4] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing…" : "Sign and accept proposal"}
      </button>
    </form>
  );
}
