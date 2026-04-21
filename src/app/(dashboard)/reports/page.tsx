import {
  Activity, Calendar, Clock, Users, Radio,
  TrendingUp, Zap, Globe, FolderKanban, BarChart3,
} from "lucide-react";
import { getReportsData } from "@/lib/dal/reports";
import { MiniKpi } from "@/components/reports/MiniKpi";
import { ReportChart } from "@/components/reports/ReportChart";
import { LineChart } from "@/components/reports/LineChart";
import { DonutChart } from "@/components/reports/DonutChart";
import { ComparisonChart } from "@/components/reports/ComparisonChart";
import { HorizontalBar } from "@/components/reports/HorizontalBar";
import { HeatmapGrid } from "@/components/reports/HeatmapGrid";
import { LiveRefresh } from "@/components/LiveRefresh";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const data = await getReportsData({ days: 30 });

  return (
    <div className="space-y-5">
      <LiveRefresh interval={15} />
      {/* ── כותרת ── */}
      <div className="animate-slide-up stagger-1">
        <h1 className="text-[22px] font-bold text-white">דוחות</h1>
        <p className="text-zinc-400 mt-0.5 text-[14px]">
          ניתוח מעמיק — {data.days} ימים אחרונים
        </p>
      </div>

      {/* ══════════════════════════════════════════
          סקירה כללית — 10 KPI קומפקטיים
         ══════════════════════════════════════════ */}
      <div className="animate-slide-up stagger-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <MiniKpi
            label="סה״כ אירועים"
            value={formatNumber(data.totalEvents)}
            icon={Activity}
            trend={data.comparison.changePercent}
            sparkData={data.sparkline}
            color="blue"
          />
          <MiniKpi
            label="היום"
            value={formatNumber(data.todayEvents)}
            icon={Calendar}
            color="emerald"
          />
          <MiniKpi
            label="השבוע"
            value={formatNumber(data.thisWeekEvents)}
            icon={TrendingUp}
            color="violet"
          />
          <MiniKpi
            label="החודש"
            value={formatNumber(data.thisMonthEvents)}
            icon={BarChart3}
            color="amber"
          />
          <MiniKpi
            label="סשנים"
            value={formatNumber(data.uniqueSessions)}
            icon={Radio}
            color="blue"
          />
          <MiniKpi
            label="מבקרים"
            value={formatNumber(data.uniqueSessions > 0 ? data.uniqueSessions : data.uniqueUsers)}
            icon={Users}
            color="emerald"
          />
          <MiniKpi
            label="אירוע אחרון"
            value={data.latestEventTime ? formatRelativeTime(data.latestEventTime) : "—"}
            icon={Clock}
            color="zinc"
          />
          <MiniKpi
            label="אירוע מוביל"
            value={data.topEventType ?? "—"}
            icon={Zap}
            color="amber"
          />
          <MiniKpi
            label="פרויקט מוביל"
            value={data.topProject?.projectName ?? "—"}
            icon={FolderKanban}
            color="violet"
          />
          <MiniKpi
            label="עמודים"
            value={formatNumber(data.topPages.length)}
            icon={Globe}
            color="blue"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          מגמות — Line + Bar + Comparison
         ══════════════════════════════════════════ */}
      <div className="animate-slide-up stagger-3">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-3 px-0.5">
          מגמות
        </p>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <LineChart
            title="מגמת אירועים"
            subtitle="30 ימים אחרונים"
            data={data.dailyCounts.map((d) => ({ label: d.date, value: d.count }))}
            color="blue"
            className="xl:col-span-2"
          />
          <ComparisonChart
            comparison={data.comparison}
            days={data.days}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          התפלגויות — Donut + Bars + Area
         ══════════════════════════════════════════ */}
      <div className="animate-slide-up stagger-4">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-3 px-0.5">
          התפלגויות
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DonutChart
            title="סוגי אירועים"
            subtitle="חלוקה יחסית"
            items={data.eventTypes.map((e) => ({ label: e.eventName, value: e.count }))}
          />
          <HorizontalBar
            title="עמודים מובילים"
            subtitle="הנצפים ביותר"
            items={data.topPages.map((p) => ({ label: p.page, value: p.count }))}
            color="emerald"
            mono
          />
          <HorizontalBar
            title="פרויקטים"
            subtitle="לפי מספר אירועים"
            items={data.projectEventCounts.map((p) => ({ label: p.projectName, value: p.count }))}
            color="violet"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          דפוסים — Heatmap + Hourly chart
         ══════════════════════════════════════════ */}
      <div className="animate-slide-up stagger-5">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-3 px-0.5">
          דפוסי פעילות
        </p>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3">
            <HeatmapGrid hourly={data.hourlyCounts} weekday={data.weekdayCounts} />
          </div>
          <div className="xl:col-span-2">
            <ReportChart
              title="פעילות שעתית"
              subtitle="התפלגות לפי שעה ביממה"
              data={data.hourlyCounts.map((h) => ({ label: `${h.hour}`, value: h.count }))}
              color="violet"
              type="area"
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          אירועים — Bar chart daily
         ══════════════════════════════════════════ */}
      <div className="animate-slide-up stagger-6">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-3 px-0.5">
          פעילות יומית
        </p>
        <ReportChart
          title="אירועים לפי יום"
          subtitle={`${data.days} ימים אחרונים`}
          data={data.dailyCounts.map((d) => ({ label: d.date, value: d.count }))}
          color="blue"
        />
      </div>
    </div>
  );
}
