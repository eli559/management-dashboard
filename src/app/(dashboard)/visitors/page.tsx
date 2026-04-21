import {
  Users, Calendar, TrendingUp, Activity,
  Globe, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { getVisitorStats, getRecentSessions } from "@/lib/dal/visitors";
import { LiveRefresh } from "@/components/LiveRefresh";
import { Badge } from "@/components/ui/Badge";
import { EventBadge } from "@/components/ui/EventBadge";
import { formatNumber, formatRelativeTime, formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export const dynamic = "force-dynamic";

export default async function VisitorsPage() {
  const [stats, sessions] = await Promise.all([
    getVisitorStats(),
    getRecentSessions(40),
  ]);

  return (
    <div className="space-y-6">
      <LiveRefresh interval={10} />

      {/* ── כותרת ── */}
      <div className="animate-slide-up stagger-1">
        <h1 className="text-[22px] font-bold text-white">מבקרים</h1>
        <p className="text-zinc-300 mt-0.5 text-[14px]">
          כל מי שנכנס לאתרים שלך — בזמן אמת
        </p>
      </div>

      {/* ── KPI ── */}
      <div className="animate-slide-up stagger-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] text-zinc-300">סה״כ מבקרים</span>
          </div>
          <p className="text-[24px] font-extrabold text-white">{formatNumber(stats.totalSessions)}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-zinc-300">היום</span>
          </div>
          <p className="text-[24px] font-extrabold text-white">{formatNumber(stats.todaySessions)}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] text-zinc-300">השבוע</span>
          </div>
          <p className="text-[24px] font-extrabold text-white">{formatNumber(stats.thisWeekSessions)}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] text-zinc-300">ממוצע פעולות</span>
          </div>
          <p className="text-[24px] font-extrabold text-white">{stats.avgEventsPerSession}</p>
        </div>
      </div>

      {/* ── סיכום לפי פרויקט + מקורות ── */}
      {(stats.sessionsByProject.length > 0 || stats.topReferrers.length > 0) && (
        <div className="animate-slide-up stagger-3 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* לפי פרויקט */}
          {stats.sessionsByProject.length > 0 && (
            <div className="surface rounded-2xl p-6">
              <h3 className="text-[15px] font-bold text-zinc-200 mb-4">מבקרים לפי פרויקט</h3>
              <div className="space-y-2">
                {stats.sessionsByProject.map((p) => (
                  <Link
                    key={p.projectSlug}
                    href={`/projects/${p.projectSlug}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors group"
                  >
                    <span className="text-[13px] text-zinc-300 flex-1">{p.projectName}</span>
                    <span className="text-[12px] text-zinc-300 tabular-nums font-medium">{p.count} מבקרים</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* מקורות הגעה */}
          {stats.topReferrers.length > 0 && (
            <div className="surface rounded-2xl p-6">
              <h3 className="text-[15px] font-bold text-zinc-200 mb-4">מקורות הגעה</h3>
              <div className="space-y-2">
                {stats.topReferrers.map((r) => (
                  <div key={r.referrer} className="flex items-center gap-3 p-2">
                    <Globe className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                    <span className="text-[13px] text-zinc-300 flex-1 truncate" dir="ltr">{r.referrer}</span>
                    <span className="text-[12px] text-zinc-300 tabular-nums font-medium">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── טבלת מבקרים ── */}
      <div className="animate-slide-up stagger-4">
        <h2 className="text-[16px] font-bold text-zinc-200 mb-4">מבקרים אחרונים</h2>

        {sessions.length > 0 ? (
          <div className="surface rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-5 py-3">מבקר</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-5 py-3">פרויקט</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-5 py-3">עמודים</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-5 py-3">פעולות</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-5 py-3">מכשיר</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-5 py-3">אירועים</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-5 py-3">נכנס</th>
                    <th className="text-start text-[11px] font-semibold text-zinc-300 uppercase tracking-wider px-5 py-3">אחרון</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, idx) => (
                    <tr
                      key={session.sessionId}
                      className={cn(
                        "hover:bg-white/[0.02] transition-colors",
                        idx < sessions.length - 1 && "border-b border-white/[0.03]"
                      )}
                    >
                      {/* מזהה */}
                      <td className="px-5 py-3">
                        <code className="text-[11px] text-zinc-300 font-mono" dir="ltr">
                          {session.sessionId.substring(0, 12)}...
                        </code>
                      </td>

                      {/* פרויקט */}
                      <td className="px-5 py-3">
                        <Link
                          href={`/projects/${session.projectSlug}`}
                          className="text-[12px] text-zinc-300 hover:text-white transition-colors"
                        >
                          {session.projectName}
                        </Link>
                      </td>

                      {/* עמודים */}
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {session.pages.slice(0, 3).map((page) => (
                            <code key={page} className="text-[10px] text-zinc-300 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded" dir="ltr">
                              {page}
                            </code>
                          ))}
                          {session.pages.length > 3 && (
                            <span className="text-[10px] text-zinc-300">+{session.pages.length - 3}</span>
                          )}
                        </div>
                      </td>

                      {/* פעולות */}
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {session.events.slice(0, 2).map((ev) => (
                            <EventBadge key={ev} eventName={ev} />
                          ))}
                          {session.events.length > 2 && (
                            <span className="text-[10px] text-zinc-300">+{session.events.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* מכשיר */}
                      <td className="px-5 py-3">
                        <div className="text-[11px]">
                          <span className="text-zinc-300">{session.deviceType}</span>
                          <span className="text-zinc-300 mx-1">·</span>
                          <span className="text-zinc-300">{session.deviceName}</span>
                        </div>
                      </td>

                      {/* כמות */}
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-zinc-300 tabular-nums font-medium">
                          {session.eventCount}
                        </span>
                      </td>

                      {/* נכנס */}
                      <td className="px-5 py-3">
                        <span className="text-[11px] text-zinc-300 whitespace-nowrap">
                          {formatRelativeTime(session.firstSeen)}
                        </span>
                      </td>

                      {/* אחרון */}
                      <td className="px-5 py-3">
                        <span className="text-[11px] text-zinc-300 whitespace-nowrap">
                          {formatRelativeTime(session.lastSeen)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="surface rounded-2xl p-16 text-center">
            <Users className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-200 mb-2">אין מבקרים עדיין</h3>
            <p className="text-sm text-zinc-300 max-w-sm mx-auto">
              מבקרים יופיעו כאן ברגע שאנשים ייכנסו לאתרים עם ה-tracking מותקן
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
