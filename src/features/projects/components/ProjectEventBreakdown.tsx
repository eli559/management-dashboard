import { EventBadge } from "@/components/ui/EventBadge";
import { PieChart } from "lucide-react";
import type { EventNameBreakdown } from "@/lib/dal/events";

interface Props {
  data: EventNameBreakdown[];
  totalEvents: number;
}

export function ProjectEventBreakdown({ data, totalEvents }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="surface rounded-2xl p-6 overflow-hidden relative">
      <h3 className="text-[15px] font-bold text-zinc-200 mb-1">חלוקה לפי אירוע</h3>
      <p className="text-[13px] text-zinc-300 mb-5">סוגי אירועים שנקלטו בפרויקט</p>

      <div className="space-y-2.5">
        {data.map((item) => {
          const pct = totalEvents > 0 ? (item.count / totalEvents) * 100 : 0;
          return (
            <div key={item.eventName} className="flex items-center gap-3">
              <EventBadge eventName={item.eventName} />
              <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-violet-500/40 to-violet-500/20 rounded-full"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
              <span className="text-[12px] text-zinc-300 tabular-nums w-12 text-start">
                {item.count.toLocaleString("he-IL")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
