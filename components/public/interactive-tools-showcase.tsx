"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  Eye,
  X,
  FileText,
  Palette,
  CheckCircle2,
  Code2,
} from "lucide-react";
import type { Tool } from "@/lib/schema";
import { IconRenderer } from "@/components/admin/icon-helper";

interface InteractiveToolsShowcaseProps {
  tools: Tool[];
}

export function InteractiveToolsShowcase({ tools }: InteractiveToolsShowcaseProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewTool, setPreviewTool] = useState<Tool | null>(null);

  const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];

  const filtered = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase()) ||
      tool.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || tool.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="tools" className="space-y-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Katalog Studio AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Peralatan Cerdas untuk Kreator & Product Leader
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Pilih dari rangkaian tool AI terkurasi. Setiap tool dirancang khusus untuk memotong waktu iterasi produk dan desain.
          </p>
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari tool atau kapabilitas..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of Tools */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tool) => (
            <div
              key={tool.id}
              className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all duration-200 ease-in-out hover:shadow-[0_0_25px_rgba(99,102,241,0.12)] flex flex-col justify-between"
            >
              <div>
                {/* Header Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <IconRenderer icon={tool.icon} className="h-5 w-5" />
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Category & Title */}
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {tool.category}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
                  {tool.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTool(tool)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-all"
                >
                  <Eye className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Pratinjau</span>
                </button>

                <Link
                  href={`/tools/${tool.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all group-hover:shadow-[0_0_15px_rgba(99,102,241,0.35)]"
                >
                  <span>Buka Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
          <Layers className="h-8 w-8 text-indigo-400 mx-auto" />
          <p className="text-sm text-slate-300 font-semibold">Tidak ada tool yang cocok</p>
          <p className="text-xs text-slate-500">
            Coba gunakan kata kunci pencarian lain atau pilih kategori Semua.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
            }}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300 hover:text-white transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Interactive Quick Preview Modal */}
      {previewTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <IconRenderer icon={previewTool.icon} className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {previewTool.name}
                  </h3>
                  <span className="text-xs text-indigo-400 font-mono">
                    /tools/{previewTool.slug}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTool(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {previewTool.description}
            </p>

            {/* Simulated Live Capabilities Preview */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Kapabilitas Workspace AI</span>
              </span>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Prompt-to-specification engine dengan standar enterprise</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Streaming response instan dengan Vercel AI SDK</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Export format siap pakai (JSON, Markdown, & Task Breakdown)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewTool(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                Tutup
              </button>
              <Link
                href={`/tools/${previewTool.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all"
              >
                <span>Buka Workspace Sekarang</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
