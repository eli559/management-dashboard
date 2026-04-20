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
        iconColor="text-blue-600"
        iconBg="bg-blue-50"
      />
      <KpiCard
        title="אירועי היום"
        value={formatNumber(todayEvents)}
        change={0}
        changeLabel="אירועים שהתקבלו היום"
        icon={Calendar}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
      />
      <KpiCard
        title="משת��שים ייחודיים"
        value={formatNumber(uniqueUsers)}
        change={0}
        changeLabel="משתמשים שונים שזוהו"
        icon={Users}
        iconColor="text-amber-600"
        iconBg="bg-amber-50"
      />
      <KpiCard
        title="Sessions"
        value={formatNumber(uniqueSessions)}
        change={0}
        changeLabel="sessions שונים שזוהו"
        icon={Radio}
        iconColor="text-violet-600"
        iconBg="bg-violet-50"
      />
    </div>
  );
}
