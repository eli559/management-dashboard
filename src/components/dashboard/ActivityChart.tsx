import { BarChart3 } from "lucide-react";
import type { MonthlyCount } from "@/lib/dal/dashboard";

interface ActivityChartProps {
  data: MonthlyCount[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const hasData = data.some((d) => d.count > 0);

  return (
    <div className="relative surface rounded-2xl p-6 h-full animate-slide-up stagger-5 overflow-hidden">
      <div className="absolute top-0 start-1/3 w-60 h-40 bg-blue-500/[0.03] rounded-full blur-3xl" />

      {/* כותרת */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-200">סקירת פעילות</h3>
          <p className="text-[13px] text-zinc-300 mt-0.5">
            12 החודשים האחרונים
          </p>
        </div>
      </div>

      {/* גרף */}
      <div className="relative z-10">
        {hasData ? (
          <div className="flex items-end gap-[6px] h-52 px-1">
            {data.map((item, i) => {
              const heightPct = (item.count / maxCount) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2.5"
                >
                  <div className="w-full relative group cursor-pointer">
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass-strong text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none scale-90 group-hover:scale-100 z-20">
                      {item.count.toLocaleString("he-IL")}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/[0.05] rotate-45 border-b border-r border-white/[0.08]" />
                    </div>
                    <div
                      className="w-full rounded-md transition-all duration-300 animate-bar-rise group-hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.3)]"
                      style={{
                        height: `${Math.max((heightPct / 100) * 208, 4)}px`,
                        background:
                          item.count > 0
                            ? "linear-gradient(to top, rgba(59,130,246,0.3), rgba(59,130,246,0.08))"
                            : "rgba(255,255,255,0.03)",
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-300 font-medium">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-52 text-center">
            <BarChart3 className="w-8 h-8 text-zinc-700 mb-3" />
            <p className="text-[13px] text-zinc-300">אין נתונים עדיין</p>
            <p className="text-[11px] text-zinc-300 mt-1">
              הגרף יתעדכן ברגע שיתקבלו אירועים
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
