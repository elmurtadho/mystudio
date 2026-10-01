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

export const activityLogs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(), // CREATE, UPDATE, DELETE, TOGGLE_STATUS, LOGIN, SETTINGS_UPDATE
  target: text("target").notNull(),
  details: text("details"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const studioSettings = sqliteTable("studio_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type StudioSetting = typeof studioSettings.$inferSelect;
export type NewStudioSetting = typeof studioSettings.$inferInsert;
