import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
  stagger?: number;
}

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  stagger = 1,
}: KpiCardProps) {
  const isPositive = change >= 0;
  const showTrend = change !== 0;

  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl p-6 border border-zinc-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] group",
        "hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-zinc-200/80 hover:-translate-y-0.5",
        "transition-all duration-300 ease-out",
        "animate-slide-up",
        `stagger-${stagger}`
      )}
    >
      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-l from-transparent via-zinc-200/60 to-transparent rounded-t-2xl" />

      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100/60 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <Icon className="w-[22px] h-[22px] text-zinc-500" />
        </div>
        {showTrend && (
          <div
            className={cn(
              "flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full",
              isPositive
                ? "text-emerald-700 bg-emerald-50/60"
                : "text-red-700 bg-red-50/60"
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

      <h3 className="text-[32px] font-extrabold text-zinc-900 mb-1 tracking-tight leading-none">
        {value}
      </h3>
      <p className="text-[13px] text-zinc-500 font-medium">{title}</p>
      <p className="text-[11px] text-zinc-400 mt-1.5">{changeLabel}</p>
    </div>
  );
}
