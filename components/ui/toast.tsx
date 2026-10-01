"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, description?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message, description }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl transition-all duration-200 ease-in-out shadow-2xl ${
                isSuccess
                  ? "bg-slate-900/90 border-emerald-500/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                  : isError
                  ? "bg-slate-900/90 border-rose-500/30 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.12)]"
                  : "bg-slate-900/90 border-indigo-500/30 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.12)]"
              }`}
            >
              <div className="mt-0.5">
                {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                {isError && <AlertCircle className="h-5 w-5 text-rose-400" />}
                {!isSuccess && !isError && <Info className="h-5 w-5 text-indigo-400" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold tracking-tight text-white">{toast.message}</p>
                {toast.description && (
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
