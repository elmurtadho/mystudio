"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { Tool } from "@/lib/schema";

interface DeleteDialogProps {
  tool: Tool | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({
  tool,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteDialogProps) {
  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-5">
        <div className="flex items-center gap-3 text-rose-400">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white">Hapus Tool</h3>
            <p className="text-xs text-slate-400">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Apakah Anda yakin ingin menghapus tool{" "}
          <strong className="text-white font-semibold">"{tool.name}"</strong> (slug:{" "}
          <code className="text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-indigo-300">
            {tool.slug}
          </code>
          ) secara permanen dari database Turso?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 ease-in-out disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all duration-200 ease-in-out disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isDeleting ? "Menghapus..." : "Ya, Hapus Tool"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
