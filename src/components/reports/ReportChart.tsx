import { cn } from "@/utils/cn";

interface DataPoint {
  label: string;
  value: number;
}

interface ReportChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  color?: "blue" | "violet" | "emerald" | "amber";
  type?: "bar" | "area";
  emptyText?: string;
  className?: string;
}

const colorMap = {
  blue: { bar: "rgba(59,130,246,0.35)", barHover: "rgba(59,130,246,0.5)", glow: "rgba(59,130,246,0.2)", area: "rgba(59,130,246,0.08)" },
  violet: { bar: "rgba(139,92,246,0.35)", barHover: "rgba(139,92,246,0.5)", glow: "rgba(139,92,246,0.2)", area: "rgba(139,92,246,0.08)" },
  emerald: { bar: "rgba(16,185,129,0.35)", barHover: "rgba(16,185,129,0.5)", glow: "rgba(16,185,129,0.2)", area: "rgba(16,185,129,0.08)" },
  amber: { bar: "rgba(245,158,11,0.35)", barHover: "rgba(245,158,11,0.5)", glow: "rgba(245,158,11,0.2)", area: "rgba(245,158,11,0.08)" },
};

export function ReportChart({
  title,
  subtitle,
  data,
  color = "blue",
  type = "bar",
  emptyText = "אין נתונים",
  className,
}: ReportChartProps) {
  const hasData = data.some((d) => d.value > 0);
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const c = colorMap[color];

  return (
    <div className={cn("relative glass rounded-2xl p-6 overflow-hidden", className)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/[0.08] to-transparent" />

      <h3 className="text-[15px] font-bold text-zinc-200 mb-0.5">{title}</h3>
      {subtitle && <p className="text-[12px] text-zinc-600 mb-5">{subtitle}</p>}
      {!subtitle && <div className="mb-5" />}

      {hasData ? (
        <div className="flex items-end gap-[3px] h-40">
          {data.map((item, i) => {
            const pct = (item.value / maxVal) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full relative cursor-pointer">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 glass-strong text-white text-[9px] font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-20">
                    {item.value.toLocaleString("he-IL")}
                  </div>
                  {type === "bar" ? (
                    <div
                      className="w-full rounded-sm transition-all duration-300 animate-bar-rise"
                      style={{
                        height: `${Math.max((pct / 100) * 160, 2)}px`,
                        background: `linear-gradient(to top, ${c.bar}, ${c.area})`,
                        animationDelay: `${i * 30}ms`,
                      }}
                    />
                  ) : (
                    <div
                      className="w-full rounded-sm transition-all duration-300 animate-bar-rise"
                      style={{
                        height: `${Math.max((pct / 100) * 160, 2)}px`,
                        background: `linear-gradient(to top, ${c.bar}, transparent)`,
                        animationDelay: `${i * 30}ms`,
                      }}
                    />
                  )}
                </div>
                {data.length <= 31 && (
                  <span className="text-[8px] text-zinc-700 font-medium truncate max-w-full">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-[13px] text-zinc-600">
          {emptyText}
        </div>
      )}
    </div>
  );
}
