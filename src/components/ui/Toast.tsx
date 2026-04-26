"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  exiting?: boolean;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-300",
};

const GLOW = {
  success: "shadow-[0_0_20px_-6px_rgba(16,185,129,0.3)]",
  error: "shadow-[0_0_20px_-6px_rgba(239,68,68,0.3)]",
  warning: "shadow-[0_0_20px_-6px_rgba(245,158,11,0.3)]",
  info: "shadow-[0_0_20px_-6px_rgba(59,130,246,0.3)]",
};

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Start exit animation after 3s
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    }, 3000);

    // Remove after exit animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const value: ToastContextValue = {
    success: (msg) => addToast("success", msg),
    error: (msg) => addToast("error", msg),
    warning: (msg) => addToast("warning", msg),
    info: (msg) => addToast("info", msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted && createPortal(
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999999] flex flex-col items-center gap-2 pointer-events-none" style={{ minWidth: "320px" }}>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type];
            return (
              <div
                key={toast.id}
                className={cn(
                  "pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md",
                  "transition-all duration-300",
                  toast.exiting ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0 animate-[slide-down_300ms_ease-out]",
                  STYLES[toast.type],
                  GLOW[toast.type],
                )}
                style={{ background: "rgba(12,12,18,0.9)" }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[13px] font-medium flex-1">{toast.message}</span>
                <button onClick={() => dismiss(toast.id)} className="p-0.5 rounded hover:bg-white/[0.1] transition-colors flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
