"use client";

import React from "react";
import {
  Layers,
  Globe,
  EyeOff,
  Activity,
  Zap,
  Server,
  TrendingUp,
  ShieldCheck,
  Tag,
  Sparkles,
} from "lucide-react";
import type { Tool, ActivityLog } from "@/lib/schema";

interface AnalyticsViewProps {
  tools: Tool[];
  logs: ActivityLog[];
  onOpenNewTool: () => void;
}

export function AnalyticsView({ tools, logs, onOpenNewTool }: AnalyticsViewProps) {
  const total = tools.length;
  const published = tools.filter((t) => t.status === "published").length;
  const drafts = total - published;
  const publishedPercent = total > 0 ? Math.round((published / total) * 100) : 0;

  // Category counts
  const categoryCounts = tools.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Top Banner KPI */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-violet-950/40 border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
              Turso Edge Database: Connected
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Studio Engine Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Pemantauan langsung ekosistem modular tool, integritas data, dan aktivitas admin.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewTool}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all hover:scale-[1.02]"
        >
          <Sparkles className="h-4 w-4" />
          <span>Tambah Tool Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Tools</span>
            <Layers className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-white">{total}</p>
            <span className="text-xs text-slate-400">terdaftar</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Published</span>
            <Globe className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-emerald-400">{published}</p>
            <span className="text-xs text-slate-400">({publishedPercent}%)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Draft Mode</span>
            <EyeOff className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-amber-400">{drafts}</p>
            <span className="text-xs text-slate-400">sembunyi</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Aktivitas Audit</span>
            <Activity className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-violet-400">{logs.length}</p>
            <span className="text-xs text-slate-400">event tercatat</span>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-indigo-400" />
              <span>Distribusi Kategori Tool</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {Object.keys(categoryCounts).length} Kategori
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="text-slate-500 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Infrastructure & Edge Health */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-400" />
              <span>Infrastruktur & Edge Network</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Optimal
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">Database Engine</span>
              <span className="font-mono text-white">Turso LibSQL (AWS Tokyo)</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">ORM Framework</span>
              <span className="font-mono text-white">Drizzle ORM v0.45</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">Framework Runtime</span>
              <span className="font-mono text-white">Next.js 16 (App Router + Turbopack)</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">Deployment Edge</span>
              <span className="font-mono text-white">Vercel Global CDN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
