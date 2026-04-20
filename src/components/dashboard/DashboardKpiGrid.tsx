import { FolderKanban, Activity, Calendar, Users } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { formatNumber } from "@/utils/formatters";

interface DashboardKpiGridProps {
  totalProjects: number;
  totalEvents: number;
  todayEvents: number;
}

export function DashboardKpiGrid({
  totalProjects,
  totalEvents,
  todayEvents,
}: DashboardKpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <KpiCard
        title="פרויקטים פעילים"
        value={formatNumber(totalProjects)}
        change={0}
        changeLabel="סה״כ פרויקטים במערכת"
        icon={FolderKanban}
      />
      <KpiCard
        title="סה״כ אירועים"
        value={formatNumber(totalEvents)}
        change={0}
        changeLabel="אירועים שנקלטו"
        icon={Activity}
      />
      <KpiCard
        title="אירועי היום"
        value={formatNumber(todayEvents)}
        change={0}
        changeLabel="אירועים שנקלטו היום"
        icon={Calendar}
      />
      <KpiCard
        title="משתמשים"
        value="—"
        change={0}
        changeLabel="בקרוב"
        icon={Users}
      />
    </div>
  );
}
