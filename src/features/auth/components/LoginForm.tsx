"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
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
    <div className="w-full max-w-[400px] px-4 md:px-0">
      {/* Logo */}
      <div className="text-center mb-8 md:mb-10">
        <div className="inline-block mb-5 relative">
          <div className="absolute inset-0 bg-sky-500/20 rounded-2xl blur-2xl scale-150" />
          <Image
            src="/logo.png"
            alt="לוגו"
            width={72}
            height={72}
            className="rounded-2xl relative z-10 shadow-[0_0_40px_-8px_rgba(14,165,233,0.3)]"
          />
        </div>
        <h1
          className="text-[26px] md:text-[28px] font-extrabold mb-2 tracking-tight"
          style={{
            background: "linear-gradient(90deg, #0ea5e9, #e0e7ff, #8b5cf6, #0ea5e9, #e0e7ff)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s ease-in-out infinite",
          }}
        >מערכת ניהול וניטור</h1>
        <p
          className="text-[18px] md:text-[20px] font-extrabold tracking-widest"
          style={{
            background: "linear-gradient(90deg, #0ea5e9, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          dir="ltr"
        >DIGITALCRAFT</p>
        <p className="text-[12px] text-zinc-500 mt-1.5 font-medium">ניהול פרויקטים מתקדם</p>
      </div>

      {/* Form */}
      <div className="surface rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-[13px] text-red-400 text-center">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-[13px] font-medium text-zinc-300 mb-2">סיסמה</label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="סיסמה"
                className="w-full ps-12 pe-14 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 focus:border-sky-500/30 transition-all"
                required
                dir="ltr"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/[0.06] text-zinc-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-l from-sky-500 to-violet-500 text-white font-bold text-sm rounded-xl hover:from-sky-400 hover:to-violet-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_30px_-8px_rgba(14,165,233,0.3)]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
