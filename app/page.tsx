import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, ArrowUpRight, Cpu } from "lucide-react";
import { db } from "@/lib/db";
import { tools } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { IconRenderer } from "@/components/admin/icon-helper";

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
    // If not yet seeded or error
    activeTools = [];
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Background subtle ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[700px] rounded-full bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl" />

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg text-white">Novasco</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Studio v1.0</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all duration-200 ease-in-out hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
            >
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <span>Admin Panel</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Digital Studio Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Craft Extraordinary Products with Intelligent Studio Tools
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Novasco mengintegrasikan modular AI workspaces dengan dynamic tool orchestration, edge-powered database Turso, dan estetika desain humanis.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 ease-in-out shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
            >
              <span>Kelola Tools di Admin</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Dynamic Tools Showcase Directory */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Daftar Tools AI Aktif</span>
                <span className="text-xs font-mono font-normal text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  {activeTools.length} published
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Semua tool di bawah diambil secara dinamis dari database Turso Edge.
              </p>
            </div>
            <Link
              href="/admin"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <span>Atur di Dashboard</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {activeTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="group block p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all duration-200 ease-in-out hover:shadow-[0_0_20px_rgba(99,102,241,0.12)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                        <IconRenderer icon={tool.icon} className="h-5 w-5" />
                      </div>
                      {tool.badge && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase block mb-1">
                      {tool.category}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                    <span>Buka Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
              <Cpu className="h-8 w-8 text-indigo-400 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">Belum ada tool yang dipublikasikan.</p>
              <p className="text-xs text-slate-500">
                Masuk ke Admin Dashboard untuk mempublikasikan tool pertama ke katalog studio.
              </p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all"
                >
                  Buka Admin Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Novasco Digital Studio. Crafted with Anti-Islop principles.</p>
      </footer>
    </div>
  );
}
