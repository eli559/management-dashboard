"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowLeft, LayoutDashboard } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push(ROUTES.DASHBOARD);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "שגיאה בהתחברות");
      }
    } catch {
      setError("שגיאת חיבור לשרת");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400/10 mb-5 shadow-[0_0_40px_-8px_rgba(245,158,11,0.15)]">
          <LayoutDashboard className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">מערכת ניהול</h1>
        <p className="text-zinc-400 text-[15px]">התחבר לחשבון שלך כדי להמשיך</p>
      </div>

      <div className="glass-strong rounded-3xl p-8 shadow-2xl shadow-black/40">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">אימייל</label>
            <div className="relative">
              <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dashboard.com"
                className="w-full ps-12 pe-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20 focus:border-amber-400/20 transition-all"
                required
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">סיסמה</label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-12 pe-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20 focus:border-amber-400/20 transition-all"
                required
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_30px_-8px_rgba(245,158,11,0.25)] mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
            ) : (
              <>
                <span>התחברות</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-[13px] text-zinc-700 mt-8">© 2026 מערכת ניהול. כל הזכויות שמורות.</p>
    </div>
  );
}
