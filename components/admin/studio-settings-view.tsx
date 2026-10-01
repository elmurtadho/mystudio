"use client";

import React, { useState } from "react";
import { Settings, Save, Loader2, Sparkles, ShieldAlert, Mail, Cpu } from "lucide-react";
import { updateStudioSettings } from "@/app/admin/actions";
import { useToast } from "@/components/ui/toast";

interface StudioSettingsViewProps {
  initialSettings: Record<string, string>;
}

export function StudioSettingsView({ initialSettings }: StudioSettingsViewProps) {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateStudioSettings(settings);
      if (res.success) {
        showToast("success", "Pengaturan Disimpan", "Preferensi studio berhasil diperbarui ke database Turso.");
      } else {
        showToast("error", "Gagal Menyimpan", res.error);
      }
    } catch {
      showToast("error", "Error", "Gagal memperbarui pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-400" />
          <span>Pengaturan Studio & Platform AI</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Atur identitas merek, preferensi orkestrasi AI, dan status operasional platform.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 space-y-5">
        {/* Studio Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Nama Brand Studio
          </label>
          <input
            type="text"
            value={settings.studio_name || ""}
            onChange={(e) => handleChange("studio_name", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Tagline Utama
          </label>
          <input
            type="text"
            value={settings.studio_tagline || ""}
            onChange={(e) => handleChange("studio_tagline", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
        </div>

        {/* AI Model Selection */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>Primary AI Engine Provider</span>
          </label>
          <select
            value={settings.primary_model || "GPT-4o / Claude 3.5 Sonnet"}
            onChange={(e) => handleChange("primary_model", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
          >
            <option value="GPT-4o / Claude 3.5 Sonnet">GPT-4o + Claude 3.5 Sonnet (Multi-Model Hybrid)</option>
            <option value="OpenAI GPT-4o">OpenAI GPT-4o (High-Throughput)</option>
            <option value="Anthropic Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet (Design & PRD Specialist)</option>
            <option value="Google Gemini 1.5 Pro">Google Gemini 1.5 Pro (Deep Context)</option>
          </select>
        </div>

        {/* Support Email */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-violet-400" />
            <span>Email Kontak / Dukungan</span>
          </label>
          <input
            type="email"
            value={settings.contact_email || ""}
            onChange={(e) => handleChange("contact_email", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
          />
        </div>

        {/* Maintenance Mode */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-white flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Maintenance Mode</span>
            </span>
            <p className="text-[11px] text-slate-400">
              Jika aktif, pengguna umum akan melihat halaman pemeliharaan studio.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              handleChange(
                "maintenance_mode",
                settings.maintenance_mode === "true" ? "false" : "true"
              )
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              settings.maintenance_mode === "true"
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
            }`}
          >
            {settings.maintenance_mode === "true" ? "Aktif" : "Nonaktif"}
          </button>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
