import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "novasco_admin_session";
const SESSION_SECRET = process.env.ADMIN_PASSWORD || "novasco-studio-2026";
const SALT = "novasco-super-secure-salt-2026";

function generateSessionToken(): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(SALT).digest("hex");
}

export async function validateAdminPassword(password: string): Promise<boolean> {
  const currentPassword = process.env.ADMIN_PASSWORD || "novasco-studio-2026";
  return password === currentPassword;
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = generateSessionToken();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return false;
  }

  const expectedToken = generateSessionToken();
  return sessionCookie.value === expectedToken;
}
