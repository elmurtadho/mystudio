"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  ExternalLink,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database,
  Layers,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";
import type { Tool } from "@/lib/schema";
import { IconRenderer } from "./icon-helper";
import { ToolDialog } from "./tool-dialog";
import { DeleteDialog } from "./delete-dialog";
import {
  createTool,
  updateTool,
  deleteTool,
  toggleToolStatus,
  seedDefaultTools,
} from "@/app/admin/actions";
import { useToast } from "@/components/ui/toast";

interface AdminDashboardProps {
  initialTools: Tool[];
}

export function AdminDashboard({ initialTools }: AdminDashboardProps) {
  const { showToast } = useToast();
  const [toolsList, setToolsList] = useState<Tool[]>(initialTools);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status toggle pending state
  const [isPending, startTransition] = useTransition();

  // Categories list
  const categories = ["All", ...Array.from(new Set(toolsList.map((t) => t.category)))];

  // Filtered tools
  const filteredTools = toolsList.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.slug.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" || tool.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle Save (Create or Update)
  const handleSaveTool = async (formData: {
    name: string;
    slug: string;
    description: string;
    category: string;
    icon: string;
    badge?: string;
    status: "draft" | "published";
  }) => {
    setIsSubmitting(true);
    try {
      if (editingTool) {
        // Edit mode
        const res = await updateTool(editingTool.id, formData);
        if (res.success && res.data) {
          setToolsList((prev) =>
            prev.map((item) => (item.id === res.data!.id ? res.data! : item))
          );
          showToast("success", "Tool Berhasil Diperbarui", `Perubahan pada ${res.data.name} telah disimpan ke Turso.`);
          setIsDialogOpen(false);
        } else {
          showToast("error", "Gagal Memperbarui Tool", res.error);
        }
      } else {
        // Create mode
        const res = await createTool(formData);
        if (res.success && res.data) {
          setToolsList((prev) => [res.data!, ...prev]);
          showToast("success", "Tool Berhasil Dibuat", `${res.data.name} telah ditambahkan ke database.`);
          setIsDialogOpen(false);
        } else {
          showToast("error", "Gagal Menambahkan Tool", res.error);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      showToast("error", "System Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!toolToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteTool(toolToDelete.id);
      if (res.success) {
        setToolsList((prev) => prev.filter((t) => t.id !== toolToDelete.id));
        showToast("success", "Tool Berhasil Dihapus", `${toolToDelete.name} telah dihapus dari sistem.`);
        setIsDeleteDialogOpen(false);
        setToolToDelete(null);
      } else {
        showToast("error", "Gagal Menghapus Tool", res.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      showToast("error", "System Error", msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Status Toggle
  const handleToggleStatus = async (tool: Tool) => {
    startTransition(async () => {
      try {
        const res = await toggleToolStatus(tool.id);
        if (res.success && res.data) {
          setToolsList((prev) =>
            prev.map((t) => (t.id === tool.id ? res.data! : t))
          );
          showToast(
            "info",
            "Status Diubah",
            `${res.data.name} kini berstatus: ${res.data.status.toUpperCase()}`
          );
        } else {
          showToast("error", "Gagal Mengubah Status", res.error);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
        showToast("error", "Error", msg);
      }
    });
  };

  // Handle Seed
  const handleSeed = async () => {
    startTransition(async () => {
      try {
        const res = await seedDefaultTools();
        if (res.success && res.data) {
          setToolsList(res.data);
          showToast(
            "success",
            "Data Default Berhasil Dimuat",
            "PRD Maker & Vibe Design UI/UX Maker berhasil disinkronisasi ke Turso."
          );
        } else {
          showToast("error", "Gagal Memuat Data Default", res.error);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
        showToast("error", "Error", msg);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls & Action Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tool berdasarkan nama, slug, atau deskripsi..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500/60 transition-all"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-950 text-white">
                  Kategori: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500/60 transition-all"
            >
              <option value="All" className="bg-slate-950 text-white">Status: Semua</option>
              <option value="published" className="bg-slate-950 text-white">Status: Published</option>
              <option value="draft" className="bg-slate-950 text-white">Status: Draft</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {toolsList.length === 0 && (
            <button
              type="button"
              onClick={handleSeed}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-all duration-200 ease-in-out disabled:opacity-50"
            >
              <Database className="h-3.5 w-3.5 text-indigo-400" />
              <span>Seed Tools PRD</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setEditingTool(null);
              setIsDialogOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all duration-200 ease-in-out shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Tool Baru</span>
          </button>
        </div>
      </div>

      {/* Tools Table Container */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-medium text-slate-400">
                <th className="py-3.5 px-4">Tool</th>
                <th className="py-3.5 px-4">Slug & Rute</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Deskripsi</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => {
                  const isPublished = tool.status === "published";
                  return (
                    <tr
                      key={tool.id}
                      className="group hover:bg-white/[0.02] transition-colors duration-150"
                    >
                      {/* Name & Icon */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                            <IconRenderer icon={tool.icon} className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white tracking-tight">
                                {tool.name}
                              </span>
                              {tool.badge && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              ID #{tool.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3.5 px-4">
                        <code className="text-xs px-2 py-1 rounded bg-slate-950/80 border border-white/10 text-indigo-300 font-mono">
                          /tools/{tool.slug}
                        </code>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
                          {tool.category}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-slate-400 truncate leading-relaxed">
                          {tool.description}
                        </p>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(tool)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ease-in-out ${
                            isPublished
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isPublished ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />
                          <span>{isPublished ? "Published" : "Draft"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/tools/${tool.slug}`}
                            target="_blank"
                            title="Pratinjau Halaman Workspace"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-white/5 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingTool(tool);
                              setIsDialogOpen(true);
                            }}
                            title="Edit Tool"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setToolToDelete(tool);
                              setIsDeleteDialogOpen(true);
                            }}
                            title="Hapus Tool"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Empty State sesuai panduan taste.md */
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-3">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                        <FolderOpen className="h-6 w-6" />
                      </div>
                      <h4 className="text-base font-semibold text-white tracking-tight">
                        {search || selectedCategory !== "All" || selectedStatus !== "All"
                          ? "Tidak ada tool yang cocok dengan filter"
                          : "Belum ada tools di sini"}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {search || selectedCategory !== "All" || selectedStatus !== "All"
                          ? "Coba ubah kata kunci pencarian atau reset filter kategori."
                          : "Tambahkan tool pertamamu atau muat tool bawaan studio untuk memulai ekosistem Novasco."}
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        {toolsList.length === 0 ? (
                          <button
                            type="button"
                            onClick={handleSeed}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all duration-200 ease-in-out shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Muat Tool PRD & Vibe Maker</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              setSelectedCategory("All");
                              setSelectedStatus("All");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                          >
                            Reset Filter
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Create & Edit */}
      <ToolDialog
        isOpen={isDialogOpen}
        tool={editingTool}
        isSubmitting={isSubmitting}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTool(null);
        }}
        onSubmit={handleSaveTool}
      />

      {/* Modal Dialog for Delete Confirmation */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        tool={toolToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setToolToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
