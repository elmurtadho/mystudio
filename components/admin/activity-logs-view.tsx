"use client";

import React from "react";
import { Activity, PlusCircle, RefreshCw, Trash2, Shield, Settings, Sliders } from "lucide-react";
import type { ActivityLog } from "@/lib/schema";

interface ActivityLogsViewProps {
  logs: ActivityLog[];
}

export function ActivityLogsView({ logs }: ActivityLogsViewProps) {
  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return {
          icon: <PlusCircle className="h-3.5 w-3.5" />,
          className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        };
      case "UPDATE":
        return {
          icon: <RefreshCw className="h-3.5 w-3.5" />,
          className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        };
      case "DELETE":
        return {
          icon: <Trash2 className="h-3.5 w-3.5" />,
          className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        };
      case "TOGGLE_STATUS":
        return {
          icon: <Sliders className="h-3.5 w-3.5" />,
          className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        };
      case "LOGIN":
        return {
          icon: <Shield className="h-3.5 w-3.5" />,
          className: "bg-sky-500/10 text-sky-400 border-sky-500/30",
        };
      case "SETTINGS_UPDATE":
        return {
          icon: <Settings className="h-3.5 w-3.5" />,
          className: "bg-violet-500/10 text-violet-400 border-violet-500/30",
        };
      default:
        return {
          icon: <Activity className="h-3.5 w-3.5" />,
          className: "bg-white/10 text-slate-300 border-white/20",
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-400" />
            <span>Audit Trail & Activity Logs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log riwayat modifikasi data, status, dan sesi autentikasi studio.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {logs.length} catatan aktivitas
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden">
        {logs.length > 0 ? (
          <div className="divide-y divide-white/5">
            {logs.map((log) => {
              const badge = getActionBadge(log.action);
              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badge.className} mt-0.5`}
                    >
                      {badge.icon}
                      <span>{log.action}</span>
                    </div>

                    <div>
                      <p className="font-medium text-white tracking-tight">
                        {log.target}
                      </p>
                      {log.details && (
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-500 font-mono whitespace-nowrap pl-11 sm:pl-0">
                    {log.createdAt}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            Belum ada aktivitas tercatat. Setiap tindakan pembuatan, pengubahan, atau penghapusan tool akan otomatis muncul di sini.
          </div>
        )}
      </div>
    </div>
  );
}
