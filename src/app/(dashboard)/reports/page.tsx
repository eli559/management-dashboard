import {
  BarChart3,
  Activity,
  Calendar,
  Users,
  Radio,
  Clock,
  Zap,
  Globe,
  FolderKanban,
  TrendingUp,
} from "lucide-react";
import { getReportsData } from "@/lib/dal/reports";
import { StatCard } from "@/components/reports/StatCard";
import { ReportChart } from "@/components/reports/ReportChart";
import { HorizontalBar } from "@/components/reports/HorizontalBar";
import { HeatmapGrid } from "@/components/reports/HeatmapGrid";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const data = await getReportsData({ days: 30 });

  return (
    <div className="space-y-6">
      {/* ── כותרת ── */}
      <div className="animate-slide-up stagger-1">
        <h1 className="text-[22px] font-bold text-white">דוחות</h1>
        <p className="text-zinc-500 mt-0.5 text-[14px]">
          ניתוח מעמיק של כל הנתונים במערכת — {data.days} ימים אחרונים
        </p>
      </div>

      {/* ── סקירה כללית — KPI ── */}
      <div className="animate-slide-up stagger-2">
        <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold mb-3 px-1">
          סקירה כללית
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="סה״כ אירועים"
            value={formatNumber(data.totalEvents)}
            trend={data.comparison.changePercent}
            subtitle={`מול ${formatNumber(data.comparison.previous)} בתקופה קודמת`}
            icon={Activity}
            glow="blue"
          />
          <StatCard
            title="אירועי היום"
            value={formatNumber(data.todayEvents)}
            icon={Calendar}
            glow="emerald"
          />
          <StatCard
            title="השבוע"
            value={formatNumber(data.thisWeekEvents)}
            icon={TrendingUp}
            glow="violet"
          />
          <StatCard
            title="סשנים"
            value={formatNumber(data.uniqueSessions)}
            icon={Radio}
            glow="amber"
          />
          <StatCard
            title="משתמשים"
            value={formatNumber(data.uniqueUsers)}
            icon={Users}
            glow="blue"
          />
          <StatCard
            title="אירוע אחרון"
            value={data.latestEventTime ? formatRelativeTime(data.latestEventTime) : "—"}
            icon={Clock}
            glow="emerald"
          />
        </div>
      </div>

      {/* ── מגמות ── */}
      <div className="animate-slide-up stagger-3">
        <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold mb-3 px-1">
          מגמות
        </p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ReportChart
            title="אירועים לפי יום"
            subtitle={`${data.days} ימים אחרונים`}
            data={data.dailyCounts.map((d) => ({ label: d.date, value: d.count }))}
            color="blue"
            emptyText="אין אירועים בתקופה הנבחרת"
          />
          <ReportChart
            title="אירועים לפי שעה"
            subtitle="התפלגות שעתית של כל האירועים"
            data={data.hourlyCounts.map((h) => ({ label: `${h.hour}`, value: h.count }))}
            color="violet"
            type="area"
            emptyText="אין מספיק נתונים"
          />
        </div>
      </div>

      {/* ── Heatmap ── */}
      <div className="animate-slide-up stagger-4">
        <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold mb-3 px-1">
          דפוסי פעילות
        </p>
        <HeatmapGrid hourly={data.hourlyCounts} weekday={data.weekdayCounts} />
      </div>

      {/* ── התפלגויות ── */}
      <div className="animate-slide-up stagger-5">
        <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold mb-3 px-1">
          התפלגויות
        </p>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <HorizontalBar
            title="סוגי אירועים"
            subtitle="חלוקה לפי סוג"
            items={data.eventTypes.map((e) => ({ label: e.eventName, value: e.count }))}
            color="blue"
            useBadge
            emptyText="אין אירועים"
          />
          <HorizontalBar
            title="עמודים מובילים"
            subtitle="העמודים הנצפים ביותר"
            items={data.topPages.map((p) => ({ label: p.page, value: p.count }))}
            color="emerald"
            mono
            emptyText="אין נתוני עמודים"
          />
          <HorizontalBar
            title="פרויקטים"
            subtitle="מספר אירועים לכל פרויקט"
            items={data.projectEventCounts.map((p) => ({ label: p.projectName, value: p.count }))}
            color="violet"
            emptyText="אין פרויקטים"
          />
        </div>
      </div>

      {/* ── תובנות ── */}
      {(data.topEventType || data.topProject) && (
        <div className="animate-slide-up stagger-6">
          <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold mb-3 px-1">
            תובנות
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.topEventType && (
              <div className="glass rounded-2xl p-5 overflow-hidden relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/[0.08] to-transparent" />
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-[12px] text-zinc-500">אירוע נפוץ ביותר</span>
                </div>
                <p className="text-[18px] font-bold text-white font-mono">{data.topEventType}</p>
              </div>
            )}
            {data.topProject && (
              <div className="glass rounded-2xl p-5 overflow-hidden relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/[0.08] to-transparent" />
                <div className="flex items-center gap-3 mb-2">
                  <FolderKanban className="w-4 h-4 text-violet-400" />
                  <span className="text-[12px] text-zinc-500">פרויקט מוביל</span>
                </div>
                <p className="text-[18px] font-bold text-white">{data.topProject.projectName}</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  {data.topProject.count.toLocaleString("he-IL")} אירועים
                </p>
              </div>
            )}
            <div className="glass rounded-2xl p-5 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/[0.08] to-transparent" />
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-[12px] text-zinc-500">עמודים שנסרקו</span>
              </div>
              <p className="text-[18px] font-bold text-white">{formatNumber(data.topPages.length)}</p>
              <p className="text-[11px] text-zinc-600 mt-0.5">עמודים ייחודיים שזוהו</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
