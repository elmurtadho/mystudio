import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Compass, Layers, Cpu, CheckCircle2, Lock } from "lucide-react";
import { db } from "@/lib/db";
import { tools } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { PublicNavbar } from "@/components/public/navbar";
import { InteractiveToolsShowcase } from "@/components/public/interactive-tools-showcase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let activeTools: (typeof tools.$inferSelect)[] = [];

  try {
    activeTools = await db
      .select()
      .from(tools)
      .where(eq(tools.status, "published"))
      .orderBy(desc(tools.id));
  } catch (e) {
    activeTools = [];
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient radial gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute bottom-10 -left-40 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      {/* Navigation Header */}
      <PublicNavbar />

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-24 flex-1">
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold shadow-[0_0_15px_rgba(99,102,241,0.15)] animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 -ml-2.5" />
            <span>Novasco Digital Studio Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Modular AI Workspaces untuk Kreator & Product Leader
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Novasco merancang platform digital studio terintegrasi: ciptakan dokumen PRD enterprise, rancang antarmuka UI/UX berbasis vibrasi estetika, dan sinkronkan data seketika lewat Turso Edge database.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 ease-in-out shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-[1.02]"
            >
              <span>Jelajahi Katalog Tools</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#features"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-semibold text-sm transition-all"
            >
              <span>Pelajari Fitur Studio</span>
            </a>
          </div>
        </section>

        {/* Dynamic & Interactive Showcase */}
        <InteractiveToolsShowcase tools={activeTools} />

        {/* Studio Features Section */}
        <section id="features" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Dibuat dengan Prinsip Desain Tanpa Kompromi
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Arsitektur kode bersih, anti-islop, dan berorientasi pada kecepatan eksekusi pengguna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">PRD Maker Enterprise</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Transformasi ide abstrak menjadi dokumen spesifikasi produk siap eksekusi oleh tim engineering.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/30 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Vibe Design UI/UX</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Interaksi desain AI dengan live preview komponen visual dan struktur JSON siap import ke Figma.
              </p>
            </div>

            <div id="architecture" className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Turso Edge LibSQL</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Database terdistribusi global dengan Drizzle ORM untuk respon instan tanpa cold-start.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Discreet/Protected Admin Portal Link */}
      <footer className="relative z-10 border-t border-white/10 py-8 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Novasco</span>
            <span>&copy; {new Date().getFullYear()} Digital Studio. Anti-Islop Standard.</span>
          </div>

          {/* Discreet admin entry point */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors"
              title="Akses Manajemen Studio"
            >
              <Lock className="h-3 w-3" />
              <span>Studio Access</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
