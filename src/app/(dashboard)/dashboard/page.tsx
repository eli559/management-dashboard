import { getDashboardStats } from "@/lib/dal/dashboard";
import { DashboardKpiGrid } from "@/components/dashboard/DashboardKpiGrid";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { DashboardRecentActivity } from "@/components/dashboard/DashboardRecentActivity";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="animate-slide-up stagger-1">
        <h1 className="text-[22px] font-bold text-white">דשבורד</h1>
        <p className="text-zinc-500 mt-0.5 text-[14px]">
          ברוך הבא! הנה סקירת המערכת שלך
        </p>
      </div>

      <DashboardKpiGrid
        totalProjects={stats.totalProjects}
        totalEvents={stats.totalEvents}
        todayEvents={stats.todayEvents}
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
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
