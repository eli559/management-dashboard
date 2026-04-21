import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

type GlowColor = "blue" | "emerald" | "amber" | "violet";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
  glow?: GlowColor;
  stagger?: number;
}

const glowStyles: Record<GlowColor, { bg: string; icon: string; ring: string }> = {
  blue: {
    bg: "bg-blue-500/[0.06]",
    icon: "text-blue-400",
    ring: "shadow-[0_0_40px_-8px_rgba(59,130,246,0.15)]",
  },
  emerald: {
    bg: "bg-emerald-500/[0.06]",
    icon: "text-emerald-400",
    ring: "shadow-[0_0_40px_-8px_rgba(16,185,129,0.15)]",
  },
  amber: {
    bg: "bg-amber-500/[0.06]",
    icon: "text-amber-400",
    ring: "shadow-[0_0_40px_-8px_rgba(245,158,11,0.15)]",
  },
  violet: {
    bg: "bg-violet-500/[0.06]",
    icon: "text-violet-400",
    ring: "shadow-[0_0_40px_-8px_rgba(139,92,246,0.15)]",
  },
};

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  glow = "blue",
  stagger = 1,
}: KpiCardProps) {
  const isPositive = change >= 0;
  const showTrend = change !== 0;
  const g = glowStyles[glow];

  return (
    <div
      className={cn(
        "relative surface rounded-2xl p-6 group overflow-hidden",
        "hover:-translate-y-0.5",
        "transition-all duration-300 ease-out",
        g.ring,
        "animate-slide-up",
        `stagger-${stagger}`
      )}
    >
      {/* Colored glow background */}
      <div
        className={cn(
          "absolute -top-10 -end-10 w-32 h-32 rounded-full blur-3xl opacity-40 transition-opacity duration-500 group-hover:opacity-70",
          g.bg
        )}
      />

      {/* Top highlight */}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border border-white/[0.06] transition-transform duration-300 group-hover:scale-110", g.bg)}>
            <Icon className={cn("w-[22px] h-[22px]", g.icon)} />
          </div>
          {showTrend && (
            <div
              className={cn(
                "flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full",
                isPositive
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-red-400 bg-red-500/10"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        <h3 className="text-[34px] font-extrabold text-white mb-1 tracking-tight leading-none">
          {value}
        </h3>
        <p className="text-[13px] text-zinc-400 font-medium">{title}</p>
        <p className="text-[11px] text-zinc-400 mt-1.5">{changeLabel}</p>
      </div>
    </div>
  );
}
