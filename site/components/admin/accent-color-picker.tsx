"use client";

import { useEffect, useRef, useState } from "react";
import { accentColors } from "@/lib/site-config";
import { notifyFormChanged } from "@/lib/admin/reorder-list";

const STORAGE_KEY = "portfolio-admin-recent-accent-colors";
const MAX_RECENT = 8;

const HEX6 = new RegExp("^#[0-9a-fA-F]{6}$");
const HEX6_NO_HASH = new RegExp("^[0-9a-fA-F]{6}$");
const HEX3 = new RegExp("^#[0-9a-fA-F]{3}$");

const PRESET_COLORS = [
  accentColors.takeout,
  accentColors.fulfillment,
  accentColors.margenie,
  accentColors.parfade,
  accentColors.studio,
  accentColors.doomsy,
  accentColors.petshirts,
  "#FF375F",
  "#AC8E68",
];

function normalizeHex(value: string) {
  const trimmed = value.trim();
  if (HEX6.test(trimmed)) return trimmed.toUpperCase();
  if (HEX6_NO_HASH.test(trimmed)) return `#${trimmed.toUpperCase()}`;
  if (HEX3.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return null;
}

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => (typeof item === "string" ? normalizeHex(item) : null))
      .filter((item): item is string => Boolean(item));
  } catch {
    return [];
  }
}

function rememberColor(hex: string) {
  const next = [hex, ...loadRecent().filter((color) => color !== hex)].slice(
    0,
    MAX_RECENT,
  );
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function AccentColorPicker({
  name = "color",
  defaultValue = accentColors.default,
  label = "Accent color",
}: {
  name?: string;
  defaultValue?: string;
  label?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef(normalizeHex(defaultValue) ?? accentColors.default);
  const initial = normalizeHex(defaultValue) ?? accentColors.default;
  const [color, setColor] = useState(initial);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;

    function onSaved() {
      const normalized = normalizeHex(colorRef.current);
      if (!normalized) return;
      setRecent(rememberColor(normalized));
    }

    form.addEventListener("adminform:saved", onSaved);
    return () => form.removeEventListener("adminform:saved", onSaved);
  }, []);

  function applyColor(nextRaw: string, source?: HTMLElement | null) {
    const next = normalizeHex(nextRaw);
    if (!next) return;
    setColor(next);
    if (source) notifyFormChanged(source);
  }

  const swatches = [
    ...PRESET_COLORS,
    ...recent.filter((item) => !PRESET_COLORS.includes(item)),
  ].slice(0, PRESET_COLORS.length + MAX_RECENT);

  return (
    <div ref={rootRef} className="block">
      <span className="text-xs uppercase tracking-wider text-[#737373]">
        {label}
      </span>

      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={HEX6.test(color) ? color : initial}
          onChange={(e) => applyColor(e.target.value, e.target)}
          className="h-10 w-14 cursor-pointer border border-white/10 bg-[#0a0a0a] p-1"
          aria-label="Pick accent color"
        />
        <input
          type="text"
          name={name}
          value={color}
          onChange={(e) => {
            const next = e.target.value.toUpperCase();
            setColor(next);
            if (normalizeHex(next)) notifyFormChanged(e.target);
          }}
          onBlur={(e) => {
            const normalized = normalizeHex(e.target.value);
            setColor(normalized ?? initial);
          }}
          spellCheck={false}
          className="w-32 border border-white/10 bg-[#0a0a0a] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#ff453a]"
        />
        <span
          className="h-10 w-10 border border-white/10"
          style={{ backgroundColor: normalizeHex(color) ?? color }}
          aria-hidden="true"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {swatches.map((swatch) => {
          const active = normalizeHex(color) === swatch;
          return (
            <button
              key={swatch}
              type="button"
              title={swatch}
              onClick={(e) => applyColor(swatch, e.currentTarget)}
              className={`h-7 w-7 border transition-transform hover:scale-110 ${
                active ? "border-white" : "border-white/20"
              }`}
              style={{ backgroundColor: swatch }}
              aria-label={`Use accent color ${swatch}`}
            />
          );
        })}
      </div>

      {recent.length > 0 && (
        <p className="mt-2 text-xs text-[#525252]">
          Recent colors are saved after a successful save.
        </p>
      )}
    </div>
  );
}
