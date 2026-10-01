import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const tools = sqliteTable("tools", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull().default("Creative"),
  icon: text("icon").notNull().default("Sparkles"),
  badge: text("badge"),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("published"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;
