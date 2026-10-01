"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, Upload, Link as LinkIcon, Sparkles } from "lucide-react";
import type { Tool } from "@/lib/schema";
import { AVAILABLE_ICONS, IconRenderer } from "./icon-helper";

interface ToolDialogProps {
  isOpen: boolean;
  tool: Tool | null; // null means create mode
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    slug: string;
    description: string;
    category: string;
    icon: string;
    badge?: string;
    status: "draft" | "published";
  }) => Promise<void>;
}

const CATEGORY_PRESETS = [
  "Product Management",
  "UI/UX Design",
  "Engineering",
  "Creative",
  "Marketing",
  "Research",
];

const BADGE_PRESETS = ["Essential", "Featured", "New", "Pro", "Beta"];

export function ToolDialog({
  isOpen,
  tool,
  isSubmitting,
  onClose,
  onSubmit,
}: ToolDialogProps) {
  const isEdit = !!tool;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Product Management");
  const [icon, setIcon] = useState("Sparkles");
  const [badge, setBadge] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [iconMode, setIconMode] = useState<"lucide" | "upload" | "url">("lucide");
  const [customUrl, setCustomUrl] = useState("");
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (tool) {
      setName(tool.name);
      setSlug(tool.slug);
      setDescription(tool.description);
      setCategory(tool.category);
      setIcon(tool.icon);
      setBadge(tool.badge || "");
      setStatus(tool.status);
      setSlugManual(true);

      if (tool.icon.startsWith("data:") || tool.icon.startsWith("/") || tool.icon.startsWith("http")) {
        setIconMode("url");
        setCustomUrl(tool.icon);
      } else {
        setIconMode("lucide");
      }
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setCategory("Product Management");
      setIcon("Sparkles");
      setBadge("");
      setStatus("published");
      setIconMode("lucide");
      setCustomUrl("");
      setSlugManual(false);
    }
  }, [tool, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManual && !isEdit) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 1MB max for embedded/direct data URI
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Ukuran file maksimal 1.5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setIcon(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !description.trim()) {
      return;
    }

    const finalIcon =
      iconMode === "url" && customUrl.trim()
        ? customUrl.trim()
        : icon || "Sparkles";

    await onSubmit({
      name,
      slug,
      description,
      category,
      icon: finalIcon,
      badge: badge.trim() || undefined,
      status,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {isEdit ? "Edit Tool AI" : "Tambah Tool AI Baru"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit
                ? `Mengubah konfigurasi tool #${tool.id}`
                : "Masukkan detail tool untuk dipublikasikan ke katalog studio"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nama Tool <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="misal: PRD Maker"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Slug URL <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-500">/tools/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlugManual(true);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"));
                  }}
                  placeholder="prd-maker"
                  className="w-full pl-16 pr-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Kategori <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              >
                {CATEGORY_PRESETS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Badge Label (Opsional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="misal: Featured"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                />
              </div>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {BADGE_PRESETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBadge(b)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                      badge === b
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                        : "bg-white/5 text-slate-400 border-white/5 hover:text-white"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Deskripsi Tool <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsikan kapabilitas dan use-case dari tool AI ini..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all leading-relaxed"
            />
          </div>

          {/* Icon & Thumbnail Selector */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Ikon / Visual Thumbnail</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setIconMode("lucide")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    iconMode === "lucide"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Preset Ikon
                </button>
                <button
                  type="button"
                  onClick={() => setIconMode("upload")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    iconMode === "upload"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setIconMode("url")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    iconMode === "url"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {/* Mode 1: Lucide presets */}
            {iconMode === "lucide" && (
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.keys(AVAILABLE_ICONS).map((iconName) => {
                  const isSelected = icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setIcon(iconName)}
                      className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                          : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                      title={iconName}
                    >
                      <IconRenderer icon={iconName} className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mode 2: Upload file */}
            {iconMode === "upload" && (
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-slate-950/40 transition-colors"
                >
                  <Upload className="h-5 w-5 text-indigo-400" />
                  <span className="text-xs font-medium text-slate-300">
                    Klik untuk memilih file ikon/thumbnail
                  </span>
                  <span className="text-[10px] text-slate-500">
                    PNG, JPG, SVG, atau WebP (Max. 1.5MB)
                  </span>
                </button>
              </div>
            )}

            {/* Mode 3: Image URL */}
            {iconMode === "url" && (
              <div>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => {
                      setCustomUrl(e.target.value);
                      setIcon(e.target.value);
                    }}
                    placeholder="https://example.com/icon.png"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
              </div>
            )}

            {/* Preview Selected Icon */}
            <div className="flex items-center gap-3 pt-1 border-t border-white/5">
              <span className="text-xs text-slate-400">Preview:</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 overflow-hidden">
                <IconRenderer icon={icon} className="h-4 w-4" />
              </div>
              <span className="text-xs font-mono text-slate-500 truncate max-w-xs">
                {icon.startsWith("data:") ? "Custom Upload (Data URI)" : icon}
              </span>
            </div>
          </div>

          {/* Status Selection */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
            <div>
              <span className="text-xs font-medium text-white block">Status Publikasi</span>
              <span className="text-[11px] text-slate-400">
                Tool berstatus Draft tidak akan terlihat oleh publik di halaman utama.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus("draft")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  status === "draft"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus("published")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  status === "published"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                Published
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 ease-in-out disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-200 ease-in-out disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isSubmitting ? "Menyimpan..." : isEdit ? "Perbarui Tool" : "Simpan Tool"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
