"use client";

import { useState } from "react";
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
  blue: { bar: "rgba(59,130,246,0.55)", glow: "rgba(59,130,246,0.3)", area: "rgba(59,130,246,0.15)", active: "rgba(59,130,246,0.75)" },
  violet: { bar: "rgba(139,92,246,0.55)", glow: "rgba(139,92,246,0.3)", area: "rgba(139,92,246,0.15)", active: "rgba(139,92,246,0.75)" },
  emerald: { bar: "rgba(16,185,129,0.55)", glow: "rgba(16,185,129,0.3)", area: "rgba(16,185,129,0.15)", active: "rgba(16,185,129,0.75)" },
  amber: { bar: "rgba(245,158,11,0.55)", glow: "rgba(245,158,11,0.3)", area: "rgba(245,158,11,0.15)", active: "rgba(245,158,11,0.75)" },
};

export function ReportChart({
  title, subtitle, data, color = "blue", type = "bar", emptyText = "אין נתונים", className,
}: ReportChartProps) {
  const hasData = data.some((d) => d.value > 0);
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const c = colorMap[color];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className={cn("relative surface rounded-2xl p-4 md:p-6 overflow-hidden", className)}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[14px] md:text-[15px] font-bold text-zinc-200">{title}</h3>
        {active !== null && (
          <span className="glass-strong px-2.5 py-1 rounded-lg text-[10px] font-bold text-white animate-[fade-in_0.15s_ease]">
            {data[active]?.label}: {data[active]?.value.toLocaleString("he-IL")}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[11px] md:text-[12px] text-zinc-400 mb-4 md:mb-5">{subtitle}</p>}
      {!subtitle && <div className="mb-4 md:mb-5" />}

      {hasData ? (
        <div className="flex items-end gap-px md:gap-[3px] h-32 md:h-40 w-full" dir="ltr">
          {data.map((item, i) => {
            const pct = (item.value / maxVal) * 100;
            const isActive = active === i;
            return (
              <div key={i} className="flex-1 min-w-0 flex flex-col items-center gap-1 md:gap-1.5">
                <div
                  className="w-full relative cursor-pointer min-h-[44px] flex items-end"
                  onClick={() => setActive(isActive ? null : i)}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  <div
                    className="w-full rounded-sm transition-all duration-300 animate-bar-rise"
                    style={{
                      height: `${Math.max((pct / 100) * 128, 2)}px`,
                      background: type === "bar"
                        ? `linear-gradient(to top, ${isActive ? c.active : c.bar}, ${c.area})`
                        : `linear-gradient(to top, ${isActive ? c.active : c.bar}, transparent)`,
                      boxShadow: type === "bar" ? `0 0 12px -2px ${c.glow}` : "none",
                      animationDelay: `${i * 30}ms`,
                    }}
                  />
                </div>
                {data.length <= 14 && (
                  <span className="text-[8px] md:text-[10px] text-zinc-400 font-medium truncate w-full text-center">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 md:h-40 text-[13px] text-zinc-400">{emptyText}</div>
      )}
    </div>
  );
}
