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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <KpiCard
        title="פרויקטים פעילים"
        value={formatNumber(totalProjects)}
        change={0}
        changeLabel="סה״כ פרויקטים במערכת"
        icon={FolderKanban}
        glow="violet"
        stagger={1}
      />
      <KpiCard
        title="סה״כ אירועים"
        value={formatNumber(totalEvents)}
        change={0}
        changeLabel="אירועים שנקלטו"
        icon={Activity}
        glow="blue"
        stagger={2}
      />
      <KpiCard
        title="אירועי היום"
        value={formatNumber(todayEvents)}
        change={0}
        changeLabel="אירועים שנקלטו היום"
        icon={Calendar}
        glow="emerald"
        stagger={3}
      />
      <KpiCard
        title="משתמשים"
        value="—"
        change={0}
        changeLabel="בקרוב"
        icon={Users}
        glow="amber"
        stagger={4}
      />
    </div>
  );
}
