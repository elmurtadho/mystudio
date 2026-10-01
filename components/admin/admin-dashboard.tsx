"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  Activity,
  Settings,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Sparkles,
  Database,
  FolderOpen,
  LogOut,
  Menu,
  X,
  Globe,
  Sliders,
} from "lucide-react";
import type { Tool, ActivityLog } from "@/lib/schema";
import { IconRenderer } from "./icon-helper";
import { ToolDialog } from "./tool-dialog";
import { DeleteDialog } from "./delete-dialog";
import { AnalyticsView } from "./analytics-view";
import { ActivityLogsView } from "./activity-logs-view";
import { StudioSettingsView } from "./studio-settings-view";
import {
  createTool,
  updateTool,
  deleteTool,
  toggleToolStatus,
  seedDefaultTools,
} from "@/app/admin/actions";
import { logoutAdminAction } from "@/app/login/actions";
import { useToast } from "@/components/ui/toast";

interface AdminDashboardProps {
  initialTools: Tool[];
  initialLogs: ActivityLog[];
  initialSettings: Record<string, string>;
}

type TabType = "overview" | "tools" | "logs" | "settings";

export function AdminDashboard({
  initialTools,
  initialLogs,
  initialSettings,
}: AdminDashboardProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tools state
  const [toolsList, setToolsList] = useState<Tool[]>(initialTools);
  const [logsList, setLogsList] = useState<ActivityLog[]>(initialLogs);
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

  const [isPending, startTransition] = useTransition();

  const categories = ["All", ...Array.from(new Set(toolsList.map((t) => t.category)))];

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
        const res = await updateTool(editingTool.id, formData);
        if (res.success && res.data) {
          setToolsList((prev) =>
            prev.map((item) => (item.id === res.data!.id ? res.data! : item))
          );
          showToast("success", "Tool Berhasil Diperbarui", `${res.data.name} telah disimpan ke Turso.`);
          setIsDialogOpen(false);
        } else {
          showToast("error", "Gagal Memperbarui Tool", res.error);
        }
      } else {
        const res = await createTool(formData);
        if (res.success && res.data) {
          setToolsList((prev) => [res.data!, ...prev]);
          showToast("success", "Tool Berhasil Dibuat", `${res.data.name} telah ditambahkan ke database.`);
          setIsDialogOpen(false);
        } else {
          showToast("error", "Gagal Menambahkan Tool", res.error);
        }
      }
    } catch {
      showToast("error", "Error", "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toolToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteTool(toolToDelete.id);
      if (res.success) {
        setToolsList((prev) => prev.filter((t) => t.id !== toolToDelete.id));
        showToast("success", "Tool Dihapus", `${toolToDelete.name} berhasil dihapus.`);
        setIsDeleteDialogOpen(false);
        setToolToDelete(null);
      } else {
        showToast("error", "Gagal Menghapus Tool", res.error);
      }
    } catch {
      showToast("error", "Error", "Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
    }
  };

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
            `${res.data.name} kini: ${res.data.status.toUpperCase()}`
          );
        } else {
          showToast("error", "Gagal Mengubah Status", res.error);
        }
      } catch {
        showToast("error", "Error", "Terjadi kesalahan sistem");
      }
    });
  };

  const handleSeed = async () => {
    startTransition(async () => {
      try {
        const res = await seedDefaultTools();
        if (res.success && res.data) {
          setToolsList(res.data);
          showToast("success", "Data Bawaan Dimuat", "Tool PRD & Vibe Designer berhasil disinkronkan.");
        } else {
          showToast("error", "Gagal Memuat", res.error);
        }
      } catch {
        showToast("error", "Error", "Terjadi kesalahan");
      }
    });
  };

  const handleLogout = async () => {
    await logoutAdminAction();
    showToast("info", "Keluar dari Sesi Admin", "Sesi Anda telah diakhiri.");
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { id: "overview", label: "Overview & Analytics", icon: LayoutDashboard },
    { id: "tools", label: "Tools Management", icon: Boxes },
    { id: "logs", label: "Activity Logs", icon: Activity },
    { id: "settings", label: "Studio Settings", icon: Settings },
  ] as const;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Mobile Top Header Toggle */}
      <div className="lg:hidden w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            N
          </div>
          <span className="font-semibold text-white text-sm">Novasco Admin Suite</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } lg:block w-full lg:w-64 flex-shrink-0 space-y-6 lg:sticky lg:top-8`}
      >
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="px-3 py-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Menu Studio
              </p>
              <p className="text-[11px] text-indigo-400">Turso Edge Admin</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 space-y-1">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>Lihat Web Publik</span>
              <ExternalLink className="h-3.5 w-3.5 ml-auto text-slate-500" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full space-y-6">
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <AnalyticsView
            tools={toolsList}
            logs={logsList}
            onOpenNewTool={() => {
              setEditingTool(null);
              setIsDialogOpen(true);
            }}
          />
        )}

        {/* TAB 2: TOOLS MANAGEMENT */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            {/* Top Bar Filter & Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-1 flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari tool..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500/60 transition-all"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-slate-950 text-white">
                      Kategori: {c}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500/60 transition-all"
                >
                  <option value="All" className="bg-slate-950 text-white">Status: Semua</option>
                  <option value="published" className="bg-slate-950 text-white">Status: Published</option>
                  <option value="draft" className="bg-slate-950 text-white">Status: Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {toolsList.length === 0 && (
                  <button
                    type="button"
                    onClick={handleSeed}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-all"
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
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Tool</span>
                </button>
              </div>
            </div>

            {/* Table */}
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
                            className="group hover:bg-white/[0.02] transition-colors"
                          >
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

                            <td className="py-3.5 px-4">
                              <code className="text-xs px-2 py-1 rounded bg-slate-950/80 border border-white/10 text-indigo-300 font-mono">
                                /tools/{tool.slug}
                              </code>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
                                {tool.category}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 max-w-xs">
                              <p className="text-xs text-slate-400 truncate leading-relaxed">
                                {tool.description}
                              </p>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(tool)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
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
                      <tr>
                        <td colSpan={6} className="py-16 text-center">
                          <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-3">
                            <FolderOpen className="h-10 w-10 text-indigo-400" />
                            <h4 className="text-sm font-semibold text-white">
                              Belum ada tools di sini
                            </h4>
                            <p className="text-xs text-slate-400">
                              Tambahkan tool baru atau muat tool bawaan PRD.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITY LOGS */}
        {activeTab === "logs" && <ActivityLogsView logs={logsList} />}

        {/* TAB 4: STUDIO SETTINGS */}
        {activeTab === "settings" && (
          <StudioSettingsView initialSettings={initialSettings} />
        )}
      </main>

      {/* Modal Dialogs */}
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
