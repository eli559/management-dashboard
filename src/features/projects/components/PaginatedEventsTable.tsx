"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventBadge } from "@/components/ui/EventBadge";
import { cn } from "@/utils/cn";

interface EventRow {
  id: string;
  eventName: string;
  userIdentifier: string | null;
  sessionId: string | null;
  page: string | null;
  value: number | null;
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
      <div className="surface rounded-2xl p-12 text-center">
        <p className="text-sm text-zinc-300">אין אירועים עדיין</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
              {visible.map((event, idx) => (
                <tr
                  key={event.id}
                  className={cn(
                    "hover:bg-white/[0.02] transition-colors",
                    idx < visible.length - 1 && "border-b border-white/[0.03]"
                  )}
                >
                  <td className="px-6 py-3.5"><EventBadge eventName={event.eventName} /></td>
                  <td className="px-6 py-3.5"><span className="text-[12px] text-zinc-300 font-mono">{event.userIdentifier ?? "—"}</span></td>
                  <td className="px-6 py-3.5"><span className="text-[12px] text-zinc-300 font-mono truncate max-w-[200px] block" dir="ltr">{event.page ?? "—"}</span></td>
                  <td className="px-6 py-3.5"><span className="text-[12px] text-zinc-300 tabular-nums">{event.value != null ? event.value : "—"}</span></td>
                  <td className="px-6 py-3.5"><span className="text-[11px] text-zinc-300 whitespace-nowrap">{timeAgo(event.createdAt)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-[13px] text-zinc-300 tabular-nums">
            {start + 1}–{Math.min(start + PAGE_SIZE, events.length)} מתוך {totalEvents.toLocaleString("he-IL")}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
