"use server";

import { db } from "@/lib/db";
import {
  tools,
  activityLogs,
  studioSettings,
  type Tool,
  type NewTool,
  type ActivityLog,
  type StudioSetting,
} from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Ignore when running outside Next.js request context
  }
}

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Log action helper
async function logActivity(action: string, target: string, details?: string) {
  try {
    await db.insert(activityLogs).values({
      action,
      target,
      details,
    });
  } catch {
    // Non-blocking log error
  }
}

// ---------------- Tools CRUD ----------------

export async function getTools(): Promise<ActionResult<Tool[]>> {
  try {
    const allTools = await db.select().from(tools).orderBy(desc(tools.id));
    return { success: true, data: allTools };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to fetch tools";
    return { success: false, error };
  }
}

export async function createTool(formData: {
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  badge?: string;
  status: "draft" | "published";
}): Promise<ActionResult<Tool>> {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return { success: false, error: "Akses ditolak. Sesi admin belum terautentikasi." };
    }

    const cleanSlug = formData.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, "-");

    // Check if slug already exists
    const existing = await db.select().from(tools).where(eq(tools.slug, cleanSlug)).limit(1);
    if (existing.length > 0) {
      return { success: false, error: `Tool dengan slug "${cleanSlug}" sudah ada.` };
    }

    const inserted = await db
      .insert(tools)
      .values({
        name: formData.name.trim(),
        slug: cleanSlug,
        description: formData.description.trim(),
        category: formData.category.trim() || "Creative",
        icon: formData.icon.trim() || "Sparkles",
        badge: formData.badge?.trim() || null,
        status: formData.status,
      })
      .returning();

    await logActivity("CREATE", `Tool: ${formData.name}`, `Kategori: ${formData.category}, Status: ${formData.status}`);

    safeRevalidate("/admin");
    safeRevalidate("/");
    return { success: true, data: inserted[0] };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to create tool";
    return { success: false, error };
  }
}

export async function updateTool(
  id: number,
  formData: {
    name: string;
    slug: string;
    description: string;
    category: string;
    icon: string;
    badge?: string;
    status: "draft" | "published";
  }
): Promise<ActionResult<Tool>> {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return { success: false, error: "Akses ditolak. Sesi admin belum terautentikasi." };
    }

    const cleanSlug = formData.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, "-");

    const existing = await db.select().from(tools).where(eq(tools.slug, cleanSlug)).limit(1);
    if (existing.length > 0 && existing[0].id !== id) {
      return { success: false, error: `Slug "${cleanSlug}" telah digunakan oleh tool lain.` };
    }

    const updated = await db
      .update(tools)
      .set({
        name: formData.name.trim(),
        slug: cleanSlug,
        description: formData.description.trim(),
        category: formData.category.trim() || "Creative",
        icon: formData.icon.trim() || "Sparkles",
        badge: formData.badge?.trim() || null,
        status: formData.status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tools.id, id))
      .returning();

    await logActivity("UPDATE", `Tool #${id}: ${formData.name}`, `Pembaruan data konfigurasi tool`);

    safeRevalidate("/admin");
    safeRevalidate("/");
    return { success: true, data: updated[0] };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to update tool";
    return { success: false, error };
  }
}

export async function deleteTool(id: number): Promise<ActionResult<boolean>> {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return { success: false, error: "Akses ditolak. Sesi admin belum terautentikasi." };
    }

    const found = await db.select().from(tools).where(eq(tools.id, id)).limit(1);
    const toolName = found[0]?.name || `#${id}`;

    await db.delete(tools).where(eq(tools.id, id));
    await logActivity("DELETE", `Tool #${id}: ${toolName}`, "Tool dihapus secara permanen");

    safeRevalidate("/admin");
    safeRevalidate("/");
    return { success: true, data: true };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to delete tool";
    return { success: false, error };
  }
}

export async function toggleToolStatus(id: number): Promise<ActionResult<Tool>> {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return { success: false, error: "Akses ditolak. Sesi admin belum terautentikasi." };
    }

    const found = await db.select().from(tools).where(eq(tools.id, id)).limit(1);
    if (!found || found.length === 0) {
      return { success: false, error: "Tool not found" };
    }

    const current = found[0];
    const newStatus = current.status === "published" ? "draft" : "published";

    const updated = await db
      .update(tools)
      .set({
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tools.id, id))
      .returning();

    await logActivity(
      "TOGGLE_STATUS",
      `Tool: ${current.name}`,
      `Status diubah menjadi: ${newStatus.toUpperCase()}`
    );

    safeRevalidate("/admin");
    safeRevalidate("/");
    return { success: true, data: updated[0] };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to toggle status";
    return { success: false, error };
  }
}

export async function seedDefaultTools(): Promise<ActionResult<Tool[]>> {
  try {
    const existing = await db.select().from(tools);
    if (existing.length > 0) {
      return { success: true, data: existing };
    }

    const defaultTools: Omit<NewTool, "id" | "createdAt" | "updatedAt">[] = [
      {
        name: "PRD Maker",
        slug: "prd-maker",
        description: "Generator dokumen spesifikasi produk enterprise yang terstruktur rapi dari ide atau prompt sederhana.",
        category: "Product Management",
        icon: "FileText",
        badge: "Essential",
        status: "published",
      },
      {
        name: "Vibe Design UI/UX Maker",
        slug: "vibe-design",
        description: "Asisten desain AI dengan referensi visual, live preview komponen, dan export JSON yang siap dipindah ke Figma.",
        category: "UI/UX Design",
        icon: "Palette",
        badge: "Featured",
        status: "published",
      },
    ];

    const inserted = await db.insert(tools).values(defaultTools).returning();
    await logActivity("SEED", "Default Tools", "Inisialisasi 2 tool bawaan PRD Maker & Vibe Design");

    safeRevalidate("/admin");
    safeRevalidate("/");
    return { success: true, data: inserted };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to seed default tools";
    return { success: false, error };
  }
}

// ---------------- Activity Logs ----------------

export async function getActivityLogs(): Promise<ActionResult<ActivityLog[]>> {
  try {
    const logs = await db.select().from(activityLogs).orderBy(desc(activityLogs.id)).limit(50);
    return { success: true, data: logs };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to fetch logs";
    return { success: false, error };
  }
}

// ---------------- Studio Settings ----------------

const DEFAULT_SETTINGS: Record<string, string> = {
  studio_name: "Novasco Digital Studio",
  studio_tagline: "Empowering Creative Minds with AI-Driven Modular Tools",
  primary_model: "GPT-4o / Claude 3.5 Sonnet",
  maintenance_mode: "false",
  contact_email: "support@novascostudio.com",
};

export async function getStudioSettings(): Promise<ActionResult<Record<string, string>>> {
  try {
    const rows = await db.select().from(studioSettings);
    const map: Record<string, string> = { ...DEFAULT_SETTINGS };
    rows.forEach((r) => {
      map[r.key] = r.value;
    });
    return { success: true, data: map };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to fetch settings";
    return { success: false, error };
  }
}

export async function updateStudioSettings(
  newSettings: Record<string, string>
): Promise<ActionResult<boolean>> {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return { success: false, error: "Akses ditolak. Sesi admin belum terautentikasi." };
    }

    for (const [key, value] of Object.entries(newSettings)) {
      const existing = await db.select().from(studioSettings).where(eq(studioSettings.key, key)).limit(1);
      if (existing.length > 0) {
        await db
          .update(studioSettings)
          .set({ value, updatedAt: new Date().toISOString() })
          .where(eq(studioSettings.key, key));
      } else {
        await db.insert(studioSettings).values({ key, value });
      }
    }

    await logActivity("SETTINGS_UPDATE", "Studio Preferences", "Pengaturan studio diperbarui");
    safeRevalidate("/admin");
    safeRevalidate("/");
    return { success: true, data: true };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to save settings";
    return { success: false, error };
  }
}
