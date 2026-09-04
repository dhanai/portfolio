"use server";

import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import {
  getAdminPassword,
  sessionOptions,
  type AdminSession,
} from "@/lib/auth/session";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password !== getAdminPassword()) {
    redirect("/admin/login?error=1");
  }
  const session = await getIronSession<AdminSession>(
    await cookies(),
    sessionOptions,
  );
  session.isLoggedIn = true;
  await session.save();
  redirect("/admin");
}

export async function logoutAction() {
  const session = await getIronSession<AdminSession>(
    await cookies(),
    sessionOptions,
  );
  session.isLoggedIn = false;
  await session.save();
  redirect("/admin/login");
}
