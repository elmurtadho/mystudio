import { Metadata } from "next";
import { getTools, seedDefaultTools } from "./actions";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard — Novasco Digital Studio",
  description: "Kelola tools AI, rute, status publikasi, dan aset ekosistem Novasco",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const result = await getTools();
  let tools = result.success && result.data ? result.data : [];

  // If table is completely fresh and empty, auto-seed with standard PRD tools
  if (tools.length === 0) {
    const seedResult = await seedDefaultTools();
    if (seedResult.success && seedResult.data) {
      tools = seedResult.data;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 py-10 space-y-8 flex-1">
        <AdminHeader tools={tools} />
        <AdminDashboard initialTools={tools} />
      </div>

      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Novasco Studio Engine. Powered by Turso & Drizzle ORM.</p>
      </footer>
    </div>
  );
}
