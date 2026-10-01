"use server";

import { validateAdminPassword, setAdminSession, clearAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { activityLogs } from "@/lib/schema";

export type LoginResult = {
  success: boolean;
  error?: string;
};

export async function loginAdminAction(password: string): Promise<LoginResult> {
  try {
    const isValid = await validateAdminPassword(password);
    if (!isValid) {
      return { success: false, error: "Password admin salah. Akses ditolak." };
    }

    await setAdminSession();

    // Log successful login
    try {
      await db.insert(activityLogs).values({
        action: "LOGIN",
        target: "Admin Session",
        details: "Admin successfully authenticated",
      });
    } catch {
      // Ignore log failure
    }

    return { success: true };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Terjadi kesalahan autentikasi";
    return { success: false, error };
  }
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    await clearAdminSession();
    return { success: true };
  } catch {
    return { success: false };
  }
}
