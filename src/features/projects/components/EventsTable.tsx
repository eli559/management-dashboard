import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";
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
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-12 text-center">
        <p className="text-sm text-zinc-500">אין אירועים עדיין</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100">
              <th className="text-start text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3.5">
                אירוע
              </th>
              <th className="text-start text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3.5">
                משתמש
              </th>
              <th className="text-start text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3.5">
                עמוד
              </th>
              <th className="text-start text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3.5">
                ערך
              </th>
              <th className="text-start text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3.5">
                זמן
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr
                key={event.id}
                className={cn(
                  "hover:bg-zinc-50 transition-colors",
                  idx < events.length - 1 && "border-b border-zinc-50"
                )}
              >
                <td className="px-6 py-3.5">
                  <Badge>{event.eventName}</Badge>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-sm text-zinc-700 font-mono text-[12px]">
                    {event.userIdentifier ?? "—"}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className="text-sm text-zinc-500 font-mono text-[12px] truncate max-w-[200px] block"
                    dir="ltr"
                  >
                    {event.page ?? "—"}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-sm text-zinc-700 tabular-nums">
                    {event.value != null ? event.value : "—"}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-[12px] text-zinc-400 whitespace-nowrap">
                    {formatRelativeTime(event.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
