"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, LayoutDashboard, Eye, EyeOff } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        body: JSON.stringify({ email: "admin@dashboard.com", password }),
      });

      if (res.ok) {
        router.push(ROUTES.DASHBOARD);
        router.refresh();
      } else {
        setError("סיסמה שגויה");
      }
    } catch {
      setError("שגיאת חיבור לשרת");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px]">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400/10 mb-5 shadow-[0_0_40px_-8px_rgba(245,158,11,0.2)]">
          <LayoutDashboard className="w-8 h-8 text-amber-400" />
        </div>
        <h1
          className="text-[28px] font-extrabold mb-1"
          style={{
            background: "linear-gradient(90deg, #d4af37, #fff, #d4af37, #b8860b, #fff, #d4af37)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s ease-in-out infinite",
          }}
        >מערכת ניהול וניטור</h1>
        <p
          className="text-[14px] font-medium"
          style={{
            background: "linear-gradient(90deg, #a1a1aa, #e4e4e7, #a1a1aa)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 5s ease-in-out infinite",
          }}
        >ניהול פרויקטים מתקדם</p>
      </div>

      {/* Form */}
      <div className="surface rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[13px] text-red-400 text-center">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-[13px] font-medium text-zinc-300 mb-2">סיסמה</label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-300 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הכנס סיסמה..."
                className="w-full ps-12 pe-12 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-400/20 focus:border-amber-400/20 transition-all"
                required
                dir="ltr"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/[0.06] text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_30px_-8px_rgba(245,158,11,0.25)]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
            ) : (
              <>
                <span>כניסה למערכת</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
