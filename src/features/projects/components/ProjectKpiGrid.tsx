import { BarChart3, Calendar, Users, Radio } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { formatNumber } from "@/utils/formatters";

interface ProjectKpiGridProps {
  totalEvents: number;
  todayEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
}

export function ProjectKpiGrid({
  totalEvents,
  todayEvents,
  uniqueUsers,
  uniqueSessions,
}: ProjectKpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <KpiCard
        title="סה״כ אירועים"
        value={formatNumber(totalEvents)}
        change={0}
        changeLabel="מתחילת הפרויקט"
        icon={BarChart3}
      />
      <KpiCard
        title="אירועי היום"
        value={formatNumber(todayEvents)}
        change={0}
        changeLabel="אירועים שהתקבלו היום"
        icon={Calendar}
      />
      <KpiCard
        title="משתמשים ייחודיים"
        value={formatNumber(uniqueUsers)}
        change={0}
        changeLabel="משתמשים שונים שזוהו"
        icon={Users}
      />
      <KpiCard
        title="סשנים"
        value={formatNumber(uniqueSessions)}
        change={0}
        changeLabel="סשנים שונים שזוהו"
        icon={Radio}
      />
    </div>
  );
}
