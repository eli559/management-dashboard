import { getDashboardStats } from "@/lib/dal/dashboard";
import { DashboardKpiGrid } from "@/components/dashboard/DashboardKpiGrid";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { DashboardRecentActivity } from "@/components/dashboard/DashboardRecentActivity";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">דשבורד</h1>
        <p className="text-slate-500 mt-1 text-[15px]">
          ברוך הבא! הנה סקירת המערכת שלך
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <DashboardKpiGrid
        totalProjects={stats.totalProjects}
        totalEvents={stats.totalEvents}
        todayEvents={stats.todayEvents}
      />

      {/* ── Charts & Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <ChartPlaceholder />
        </div>
        <div className="xl:col-span-2">
          <DashboardRecentActivity events={stats.recentEvents} />
        </div>
      </div>
    </div>
  );
}
