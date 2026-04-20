import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
}

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
}: KpiCardProps) {
  const isPositive = change >= 0;
  const showTrend = change !== 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-zinc-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <Icon className="w-5 h-5 text-zinc-600" />
        </div>
        {showTrend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
              isPositive
                ? "text-emerald-800 bg-emerald-50/80"
                : "text-red-800 bg-red-50/80"
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
      <h3 className="text-[28px] font-extrabold text-zinc-900 mb-0.5 tracking-tight">
        {value}
      </h3>
      <p className="text-sm text-zinc-500 font-medium">{title}</p>
      <p className="text-xs text-zinc-400 mt-1">{changeLabel}</p>
    </div>
  );
}
