import {
  Users, Calendar, TrendingUp, Activity,
  Globe, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getVisitorStats, getRecentSessions } from "@/lib/dal/visitors";
import { LiveRefresh } from "@/components/LiveRefresh";
import { VisitorsFilter } from "@/components/visitors/VisitorsFilter";
import { VisitorsTable } from "@/components/visitors/VisitorsTable";
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

  const [stats, sessions, allProjects] = await Promise.all([
    getVisitorStats(),
    getRecentSessions(200),
    prisma.project.findMany({ select: { id: true, name: true, slug: true } }),
  ]);

  let filtered = sessions;
  if (projectFilter) filtered = filtered.filter((s) => s.projectSlug === allProjects.find((p) => p.id === projectFilter)?.slug);
  if (deviceFilter) filtered = filtered.filter((s) => s.deviceType === deviceFilter);

  const serialized = filtered.map((s) => ({
    ...s,
    firstSeen: s.firstSeen.toISOString(),
    lastSeen: s.lastSeen.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <LiveRefresh interval={30} />

      <div className="animate-slide-up stagger-1 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-white">מבקרים</h1>
          <p className="text-zinc-300 mt-0.5 text-[14px]">כל מי שנכנס לאתרים שלך — בזמן אמת</p>
        </div>
        <Suspense fallback={null}>
          <VisitorsFilter projects={allProjects} currentDays={days} currentProjectId={projectFilter} currentDevice={deviceFilter} />
        </Suspense>
      </div>

      <div className="animate-slide-up stagger-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-blue-400" /><span className="text-[11px] text-zinc-300">סה״כ מבקרים</span></div>
          <p className="text-[24px] font-extrabold text-white">{formatNumber(stats.totalSessions)}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-emerald-400" /><span className="text-[11px] text-zinc-300">היום</span></div>
          <p className="text-[24px] font-extrabold text-white">{formatNumber(stats.todaySessions)}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-violet-400" /><span className="text-[11px] text-zinc-300">השבוע</span></div>
          <p className="text-[24px] font-extrabold text-white">{formatNumber(stats.thisWeekSessions)}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-amber-400" /><span className="text-[11px] text-zinc-300">ממוצע פעולות</span></div>
          <p className="text-[24px] font-extrabold text-white">{stats.avgEventsPerSession}</p>
        </div>
      </div>

      {(stats.sessionsByProject.length > 0 || stats.topReferrers.length > 0) && (
        <div className="animate-slide-up stagger-3 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {stats.sessionsByProject.length > 0 && (
            <div className="surface rounded-2xl p-6">
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

      <div className="animate-slide-up stagger-4">
        <h2 className="text-[16px] font-bold text-zinc-200 mb-4">מבקרים אחרונים</h2>
        <VisitorsTable sessions={serialized} />
      </div>
    </div>
  );
}
