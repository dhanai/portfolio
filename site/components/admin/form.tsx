export function AdminField({
  label,
  name,
  defaultValue = "",
  type = "text",
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-[#737373]">
        {label}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
      />
      {hint && <p className="mt-1 text-xs text-[#525252]">{hint}</p>}
    </label>
  );
}

export function AdminTextarea({
  label,
  name,
  defaultValue = "",
  rows = 4,
  hint,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-[#737373]">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
        className="mt-1.5 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#ff453a]"
      />
      {hint && <p className="mt-1 text-xs text-[#525252]">{hint}</p>}
    </label>
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#a3a3a3]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="accent-[#ff453a]"
      />
      {label}
    </label>
  );
}

export function AdminSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-white/10 p-6">
      <h2 className="text-sm font-medium text-white">{title}</h2>
      <div className="mt-6 grid gap-4">{children}</div>
    </section>
  );
}

export { AdminSubmit } from "@/components/admin/admin-submit";
