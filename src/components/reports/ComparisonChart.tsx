import { cn } from "@/utils/cn";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PeriodComparison } from "@/lib/dal/reports";
import { formatNumber } from "@/utils/formatters";

interface ComparisonChartProps {
  comparison: PeriodComparison;
  days: number;
  className?: string;
}

export function ComparisonChart({ comparison, days, className }: ComparisonChartProps) {
  const { current, previous, changePercent } = comparison;
  const maxVal = Math.max(current, previous, 1);
  const isUp = changePercent > 0;
  const isDown = changePercent < 0;

  return (
    <div className={cn("surface rounded-2xl p-6 overflow-hidden relative", className)}>
      <h3 className="text-[15px] font-bold text-zinc-200 mb-0.5">השוואת תקופות</h3>
      <p className="text-[12px] text-zinc-600 mb-5">{days} ימים אחרונים מול {days} ימים לפני</p>

      <div className="flex items-end gap-6 justify-center mb-4">
        {/* Previous */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-full max-w-[80px] rounded-lg overflow-hidden" style={{ height: "100px" }}>
            <div
              className="w-full bg-zinc-700/30 rounded-lg transition-all duration-700"
              style={{ height: `${(previous / maxVal) * 100}%`, marginTop: `${100 - (previous / maxVal) * 100}%` }}
            />
          </div>
          <p className="text-[18px] font-bold text-zinc-400">{formatNumber(previous)}</p>
          <p className="text-[10px] text-zinc-600">תקופה קודמת</p>
        </div>

        {/* Trend */}
        <div className="flex flex-col items-center gap-1 pb-8">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isUp ? "bg-emerald-500/10 text-emerald-400" : isDown ? "bg-red-500/10 text-red-400" : "bg-zinc-800 text-zinc-500"
          )}>
            {isUp ? <TrendingUp className="w-5 h-5" /> : isDown ? <TrendingDown className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
          </div>
          <span className={cn(
            "text-[14px] font-bold",
            isUp ? "text-emerald-400" : isDown ? "text-red-400" : "text-zinc-500"
          )}>
            {changePercent > 0 ? "+" : ""}{changePercent}%
          </span>
        </div>

        {/* Current */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-full max-w-[80px] rounded-lg overflow-hidden" style={{ height: "100px" }}>
            <div
              className="w-full rounded-lg transition-all duration-700"
              style={{
                height: `${(current / maxVal) * 100}%`,
                marginTop: `${100 - (current / maxVal) * 100}%`,
                background: isUp ? "rgba(16,185,129,0.3)" : isDown ? "rgba(239,68,68,0.3)" : "rgba(161,161,170,0.3)",
              }}
            />
          </div>
          <p className="text-[18px] font-bold text-white">{formatNumber(current)}</p>
          <p className="text-[10px] text-zinc-500">תקופה נוכחית</p>
        </div>
      </div>
    </div>
  );
}
