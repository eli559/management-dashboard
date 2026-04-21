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
  blue: { icon: "text-blue-400", spark: "rgba(59,130,246,0.6)", accent: "rgba(59,130,246,0.08)", glow: "shadow-[0_0_30px_-6px_rgba(59,130,246,0.15)]" },
  emerald: { icon: "text-emerald-400", spark: "rgba(16,185,129,0.6)", accent: "rgba(16,185,129,0.08)", glow: "shadow-[0_0_30px_-6px_rgba(16,185,129,0.15)]" },
  amber: { icon: "text-amber-400", spark: "rgba(245,158,11,0.6)", accent: "rgba(245,158,11,0.08)", glow: "shadow-[0_0_30px_-6px_rgba(245,158,11,0.15)]" },
  violet: { icon: "text-violet-400", spark: "rgba(139,92,246,0.6)", accent: "rgba(139,92,246,0.08)", glow: "shadow-[0_0_30px_-6px_rgba(139,92,246,0.15)]" },
  zinc: { icon: "text-zinc-400", spark: "rgba(161,161,170,0.5)", accent: "rgba(161,161,170,0.05)", glow: "" },
};

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 64;
  const h = 26;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - 2 - (v / max) * (h - 4),
  }));
  const path = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const areaPath = `${path} L${w},${h} L0,${h} Z`;
  const gradId = `sp-${color.replace(/[^a-z0-9]/g, "")}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.5" fill={color} />
    </svg>
  );
}

export function MiniKpi({ label, value, icon: Icon, trend, sparkData, color = "blue" }: MiniKpiProps) {
  const c = colorMap[color];

  return (
    <div className={cn("surface-sm rounded-xl p-3.5 overflow-hidden relative group", c.glow)}>
      {/* Color accent glow at top */}
      <div className="absolute top-0 start-1/3 w-16 h-8 rounded-full blur-xl pointer-events-none" style={{ background: c.accent }} />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", c.icon)} />
            <span className="text-[10px] text-zinc-400 font-medium truncate">{label}</span>
          </div>
          <p className="text-[22px] font-extrabold text-white leading-none tracking-tight">{value}</p>
          {trend !== undefined && (
            <div className={cn(
              "flex items-center gap-0.5 mt-2 text-[9px] font-bold",
              trend > 0 ? "text-emerald-400" : trend < 0 ? "text-red-400" : "text-zinc-400"
            )}>
              {trend > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : trend < 0 ? <TrendingDown className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
              <span>{trend > 0 ? "+" : ""}{trend}%</span>
            </div>
          )}
        </div>

        {sparkData && sparkData.length > 1 && (
          <div className="mt-3">
            <MiniSparkline data={sparkData} color={c.spark} />
          </div>
        )}
      </div>
    </div>
  );
}
