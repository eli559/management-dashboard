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

    // Mock auth — will be replaced with real authentication
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <div className="w-full max-w-[420px]">
      {/* ── Logo ── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-5 shadow-lg shadow-indigo-500/10">
          <LayoutDashboard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">מערכת ניהול</h1>
        <p className="text-indigo-300/80 text-[15px]">
          התחבר לחשבון שלך כדי להמשיך
        </p>
      </div>

      {/* ── Form Card ── */}
      <div className="bg-white/[0.07] backdrop-blur-xl rounded-3xl p-8 border border-white/[0.12] shadow-2xl shadow-black/20">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-indigo-200/90 mb-2"
            >
              אימייל
            </label>
            <div className="relative">
              <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-indigo-300/60" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full ps-12 pe-4 py-3.5 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white text-sm placeholder:text-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/40 transition-all"
                required
                dir="ltr"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-indigo-200/90 mb-2"
            >
              סיסמה
            </label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-indigo-300/60" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-12 pe-4 py-3.5 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white text-sm placeholder:text-indigo-300/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/40 transition-all"
                required
                dir="ltr"
              />
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500/30 focus:ring-offset-0"
              />
              <span className="text-sm text-indigo-200/70 group-hover:text-indigo-200 transition-colors">
                זכור אותי
              </span>
            </label>
            <button
              type="button"
              className="text-sm text-indigo-300/70 hover:text-white transition-colors"
            >
              שכחת סיסמה?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-white text-indigo-950 font-bold text-sm rounded-xl hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-black/10 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-900 rounded-full animate-spin" />
            ) : (
              <>
                <span>התחברות</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── Footer ── */}
      <p className="text-center text-[13px] text-indigo-300/40 mt-8">
        © 2026 מערכת ניהול. כל הזכויות שמורות.
      </p>
    </div>
  );
}
