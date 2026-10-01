"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Box, Globe, EyeOff, Tag } from "lucide-react";
import type { Tool } from "@/lib/schema";

interface AdminHeaderProps {
  tools: Tool[];
}

export function AdminHeader({ tools }: AdminHeaderProps) {
  const total = tools.length;
  const published = tools.filter((t) => t.status === "published").length;
  const drafts = total - published;
  const categoriesCount = new Set(tools.map((t) => t.category)).size;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Public Hub</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Admin Studio Management</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Turso Edge CRUD
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Kelola seluruh katalog tools AI, atur status visibilitas publik, dan sesuaikan aset visual studio.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-200 ease-in-out">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Tools</span>
            <Box className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-white">{total}</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-200 ease-in-out">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Published</span>
            <Globe className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-emerald-400">{published}</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-200 ease-in-out">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Draft Mode</span>
            <EyeOff className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-amber-400">{drafts}</p>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-200 ease-in-out">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Kategori Aktif</span>
            <Tag className="h-4 w-4 text-violet-400" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-violet-400">{categoriesCount}</p>
        </div>
      </div>
    </div>
  );
}
