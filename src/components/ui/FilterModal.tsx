"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function FilterModal({ open, onClose, title, children }: FilterModalProps) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-[fade-in_150ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-[380px] max-h-[80vh] overflow-y-auto glass-strong rounded-2xl shadow-2xl shadow-black/60 animate-[dialog-in_200ms_ease-out] p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors text-zinc-300 hover:text-white"
            aria-label="סגור"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
