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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <div className="w-full max-w-[420px]">
      {/* ── לוגו ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-5">
          <LayoutDashboard className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">מערכת ניהול</h1>
        <p className="text-zinc-500 text-[15px]">
          התחבר לחשבון שלך כדי להמשיך
        </p>
      </div>

      {/* ── טופס ── */}
      <div className="bg-white/[0.04] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] shadow-2xl shadow-black/40">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* אימייל */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              אימייל
            </label>
            <div className="relative">
              <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-600" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full ps-12 pe-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400/30 transition-all"
                required
                dir="ltr"
              />
            </div>
          </div>

          {/* סיסמה */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              סיסמה
            </label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-600" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-12 pe-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400/30 transition-all"
                required
                dir="ltr"
              />
            </div>
          </div>

          {/* זכור + שכחתי */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-amber-500/20 focus:ring-offset-0"
              />
              <span className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                זכור אותי
              </span>
            </label>
            <button
              type="button"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              שכחת סיסמה?
            </button>
          </div>

          {/* כפתור */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-amber-500 text-zinc-950 font-bold text-sm rounded-xl hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 mt-2"
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

      {/* ── כותרת תחתונה ── */}
      <p className="text-center text-[13px] text-zinc-700 mt-8">
        © 2026 מערכת ניהול. כל הזכויות שמורות.
      </p>
    </div>
  );
}
