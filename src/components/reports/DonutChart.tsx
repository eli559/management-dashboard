import { cn } from "@/utils/cn";
import { getEventLabel } from "@/lib/event-labels";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  subtitle?: string;
  items: { label: string; value: number }[];
  className?: string;
}

const COLORS = [
  "rgba(59,130,246,0.8)",
  "rgba(245,158,11,0.8)",
  "rgba(16,185,129,0.8)",
  "rgba(168,85,247,0.8)",
  "rgba(236,72,153,0.8)",
  "rgba(14,165,233,0.8)",
  "rgba(234,179,8,0.8)",
  "rgba(239,68,68,0.8)",
  "rgba(99,102,241,0.8)",
  "rgba(20,184,166,0.8)",
  "rgba(249,115,22,0.8)",
  "rgba(132,204,22,0.8)",
];

export function DonutChart({ title, subtitle, items, className }: DonutChartProps) {
  const total = items.reduce((sum, i) => sum + i.value, 0);
  if (total === 0) {
    return (
      <div className={cn("surface rounded-2xl p-4 md:p-6 overflow-hidden relative", className)}>
        <h3 className="text-[14px] md:text-[15px] font-bold text-zinc-200 mb-4">{title}</h3>
        <div className="text-center py-10 text-[13px] text-zinc-400">אין נתונים</div>
      </div>
    );
  }

  const segments: DonutSegment[] = items.slice(0, 8).map((item, i) => ({
    label: item.label,
    value: item.value,
    color: COLORS[i % COLORS.length],
  }));

  const size = 120;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={cn("surface rounded-2xl p-4 md:p-6 overflow-hidden relative", className)}>
      <h3 className="text-[14px] md:text-[15px] font-bold text-zinc-200 mb-0.5">{title}</h3>
      {subtitle && <p className="text-[11px] md:text-[12px] text-zinc-400 mb-3 md:mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-3 md:mb-4" />}

      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
        {/* Donut SVG */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {segments.map((seg) => {
              const pct = seg.value / total;
              const dashLen = pct * circumference;
              const dashGap = circumference - dashLen;
              const currentOffset = offset;
              offset += dashLen;

              return (
                <circle
                  key={seg.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dashLen} ${dashGap}`}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                  style={{ animation: `area-fade 0.8s ease-out ${0.2 + (offset / circumference) * 0.6}s both` }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[18px] md:text-[20px] font-extrabold text-white tracking-tight">{total.toLocaleString("he-IL")}</p>
              <p className="text-[9px] text-zinc-400">סה״כ</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5 w-full">
          {segments.map((seg) => {
            const pct = Math.round((seg.value / total) * 100);
            return (
              <div key={seg.label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                <span className="text-[11px] md:text-[12px] text-zinc-200 truncate flex-1">{getEventLabel(seg.label)}</span>
                <span className="text-[10px] md:text-[11px] text-zinc-400 tabular-nums font-medium flex-shrink-0">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
