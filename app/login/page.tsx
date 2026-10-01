"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { loginAdminAction } from "./actions";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      showToast("error", "Input Diperlukan", "Silakan masukkan password admin.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginAdminAction(password);
      if (res.success) {
        showToast("success", "Autentikasi Berhasil", "Selamat datang kembali di Studio Management Suite.");
        router.push("/admin");
        router.refresh();
      } else {
        showToast("error", "Akses Ditolak", res.error || "Password admin tidak cocok.");
      }
    } catch {
      showToast("error", "Error", "Gagal memproses login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-6 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[650px] rounded-full bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl" />

      {/* Top back link */}
      <div className="w-full max-w-md pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 shadow-2xl backdrop-blur-xl space-y-6 hover:border-white/15 transition-all">
          {/* Studio Header Icon */}
          <div className="text-center space-y-3">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.35)] mx-auto">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <span>Novasco Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  PRO
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Portal manajemen privat untuk pengelolaan ekosistem tools AI & aset studio.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password Autentikasi Admin
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin..."
                  autoFocus
                  required
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 ease-in-out shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <span>Buka Studio Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Edge-Secured Session</span>
            </span>
            <span>Turso LibSQL Protected</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Novasco Studio Engine.
      </footer>
    </div>
  );
}
