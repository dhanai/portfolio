import type { SessionOptions } from "iron-session";

export type AdminSession = {
  isLoggedIn: boolean;
};

export const defaultSession: AdminSession = {
  isLoggedIn: false,
};

export function getSessionPassword() {
  const secret =
    process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "dev-only-change-me";
  return secret.padEnd(32, "0").slice(0, 32);
}

export const sessionOptions: SessionOptions = {
  password: getSessionPassword(),
  cookieName: "portfolio-admin-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  },
};

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "portfolio-admin";
}
