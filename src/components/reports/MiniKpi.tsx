import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MiniKpiProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  sparkData?: number[];
  color?: "blue" | "emerald" | "amber" | "violet" | "zinc";
}

const colorMap = {
  blue: { icon: "text-blue-400", spark: "rgba(59,130,246,0.5)", glow: "shadow-[0_0_20px_-6px_rgba(59,130,246,0.1)]" },
  emerald: { icon: "text-emerald-400", spark: "rgba(16,185,129,0.5)", glow: "shadow-[0_0_20px_-6px_rgba(16,185,129,0.1)]" },
  amber: { icon: "text-amber-400", spark: "rgba(245,158,11,0.5)", glow: "shadow-[0_0_20px_-6px_rgba(245,158,11,0.1)]" },
  violet: { icon: "text-violet-400", spark: "rgba(139,92,246,0.5)", glow: "shadow-[0_0_20px_-6px_rgba(139,92,246,0.1)]" },
  zinc: { icon: "text-zinc-400", spark: "rgba(161,161,170,0.5)", glow: "" },
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 56;
  const h = 20;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - (v / max) * h,
  }));
  const path = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const areaPath = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z]/g, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color.replace(/[^a-z]/g, "")})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MiniKpi({ label, value, icon: Icon, trend, sparkData, color = "blue" }: MiniKpiProps) {
  const c = colorMap[color];

  return (
    <div className={cn("glass rounded-xl p-3.5 overflow-hidden relative group hover:bg-white/[0.02] transition-all duration-200", c.glow)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/[0.06] to-transparent" />

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", c.icon)} />
            <span className="text-[10px] text-zinc-500 font-medium truncate">{label}</span>
          </div>
          <p className="text-[20px] font-extrabold text-white leading-none">{value}</p>
          {trend !== undefined && (
            <div className={cn(
              "flex items-center gap-0.5 mt-1.5 text-[9px] font-semibold",
              trend > 0 ? "text-emerald-400" : trend < 0 ? "text-red-400" : "text-zinc-600"
            )}>
              {trend > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : trend < 0 ? <TrendingDown className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
              <span>{trend > 0 ? "+" : ""}{trend}%</span>
            </div>
          )}
        </div>

        {sparkData && sparkData.length > 1 && (
          <div className="mt-2">
            <MiniSparkline data={sparkData} color={c.spark} />
          </div>
        )}
      </div>
    </div>
  );
}
