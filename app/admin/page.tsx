import { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getTools, getActivityLogs, getStudioSettings, seedDefaultTools } from "./actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Studio Suite Admin — Novasco",
  description: "Panel kendali privat manajemen studio, alat AI, log audit, dan preferensi platform",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Authentication Guard
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    redirect("/login");
  }

  // Fetch Studio Data concurrently
  const [toolsRes, logsRes, settingsRes] = await Promise.all([
    getTools(),
    getActivityLogs(),
    getStudioSettings(),
  ]);

  let tools = toolsRes.success && toolsRes.data ? toolsRes.data : [];
  const logs = logsRes.success && logsRes.data ? logsRes.data : [];
  const settings = settingsRes.success && settingsRes.data ? settingsRes.data : {};

  // Auto seed if database is clean
  if (tools.length === 0) {
    const seedResult = await seedDefaultTools();
    if (seedResult.success && seedResult.data) {
      tools = seedResult.data;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        <AdminHeader tools={tools} />
        <AdminDashboard
          initialTools={tools}
          initialLogs={logs}
          initialSettings={settings}
        />
      </div>

      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Novasco Studio Engine. Edge Protected.</p>
      </footer>
    </div>
  );
}
