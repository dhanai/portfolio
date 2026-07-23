"use client";

import { useCallback, useState, type DragEvent, type ReactNode } from "react";

type FileDropZoneProps = {
  accept?: string;
  disabled?: boolean;
  onFile: (file: File) => void | Promise<void>;
  className?: string;
  children: ReactNode;
};

function acceptMatches(file: File, accept?: string) {
  if (!accept) return true;
  const tokens = accept.split(",").map((token) => token.trim().toLowerCase());
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return tokens.some((token) => {
    if (token.endsWith("/*")) {
      return mime.startsWith(token.slice(0, -1));
    }
    if (token.startsWith(".")) {
      return name.endsWith(token);
    }
    return mime === token;
  });
}

export function FileDropZone({
  accept,
  disabled,
  onFile,
  className = "",
  children,
}: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false);

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setDragging(true);
    },
    [disabled],
  );

  const onDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  }, []);

  const onDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(false);
      if (disabled) return;

      const file = event.dataTransfer.files?.[0];
      if (!file) return;
      if (!acceptMatches(file, accept)) return;
      await onFile(file);
    },
    [accept, disabled, onFile],
  );

  return (
    <div
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`${className} ${
        dragging
          ? "border-[#ff453a] bg-[#ff453a]/10"
          : "border-white/15 bg-[#0a0a0a]"
      } border border-dashed transition-colors`}
    >
      {children}
    </div>
  );
}

export function assignFileToInput(
  input: HTMLInputElement | null,
  file: File,
) {
  if (!input) return;
  const transfer = new DataTransfer();
  transfer.items.add(file);
  input.files = transfer.files;
}
