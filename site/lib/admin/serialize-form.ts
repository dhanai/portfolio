export function serializeForm(form: HTMLFormElement): string {
  const entries: Record<string, string> = {};

  for (const el of form.elements) {
    if (
      !(el instanceof HTMLInputElement) &&
      !(el instanceof HTMLTextAreaElement) &&
      !(el instanceof HTMLSelectElement)
    ) {
      continue;
    }

    const name = el.name;
    if (!name) continue;

    if (el instanceof HTMLInputElement) {
      if (el.type === "checkbox") {
        entries[name] = el.checked ? "on" : "off";
        continue;
      }
      if (el.type === "file") {
        entries[name] = el.files?.length
          ? `file:${el.files[0]?.name ?? "selected"}`
          : "";
        continue;
      }
      if (el.type === "radio") {
        if (el.checked) entries[name] = el.value;
        continue;
      }
    }

    entries[name] = el.value;
  }

  const sorted = Object.keys(entries)
    .sort()
    .map((key) => [key, entries[key]] as const);

  return JSON.stringify(sorted);
}
