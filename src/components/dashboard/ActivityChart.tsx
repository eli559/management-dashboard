"use client";

import { BarChart3 } from "lucide-react";
import { useState } from "react";
import type { MonthlyCount } from "@/lib/dal/dashboard";

interface ActivityChartProps {
  data: MonthlyCount[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const hasData = data.some((d) => d.count > 0);
  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div className="relative surface rounded-2xl p-4 md:p-6 h-full animate-slide-up stagger-5 overflow-hidden">
      <div className="absolute top-0 start-1/4 w-60 h-40 bg-blue-500/[0.04] rounded-full blur-3xl" />
      <div className="absolute bottom-0 end-1/4 w-40 h-32 bg-violet-500/[0.03] rounded-full blur-3xl" />

      <div className="relative z-10 flex items-center justify-between mb-5 md:mb-8">
        <div>
          <h3 className="text-[14px] md:text-[15px] font-bold text-zinc-100 tracking-tight">סקירת פעילות</h3>
          <p className="text-[12px] md:text-[13px] text-zinc-400 mt-0.5 leading-relaxed">12 החודשים האחרונים</p>
        </div>
        {/* Active bar tooltip — mobile friendly */}
        {activeBar !== null && (
          <div className="glass-strong px-3 py-1.5 rounded-lg text-[11px] font-bold text-white animate-[fade-in_0.15s_ease]">
            {data[activeBar]?.month}: {data[activeBar]?.count.toLocaleString("he-IL")}
          </div>
        )}
      </div>

      <div className="relative z-10">
        {hasData ? (
          <div className="flex items-end gap-1 md:gap-[6px] h-36 md:h-52 px-0.5 md:px-1" dir="ltr">
            {data.map((item, i) => {
              const heightPct = (item.count / maxCount) * 100;
              const isActive = activeBar === i;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 md:gap-2.5">
                  {/* Bar — touch target is full width, min 44px tall */}
                  <div
                    className="w-full relative cursor-pointer min-h-[44px] flex items-end"
                    onClick={() => setActiveBar(isActive ? null : i)}
                    onMouseEnter={() => setActiveBar(i)}
                    onMouseLeave={() => setActiveBar(null)}
                  >
                    {/* Desktop tooltip */}
                    <div className="hidden md:block absolute -top-10 left-1/2 -translate-x-1/2 glass-strong text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none scale-90 group-hover:scale-100 z-20">
                      {item.count.toLocaleString("he-IL")}
                    </div>
                    <div
                      className="w-full rounded-md transition-all duration-300 animate-bar-rise"
                      style={{
                        height: `${Math.max((heightPct / 100) * 144, 3)}px`,
                        background: item.count > 0
                          ? isActive
                            ? "linear-gradient(to top, rgba(59,130,246,0.8), rgba(99,102,241,0.4))"
                            : "linear-gradient(to top, rgba(59,130,246,0.6), rgba(99,102,241,0.2))"
                          : "rgba(255,255,255,0.03)",
                        boxShadow: item.count > 0
                          ? isActive
                            ? "0 0 20px -2px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"
                            : "0 0 16px -4px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.1)"
                          : "none",
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  </div>
                  <span className="text-[9px] md:text-[10px] text-zinc-400 font-medium">{item.month}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-36 md:h-52 text-center">
            <BarChart3 className="w-8 h-8 text-zinc-600 mb-3" />
            <p className="text-[13px] text-zinc-400 font-medium">אין נתונים עדיין</p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">הגרף יתעדכן ברגע שיתקבלו אירועים</p>
          </div>
        )}
      </div>
    </div>
  );
}
