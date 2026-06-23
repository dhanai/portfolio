import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  defaultSession,
  type AdminSession,
  sessionOptions,
} from "@/lib/auth/session";

export async function getAdminSession() {
  const session = await getIronSession<AdminSession>(
    await cookies(),
    sessionOptions,
  );
  if (!session.isLoggedIn) {
    return { ...defaultSession, ...session };
  }
  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }
  return session;
}
