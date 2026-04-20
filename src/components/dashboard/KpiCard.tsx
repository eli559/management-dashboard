import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor,
  iconBg,
}: KpiCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
            iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
            isPositive
              ? "text-emerald-700 bg-emerald-50"
              : "text-red-700 bg-red-50"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-[28px] font-extrabold text-slate-900 mb-0.5 tracking-tight">
        {value}
      </h3>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{changeLabel}</p>
    </div>
  );
}
