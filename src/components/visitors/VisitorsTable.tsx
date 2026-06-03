"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, ChevronLeft, ChevronRight, List, Monitor, Smartphone, Tablet } from "lucide-react";
import { EventBadge } from "@/components/ui/EventBadge";
import { cn } from "@/utils/cn";

interface Session {
  sessionId: string;
  projectName: string;
  projectSlug: string;
  firstSeen: string;
  lastSeen: string;
  pageCount: number;
  eventCount: number;
  pages: string[];
  events: string[];
  referrer: string | null;
  sourceKey: string;
  sourceLabel: string;
  deviceType: string;
  deviceName: string;
}

interface VisitorsTableProps {
  sessions: Session[];
  totalCount?: number;
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

function DeviceIcon({ type }: { type: string }) {
  if (type === "טלפון" || type === "mobile") return <Smartphone className="w-3.5 h-3.5" />;
  if (type === "טאבלט" || type === "tablet") return <Tablet className="w-3.5 h-3.5" />;
  return <Monitor className="w-3.5 h-3.5" />;
}

export function VisitorsTable({ sessions, totalCount }: VisitorsTableProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(sessions.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visible = sessions.slice(start, start + PAGE_SIZE);

  if (sessions.length === 0) {
    return (
      <div className="surface rounded-2xl p-12 md:p-16 text-center">
        <Users className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-zinc-200 mb-2">אין מבקרים עדיין</h3>
        <p className="text-[13px] text-zinc-400 max-w-sm mx-auto leading-relaxed">
          מבקרים יופיעו כאן ברגע שאנשים ייכנסו לאתרים עם ה-tracking מותקן
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => { setOpen(!open); setPage(0); }}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 tap-scale",
          open
            ? "bg-white/[0.08] text-white border border-white/[0.12]"
            : "bg-white/[0.04] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.06]"
        )}
      >
        <List className="w-4 h-4" />
        <span>{open ? "הסתר רשימת מבקרים" : "הצג רשימת מבקרים"}</span>
        <span className="text-[11px] text-zinc-400 bg-white/[0.06] px-2 py-0.5 rounded-full">
          {(totalCount ?? sessions.length).toLocaleString("he-IL")}
        </span>
      </button>

      {open && (
        <>
          {/* ── Mobile cards ── */}
          <div className="md:hidden space-y-2 animate-slide-up">
            {visible.map((session) => (
              <div key={session.sessionId} className="surface rounded-2xl p-4 card-press">
                <div className="flex items-center justify-between mb-2.5">
                  <Link href={`/projects/${session.projectSlug}`} className="text-[13px] font-semibold text-zinc-200 hover:text-white transition-colors">
                    {session.projectName}
                  </Link>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <DeviceIcon type={session.deviceType} />
                    <span>{session.deviceName}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {session.events.slice(0, 3).map((ev) => <EventBadge key={ev} eventName={ev} />)}
                  {session.events.length > 3 && <span className="text-[10px] text-zinc-400 self-center">+{session.events.length - 3}</span>}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="text-sky-400/80">{session.sourceLabel}</span>
                    <span>{session.eventCount} אירועים</span>
                  </div>
                  <span>{timeAgo(session.lastSeen)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop table ── */}
          <div className="hidden md:block surface rounded-2xl overflow-hidden animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">מבקר</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">פרויקט</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">מקור</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">פעולות</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">מכשיר</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-5 py-3">אחרון</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((session, idx) => (
                    <tr
                      key={session.sessionId}
                      className={cn(
                        "hover:bg-white/[0.02] transition-colors",
                        idx < visible.length - 1 && "border-b border-white/[0.03]"
                      )}
                    >
                      <td className="px-5 py-3">
                        <code className="text-[11px] text-zinc-400 font-mono" dir="ltr">
                          {session.sessionId.substring(0, 10)}...
                        </code>
                      </td>
                      <td className="px-5 py-3">
                        <Link href={`/projects/${session.projectSlug}`} className="text-[12px] text-zinc-300 hover:text-white transition-colors">
                          {session.projectName}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[11px] text-sky-400/80 font-medium">{session.sourceLabel}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {session.events.slice(0, 2).map((ev) => <EventBadge key={ev} eventName={ev} />)}
                          {session.events.length > 2 && <span className="text-[10px] text-zinc-400">+{session.events.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[11px] text-zinc-400">{session.deviceType} · {session.deviceName}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[11px] text-zinc-400 whitespace-nowrap">{timeAgo(session.lastSeen)}</span>
                      </td>
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
              <span className="text-[13px] text-zinc-400 tabular-nums">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 transition-all tap-scale">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
