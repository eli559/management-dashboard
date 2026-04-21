import { EventBadge } from "@/components/ui/EventBadge";
import { PieChart } from "lucide-react";
import type { EventBreakdown as EventBreakdownData } from "@/lib/dal/dashboard";

interface EventBreakdownProps {
  data: EventBreakdownData[];
  totalEvents: number;
}

export function EventBreakdown({ data, totalEvents }: EventBreakdownProps) {
  const hasData = data.length > 0;

  return (
    <div className="relative glass rounded-2xl p-6 animate-slide-up stagger-5 overflow-hidden">

      <h3 className="text-[15px] font-bold text-zinc-200 mb-1">חלוקה לפי סוג אירוע</h3>
      <p className="text-[13px] text-zinc-600 mb-5">כל סוגי האירועים שנקלטו</p>

      {hasData ? (
        <div className="space-y-2.5">
          {data.map((item) => {
            const pct = totalEvents > 0 ? (item.count / totalEvents) * 100 : 0;
            return (
              <div key={item.eventName} className="flex items-center gap-3">
                <EventBadge eventName={item.eventName} />
                <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-blue-500/40 to-blue-500/20 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
                <span className="text-[12px] text-zinc-500 tabular-nums w-12 text-start">
                  {item.count.toLocaleString("he-IL")}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <PieChart className="w-7 h-7 text-zinc-700 mx-auto mb-3" />
          <p className="text-[13px] text-zinc-500">אין נתונים עדיין</p>
        </div>
      )}
    </div>
  );
}
