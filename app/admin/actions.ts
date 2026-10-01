"use server";

import { db } from "@/lib/db";
import { tools, type Tool, type NewTool } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
    const cleanSlug = formData.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, "-");
    
    // Check if slug already exists
    const existing = await db.select().from(tools).where(eq(tools.slug, cleanSlug)).limit(1);
    if (existing.length > 0) {
      return { success: false, error: `Tool with slug "${cleanSlug}" already exists.` };
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
    const cleanSlug = formData.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, "-");

    // Check slug collision with other records
    const existing = await db.select().from(tools).where(eq(tools.slug, cleanSlug)).limit(1);
    if (existing.length > 0 && existing[0].id !== id) {
      return { success: false, error: `Slug "${cleanSlug}" is already in use by another tool.` };
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
    await db.delete(tools).where(eq(tools.id, id));
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
    safeRevalidate("/admin");
    safeRevalidate("/");
    return { success: true, data: inserted };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Failed to seed default tools";
    return { success: false, error };
  }
}
