import { cn } from "@/utils/cn";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  color?: "blue" | "violet" | "emerald" | "amber";
  className?: string;
  showArea?: boolean;
}

const colorDefs = {
  blue: { stroke: "#3b82f6", fill: "59,130,246" },
  violet: { stroke: "#8b5cf6", fill: "139,92,246" },
  emerald: { stroke: "#10b981", fill: "16,185,129" },
  amber: { stroke: "#f59e0b", fill: "245,158,11" },
};

export function LineChart({ title, subtitle, data, color = "blue", className, showArea = true }: LineChartProps) {
  const hasData = data.some((d) => d.value > 0);
  const c = colorDefs[color];

  if (!hasData) {
    return (
      <div className={cn("surface rounded-2xl p-6 overflow-hidden relative", className)}>
        <h3 className="text-[15px] font-bold text-zinc-200 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-40 text-[13px] text-zinc-600">אין נתונים</div>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const w = 500;
  const h = 160;
  const padX = 0;
  const padY = 8;

  const points = data.map((d, i) => ({
    x: padX + (i / Math.max(data.length - 1, 1)) * (w - padX * 2),
    y: padY + (1 - d.value / maxVal) * (h - padY * 2),
  }));

  const linePath = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const areaPath = `${linePath} L${w - padX},${h} L${padX},${h} Z`;

  return (
    <div className={cn("surface rounded-2xl p-6 overflow-hidden relative", className)}>
      <h3 className="text-[15px] font-bold text-zinc-200 mb-0.5">{title}</h3>
      {subtitle && <p className="text-[12px] text-zinc-600 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`lg-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(${c.fill},0.25)`} />
            <stop offset="100%" stopColor={`rgba(${c.fill},0)`} />
          </linearGradient>
        </defs>
        {showArea && <path d={areaPath} fill={`url(#lg-${color})`} />}
        <path d={linePath} fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        {/* Dots on hover points */}
        {points.filter((_, i) => i % Math.max(Math.floor(data.length / 8), 1) === 0).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={c.stroke} opacity="0.6" />
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1.5 px-0.5">
        {data.filter((_, i) => i % Math.max(Math.floor(data.length / 6), 1) === 0).map((d, i) => (
          <span key={i} className="text-[8px] text-zinc-700">{d.label}</span>
        ))}
      </div>
    </div>
  );
}
