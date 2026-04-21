import { cn } from "@/utils/cn";
import { EventBadge } from "@/components/ui/EventBadge";
import { formatRelativeTime } from "@/utils/formatters";

interface EventRow {
  id: string;
  eventName: string;
  userIdentifier: string | null;
  sessionId: string | null;
  page: string | null;
  value: number | null;
  createdAt: Date;
}

interface EventsTableProps {
  events: EventRow[];
}

export function EventsTable({ events }: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="surface rounded-2xl p-12 text-center">
        <p className="text-sm text-zinc-300">אין אירועים עדיין</p>
      </div>
    );
  }

  return (
    <div className="surface rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-6 py-3.5">אירוע</th>
              <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-6 py-3.5">משתמש</th>
              <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-6 py-3.5">עמוד</th>
              <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-6 py-3.5">ערך</th>
              <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-6 py-3.5">זמן</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr
                key={event.id}
                className={cn(
                  "hover:bg-white/[0.02] transition-colors",
                  idx < events.length - 1 && "border-b border-white/[0.03]"
                )}
              >
                <td className="px-6 py-3.5"><EventBadge eventName={event.eventName} /></td>
                <td className="px-6 py-3.5"><span className="text-[12px] text-zinc-300 font-mono">{event.userIdentifier ?? "—"}</span></td>
                <td className="px-6 py-3.5"><span className="text-[12px] text-zinc-300 font-mono truncate max-w-[200px] block" dir="ltr">{event.page ?? "—"}</span></td>
                <td className="px-6 py-3.5"><span className="text-[12px] text-zinc-300 tabular-nums">{event.value != null ? event.value : "—"}</span></td>
                <td className="px-6 py-3.5"><span className="text-[11px] text-zinc-300 whitespace-nowrap">{formatRelativeTime(event.createdAt)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
