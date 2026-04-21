import { cn } from "@/utils/cn";
import type { HourlyCount, WeekdayCount } from "@/lib/dal/reports";

interface HeatmapGridProps {
  hourly: HourlyCount[];
  weekday: WeekdayCount[];
}

export function HeatmapGrid({ hourly, weekday }: HeatmapGridProps) {
  const maxHourly = Math.max(...hourly.map((h) => h.count), 1);
  const maxWeekday = Math.max(...weekday.map((w) => w.count), 1);

  return (
    <div className="surface rounded-2xl p-6 overflow-hidden relative">
      <h3 className="text-[15px] font-bold text-zinc-200 mb-0.5">פעילות לפי זמן</h3>
      <p className="text-[12px] text-zinc-300 mb-5">שעות ביום ● ימים בשבוע</p>

      <div className="grid grid-cols-2 gap-6">
        {/* Hourly */}
        <div>
          <p className="text-[11px] text-zinc-300 mb-3 font-medium">שעות היממה</p>
          <div className="grid grid-cols-12 gap-[3px]">
            {hourly.map((h) => {
              const intensity = h.count / maxHourly;
              return (
                <div
                  key={h.hour}
                  className="aspect-square rounded-[3px] transition-all duration-300 group relative cursor-pointer"
                  style={{
                    background:
                      intensity > 0
                        ? `rgba(59,130,246,${0.08 + intensity * 0.35})`
                        : "rgba(255,255,255,0.02)",
                  }}
                  title={`${h.hour}:00 — ${h.count} אירועים`}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 glass-strong text-white text-[8px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {h.hour}:00 — {h.count}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[8px] text-zinc-700">00:00</span>
            <span className="text-[8px] text-zinc-700">23:00</span>
          </div>
        </div>

        {/* Weekday */}
        <div>
          <p className="text-[11px] text-zinc-300 mb-3 font-medium">ימי השבוע</p>
          <div className="space-y-[3px]">
            {weekday.map((w) => {
              const intensity = w.count / maxWeekday;
              return (
                <div key={w.day} className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-300 w-10 text-start">{w.day}</span>
                  <div className="flex-1 h-[18px] bg-white/[0.02] rounded-[3px] overflow-hidden">
                    <div
                      className="h-full rounded-[3px] transition-all duration-500"
                      style={{
                        width: `${Math.max((w.count / maxWeekday) * 100, 2)}%`,
                        background: `rgba(139,92,246,${0.15 + intensity * 0.3})`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-300 tabular-nums w-8 text-start">
                    {w.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
