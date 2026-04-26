"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { createPortal } from "react-dom";

export function LogoutButton() {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure portal mount
  if (!mounted && typeof window !== "undefined") {
    setMounted(true);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setConfirm(true)}
        className="w-full flex items-center gap-3 px-3 py-[10px] rounded-xl text-[13px] font-medium text-zinc-300 hover:bg-red-500/[0.06] hover:text-red-400 transition-all duration-300"
      >
        <LogOut className="w-[17px] h-[17px] flex-shrink-0" />
        <span>התנתק</span>
      </button>

      {confirm && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirm(false)} />
          <div
            className="relative z-[100000] w-full max-w-[340px] p-6 rounded-2xl text-center"
            style={{
              background: "rgba(12,12,18,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 80px -12px rgba(0,0,0,0.8)",
              animation: "dialog-in 200ms ease-out",
            }}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-[16px] font-bold text-white mb-2">התנתקות</h3>
            <p className="text-[13px] text-zinc-300 mb-6">אתה בטוח שאתה רוצה להתנתק מהמערכת?</p>

            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
              >
                כן, התנתק
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-white/[0.05] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.08] transition-all"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
