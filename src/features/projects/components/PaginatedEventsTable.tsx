"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventBadge } from "@/components/ui/EventBadge";
import { getPageLabel } from "@/lib/page-labels";
import { enrichEventDescription } from "@/lib/event-enrichment";
import { cn } from "@/utils/cn";

interface EventRow {
  id: string;
  eventName: string;
  userIdentifier: string | null;
  sessionId: string | null;
  page: string | null;
  value: number | null;
  metadata: string;
  createdAt: string;
}

interface Props {
  events: EventRow[];
  totalEvents: number;
}

const PAGE_SIZE = 30;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "עכשיו";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שע׳`;
  return `לפני ${Math.floor(hours / 24)} ימים`;
}

export function PaginatedEventsTable({ events, totalEvents }: Props) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visible = events.slice(start, start + PAGE_SIZE);

  if (events.length === 0) {
    return (
      <div className="surface rounded-2xl p-10 md:p-12 text-center">
        <p className="text-[13px] text-zinc-400">אין אירועים עדיין</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-2">
        {visible.map((event) => {
          const desc = enrichEventDescription(event.eventName, event.metadata);
          return (
            <div key={event.id} className="surface rounded-xl p-3.5 card-press">
              <div className="flex items-center justify-between mb-1.5">
                <EventBadge eventName={event.eventName} />
                <span className="text-[10px] text-zinc-400">{timeAgo(event.createdAt)}</span>
              </div>
              {desc && <p className="text-[12px] text-zinc-300 truncate mb-1">{desc}</p>}
              {event.page && <p className="text-[11px] text-zinc-400 truncate">{getPageLabel(event.page)}</p>}
            </div>
          );
        })}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">אירוע</th>
                <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">פרטים</th>
                <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">עמוד</th>
                <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">זמן</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((event, idx) => (
                <tr
                  key={event.id}
                  className={cn(
                    "hover:bg-white/[0.02] transition-colors",
                    idx < visible.length - 1 && "border-b border-white/[0.03]"
                  )}
                >
                  <td className="px-5 py-3"><EventBadge eventName={event.eventName} /></td>
                  <td className="px-5 py-3">
                    <span className="text-[12px] text-zinc-300 block max-w-[250px] truncate">
                      {enrichEventDescription(event.eventName, event.metadata) || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3"><span className="text-[12px] text-zinc-400 truncate max-w-[200px] block">{getPageLabel(event.page)}</span></td>
                  <td className="px-5 py-3"><span className="text-[11px] text-zinc-400 whitespace-nowrap">{timeAgo(event.createdAt)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 transition-all tap-scale">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-[13px] text-zinc-400 tabular-nums">
            {start + 1}–{Math.min(start + PAGE_SIZE, events.length)} מתוך {totalEvents.toLocaleString("he-IL")}
          </span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 transition-all tap-scale">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
