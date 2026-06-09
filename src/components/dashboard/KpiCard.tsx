import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

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

const glowStyles: Record<GlowColor, { bg: string; icon: string; ring: string; gradient: string }> = {
  blue: {
    bg: "bg-blue-500/[0.08]",
    icon: "text-blue-400",
    ring: "shadow-[0_0_40px_-8px_rgba(59,130,246,0.2)]",
    gradient: "from-blue-500/[0.08] to-transparent",
  },
  emerald: {
    bg: "bg-emerald-500/[0.08]",
    icon: "text-emerald-400",
    ring: "shadow-[0_0_40px_-8px_rgba(16,185,129,0.2)]",
    gradient: "from-emerald-500/[0.08] to-transparent",
  },
  amber: {
    bg: "bg-amber-500/[0.08]",
    icon: "text-amber-400",
    ring: "shadow-[0_0_40px_-8px_rgba(245,158,11,0.2)]",
    gradient: "from-amber-500/[0.08] to-transparent",
  },
  violet: {
    bg: "bg-violet-500/[0.08]",
    icon: "text-violet-400",
    ring: "shadow-[0_0_40px_-8px_rgba(139,92,246,0.2)]",
    gradient: "from-violet-500/[0.08] to-transparent",
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
        "relative surface rounded-2xl p-4 md:p-6 group overflow-hidden card-press",
        "transition-all duration-300 ease-out",
        g.ring,
        "animate-slide-up",
        `stagger-${stagger}`
      )}
    >
      {/* Colored glow background — animated */}
      <div
        className={cn(
          "absolute -top-10 -end-10 w-36 h-36 rounded-full blur-3xl animate-glow-pulse",
          g.bg
        )}
      />
      {/* Bottom gradient accent */}
      <div className={cn("absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t opacity-60", g.gradient)} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className={cn(
            "w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center",
            "border border-white/[0.06] transition-transform duration-300 group-hover:scale-110",
            g.bg
          )}>
            <Icon className={cn("w-5 h-5 md:w-[21px] md:h-[21px]", g.icon)} />
          </div>
          {showTrend && (
            <div
              className={cn(
                "flex items-center gap-1 text-[10px] md:text-[11px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full",
                isPositive
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-red-400 bg-red-500/10"
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        <h3 className="text-[clamp(1.25rem,5vw,2.125rem)] font-extrabold text-white mb-0.5 tracking-tight leading-none">
          <AnimatedNumber value={value} duration={1400} />
        </h3>
        <p className="text-[12px] md:text-[13px] text-zinc-200 font-semibold leading-snug">{title}</p>
        <p className="text-[10px] md:text-[11px] text-zinc-400 mt-1 md:mt-1.5 hidden sm:block leading-relaxed">{changeLabel}</p>
      </div>
    </div>
  );
}
