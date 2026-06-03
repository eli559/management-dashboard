import {
  Users, Calendar, TrendingUp, Activity,
  Globe, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { getVisitorStats, getRecentSessions, getEnrichedAnalytics } from "@/lib/dal/visitors";
import { LiveRefresh } from "@/components/LiveRefresh";
import { VisitorsFilter } from "@/components/visitors/VisitorsFilter";
import { VisitorsTable } from "@/components/visitors/VisitorsTable";
import { TrafficInsights } from "@/components/visitors/TrafficInsights";
import { formatNumber } from "@/utils/formatters";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ days?: string; project?: string; device?: string }>;
}

export default async function VisitorsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const days = params.days ? parseInt(params.days) : 30;
  const projectFilter = params.project || undefined;
  const deviceFilter = params.device || undefined;

  const [stats, sessions, allProjects, analytics] = await Promise.all([
    getVisitorStats(projectFilter),
    getRecentSessions(200, projectFilter),
    prisma.project.findMany({ select: { id: true, name: true, slug: true } }),
    getEnrichedAnalytics(projectFilter),
  ]);

  let filtered = sessions;
  if (deviceFilter) filtered = filtered.filter((s) => s.deviceType === deviceFilter);

  const serialized = filtered.map((s) => ({
    ...s,
    firstSeen: s.firstSeen.toISOString(),
    lastSeen: s.lastSeen.toISOString(),
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      <LiveRefresh interval={30} />

      <div className="animate-slide-up stagger-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-[clamp(1.2rem,3vw,1.375rem)] font-bold text-white tracking-tight">מבקרים ותובנות</h1>
          <p className="text-zinc-300 mt-0.5 text-[clamp(0.75rem,2vw,0.875rem)]">מקורות תנועה, המרות ונתונים לפרסום</p>
        </div>
        <Suspense fallback={null}>
          <VisitorsFilter projects={allProjects} currentDays={days} currentProjectId={projectFilter} currentDevice={deviceFilter} />
        </Suspense>
      </div>

      <div className="animate-slide-up stagger-2 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-blue-400" /><span className="text-[11px] text-zinc-300">סה״כ מבקרים</span></div>
          <AnimatedStat value={formatNumber(stats.totalSessions)} />
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-emerald-400" /><span className="text-[11px] text-zinc-300">היום</span></div>
          <AnimatedStat value={formatNumber(stats.todaySessions)} />
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-violet-400" /><span className="text-[11px] text-zinc-300">השבוע</span></div>
          <AnimatedStat value={formatNumber(stats.thisWeekSessions)} />
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-amber-400" /><span className="text-[11px] text-zinc-300">ממוצע פעולות</span></div>
          <AnimatedStat value={String(stats.avgEventsPerSession)} />
        </div>
      </div>

      {/* ── Traffic Insights ── */}
      <div className="animate-slide-up stagger-3">
        <TrafficInsights analytics={analytics} />
      </div>

      {(stats.sessionsByProject.length > 0 || stats.topReferrers.length > 0) && (
        <div className="animate-slide-up stagger-4 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          {stats.sessionsByProject.length > 0 && (
            <div className="surface rounded-2xl p-4 md:p-6">
              <h3 className="text-[15px] font-bold text-zinc-200 mb-4">מבקרים לפי פרויקט</h3>
              <div className="space-y-2">
                {stats.sessionsByProject.map((p) => (
                  <Link key={p.projectSlug} href={`/projects/${p.projectSlug}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
                    <span className="text-[13px] text-zinc-300 flex-1">{p.projectName}</span>
                    <span className="text-[12px] text-zinc-300 tabular-nums font-medium">{p.count} מבקרים</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          {stats.topReferrers.length > 0 && (
            <div className="surface rounded-2xl p-4 md:p-6">
              <h3 className="text-[15px] font-bold text-zinc-200 mb-4">דומיינים מפנים</h3>
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

      <div className="animate-slide-up stagger-5">
        <h2 className="text-[16px] font-bold text-zinc-200 mb-4">מבקרים אחרונים</h2>
        <VisitorsTable sessions={serialized} totalCount={stats.totalSessions} />
      </div>
    </div>
  );
}
