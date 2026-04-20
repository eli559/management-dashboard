import { cn } from "@/utils/cn";

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
  "rgba(59,130,246,0.7)",
  "rgba(139,92,246,0.7)",
  "rgba(16,185,129,0.7)",
  "rgba(245,158,11,0.7)",
  "rgba(236,72,153,0.7)",
  "rgba(14,165,233,0.7)",
  "rgba(168,85,247,0.7)",
  "rgba(34,197,94,0.7)",
];

export function DonutChart({ title, subtitle, items, className }: DonutChartProps) {
  const total = items.reduce((sum, i) => sum + i.value, 0);
  if (total === 0) {
    return (
      <div className={cn("surface rounded-2xl p-6 overflow-hidden relative", className)}>
        <h3 className="text-[15px] font-bold text-zinc-200 mb-4">{title}</h3>
        <div className="text-center py-10 text-[13px] text-zinc-600">אין נתונים</div>
      </div>
    );
  }

  const segments: DonutSegment[] = items.slice(0, 8).map((item, i) => ({
    label: item.label,
    value: item.value,
    color: COLORS[i % COLORS.length],
  }));

  // SVG donut
  const size = 140;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={cn("surface rounded-2xl p-6 overflow-hidden relative", className)}>
      <h3 className="text-[15px] font-bold text-zinc-200 mb-0.5">{title}</h3>
      {subtitle && <p className="text-[12px] text-zinc-600 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}

      <div className="flex items-center gap-6">
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
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[20px] font-extrabold text-white">{total.toLocaleString("he-IL")}</p>
              <p className="text-[9px] text-zinc-500">סה״כ</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5">
          {segments.map((seg) => {
            const pct = Math.round((seg.value / total) * 100);
            return (
              <div key={seg.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                <span className="text-[11px] text-zinc-400 truncate flex-1">{seg.label}</span>
                <span className="text-[10px] text-zinc-500 tabular-nums">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
