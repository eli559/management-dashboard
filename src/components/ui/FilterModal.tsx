"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function FilterModal({ open, onClose, title, children }: FilterModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-drawer-backdrop"
      />

      {/* Desktop: centered dialog */}
      <div className="hidden md:flex fixed inset-0 items-center justify-center p-4 z-[100000]">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[380px] max-h-[80vh] overflow-y-auto rounded-2xl p-6"
          style={{
            background: "rgba(12,12,18,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 80px -12px rgba(0,0,0,0.8)",
            animation: "dialog-in 200ms ease-out",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-bold text-white">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>

      {/* Mobile: bottom sheet drawer */}
      <div
        className="md:hidden fixed bottom-0 inset-x-0 z-[100000] rounded-t-3xl animate-drawer-up overflow-hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-[#0c0c14]/97 backdrop-blur-xl" />
        <div className="absolute top-0 inset-x-0 h-px gradient-line" />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative z-10 p-5 pb-6 max-h-[85vh] overflow-y-auto"
        >
          {/* Drag handle */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 rounded-full bg-white/[0.15]" />
          </div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-bold text-white">{title}</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.06] text-zinc-400 tap-scale transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
