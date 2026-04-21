import Link from "next/link";
import { Activity, Zap } from "lucide-react";
import { EventBadge } from "@/components/ui/EventBadge";
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
    <div className="relative surface rounded-2xl p-6 h-full animate-slide-up stagger-6 overflow-hidden">

      {/* כותרת */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-200">פעילות אחרונה</h3>
          <p className="text-[13px] text-zinc-400 mt-0.5">
            אירועים אחרונים במערכת
          </p>
        </div>
      </div>

      {/* רשימה */}
      <div className="relative z-10">
        {events.length > 0 ? (
          <div className="space-y-0.5">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/projects/${event.project.slug}`}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.04] border border-white/[0.06] text-zinc-400 transition-transform duration-200 group-hover:scale-105">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <EventBadge eventName={event.eventName} />
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
            <Activity className="w-7 h-7 text-zinc-700 mx-auto mb-3" />
            <p className="text-[13px] text-zinc-400">אין פעילות עדיין</p>
            <p className="text-[11px] text-zinc-400 mt-1">
              אירועים יופיעו כאן ברגע שיישלחו דרך ה-API
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
