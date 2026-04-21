import { getDashboardStats } from "@/lib/dal/dashboard";
import { DashboardKpiGrid } from "@/components/dashboard/DashboardKpiGrid";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { DashboardRecentActivity } from "@/components/dashboard/DashboardRecentActivity";
import { EventBreakdown } from "@/components/dashboard/EventBreakdown";
import { TopProjects } from "@/components/dashboard/TopProjects";
import { LiveRefresh } from "@/components/LiveRefresh";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <LiveRefresh interval={10} />
      <div className="animate-slide-up stagger-1">
        <h1 className="text-[22px] font-bold text-white">דשבורד</h1>
        <p className="text-zinc-400 mt-0.5 text-[14px]">
          ברוך הבא! הנה סקירת המערכת שלך
        </p>
      </div>

      <DashboardKpiGrid
        totalProjects={stats.totalProjects}
        totalEvents={stats.totalEvents}
        todayEvents={stats.todayEvents}
        latestEventTime={stats.latestEventTime}
      />

      {/* גרף + פעילות */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <ActivityChart data={stats.monthlyData} />
        </div>
        <div className="xl:col-span-2">
          <DashboardRecentActivity events={stats.recentEvents} />
        </div>
      </div>

      {/* חלוקה + פרויקטים */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <EventBreakdown data={stats.eventBreakdown} totalEvents={stats.totalEvents} />
        </div>
        <div className="xl:col-span-2">
          <TopProjects projects={stats.topProjects} />
        </div>
      </div>
    </div>
  );
}
