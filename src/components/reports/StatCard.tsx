import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  glow?: "blue" | "emerald" | "amber" | "violet";
}

const glowMap = {
  blue: "shadow-[0_0_30px_-8px_rgba(59,130,246,0.12)]",
  emerald: "shadow-[0_0_30px_-8px_rgba(16,185,129,0.12)]",
  amber: "shadow-[0_0_30px_-8px_rgba(245,158,11,0.12)]",
  violet: "shadow-[0_0_30px_-8px_rgba(139,92,246,0.12)]",
};

const iconBgMap = {
  blue: "bg-blue-500/[0.06] text-blue-400",
  emerald: "bg-emerald-500/[0.06] text-emerald-400",
  amber: "bg-amber-500/[0.06] text-amber-400",
  violet: "bg-violet-500/[0.06] text-violet-400",
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, glow = "blue" }: StatCardProps) {
  const hasTrend = trend !== undefined && trend !== 0;

  return (
    <div className={cn("relative surface rounded-2xl p-5 overflow-hidden", glowMap[glow])}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/[0.08] to-transparent" />
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBgMap[glow])}>
          <Icon className="w-5 h-5" />
        </div>
        {hasTrend && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
            trend! > 0 ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
          )}>
            {trend! > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
            <span>{Math.abs(trend!)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-[26px] font-extrabold text-white leading-none mb-1">{value}</h3>
      <p className="text-[12px] text-zinc-500 font-medium">{title}</p>
      {subtitle && <p className="text-[10px] text-zinc-600 mt-0.5">{subtitle}</p>}
    </div>
  );
}
