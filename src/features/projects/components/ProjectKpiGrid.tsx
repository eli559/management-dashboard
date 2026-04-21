import { BarChart3, Calendar, Users, Radio } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { formatNumber } from "@/utils/formatters";

interface ProjectKpiGridProps {
  totalEvents: number;
  todayEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
}

export function ProjectKpiGrid({ totalEvents, todayEvents, uniqueUsers, uniqueSessions }: ProjectKpiGridProps) {
  // Show visitors (sessions) as the main people metric.
  // uniqueUsers only counts identified users (via setUser), which is usually 0.
  const visitors = uniqueSessions > 0 ? uniqueSessions : uniqueUsers;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <KpiCard title="סה״כ אירועים" value={formatNumber(totalEvents)} change={0} changeLabel="מתחילת הפרויקט" icon={BarChart3} glow="blue" stagger={1} />
      <KpiCard title="אירועי היום" value={formatNumber(todayEvents)} change={0} changeLabel="אירועים שהתקבלו היום" icon={Calendar} glow="emerald" stagger={2} />
      <KpiCard title="מבקרים ייחודיים" value={formatNumber(visitors)} change={0} changeLabel="מבקרים שונים שזוהו" icon={Users} glow="amber" stagger={3} />
      <KpiCard title="סשנים" value={formatNumber(uniqueSessions)} change={0} changeLabel="סשנים שונים שזוהו" icon={Radio} glow="violet" stagger={4} />
    </div>
  );
}
