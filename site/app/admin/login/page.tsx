import { loginAction } from "@/lib/admin/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6">
      <form
        action={loginAction}
        className="w-full max-w-sm border border-white/10 bg-[#111] p-8"
      >
        <p className="text-xs uppercase tracking-wider text-[#737373]">
          Portfolio CMS
        </p>
        <h1 className="mt-2 text-xl font-medium text-white">Sign in</h1>
        {error && (
          <p className="mt-4 text-sm text-[#ff453a]">Invalid password</p>
        )}
        <label className="mt-8 block">
          <span className="text-xs uppercase tracking-wider text-[#737373]">
            Password
          </span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="mt-2 w-full border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white outline-none focus:border-[#ff453a]"
          />
        </label>
        <button
          type="submit"
          className="mt-6 w-full bg-white py-2.5 text-sm font-medium text-black hover:opacity-90"
        >
          Enter admin
        </button>
        <p className="mt-6 text-xs text-[#525252]">
          Default password is set via ADMIN_PASSWORD in .env
        </p>
      </form>
    </div>
  );
}
