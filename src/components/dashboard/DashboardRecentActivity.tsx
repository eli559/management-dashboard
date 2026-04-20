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
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 h-full">
      {/* כותרת */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">פעילות אחרונה</h3>
          <p className="text-sm text-zinc-500 mt-0.5">
            אירועים אחרונים במערכת
          </p>
        </div>
      </div>

      {/* רשימת פעילות */}
      {events.length > 0 ? (
        <div className="space-y-1">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/projects/${event.project.slug}`}
              className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-zinc-100 text-zinc-600 transition-transform duration-200 group-hover:scale-105">
                <Zap className="w-[18px] h-[18px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge>{event.eventName}</Badge>
                </div>
                <p className="text-[13px] text-zinc-500 truncate mt-0.5">
                  {event.project.name}
                </p>
              </div>
              <span className="text-[11px] text-zinc-400 flex-shrink-0 mt-0.5 font-medium">
                {formatRelativeTime(event.createdAt)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">אין פעילות עדיין</p>
          <p className="text-[12px] text-zinc-400 mt-1">
            אירועים יופיעו כאן ברגע שיישלחו דרך ה-API
          </p>
        </div>
      )}
    </div>
  );
}
