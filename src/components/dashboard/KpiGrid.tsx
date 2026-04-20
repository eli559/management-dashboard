import { Users, LogIn, Activity, FolderKanban } from "lucide-react";
import { KpiCard } from "./KpiCard";

const kpiData = [
  {
    title: "סה״כ משתמשים",
    value: "2,847",
    change: 12.5,
    changeLabel: "מהחודש שעבר",
    icon: Users,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "כניסות היום",
    value: "1,234",
    change: 8.2,
    changeLabel: "מאתמול",
    icon: LogIn,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    title: "פעולות השבוע",
    value: "8,456",
    change: -3.1,
    changeLabel: "מהשבוע שעבר",
    icon: Activity,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
  {
    title: "פרויקטים פעילים",
    value: "142",
    change: 5.7,
    changeLabel: "מהחודש שעבר",
    icon: FolderKanban,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
  },
];

export function KpiGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <KpiCard key={index} {...kpi} />
      ))}
    </div>
  );
}
