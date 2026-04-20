import Link from "next/link";
import { Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/utils/formatters";

interface RecentEvent {
  id: string;
  eventName: string;
  createdAt: Date;
  project: {
    name: string;
    slug: string;
  };
}

interface DashboardRecentActivityProps {
  events: RecentEvent[];
}

export function DashboardRecentActivity({
  events,
}: DashboardRecentActivityProps) {
  return (
    <div className="relative bg-white rounded-2xl border border-zinc-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 h-full animate-slide-up stagger-6">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-l from-transparent via-zinc-200/60 to-transparent rounded-t-2xl" />

      {/* כותרת */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-900">פעילות אחרונה</h3>
          <p className="text-[13px] text-zinc-400 mt-0.5">
            אירועים אחרונים במערכת
          </p>
        </div>
      </div>

      {/* רשימה */}
      {events.length > 0 ? (
        <div className="space-y-0.5">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/projects/${event.project.slug}`}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-50/80 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-zinc-50 border border-zinc-100/60 text-zinc-500 transition-transform duration-200 group-hover:scale-105">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge>{event.eventName}</Badge>
                </div>
                <p className="text-[12px] text-zinc-400 truncate mt-0.5">
                  {event.project.name}
                </p>
              </div>
              <span className="text-[10px] text-zinc-400 flex-shrink-0 mt-1 font-medium">
                {formatRelativeTime(event.createdAt)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Activity className="w-7 h-7 text-zinc-300 mx-auto mb-3" />
          <p className="text-[13px] text-zinc-500">אין פעילות עדיין</p>
          <p className="text-[11px] text-zinc-400 mt-1">
            אירועים יופיעו כאן ברגע שיישלחו דרך ה-API
          </p>
        </div>
      )}
    </div>
  );
}
