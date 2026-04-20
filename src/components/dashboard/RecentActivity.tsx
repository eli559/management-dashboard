import { ArrowUpLeft, FileText, UserPlus, Settings, Zap } from "lucide-react";
import { cn } from "@/utils/cn";

const activities = [
  {
    id: "1",
    title: "פרויקט חדש נוצר",
    description: 'הפרויקט "מערכת CRM" נוצר בהצלחה',
    time: "לפני 5 דקות",
    icon: FileText,
    color: "text-blue-600 bg-blue-50",
  },
  {
    id: "2",
    title: "משתמש חדש הצטרף",
    description: "דניאל כהן הצטרף למערכת",
    time: "לפני 12 דקות",
    icon: UserPlus,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "3",
    title: "הגדרות עודכנו",
    description: "הרשאות הגישה עודכנו בהצלחה",
    time: "לפני 30 דקות",
    icon: Settings,
    color: "text-amber-600 bg-amber-50",
  },
  {
    id: "4",
    title: "אינטגרציה חדשה",
    description: "חיבור ל-Slack הושלם בהצלחה",
    time: "לפני שעה",
    icon: Zap,
    color: "text-violet-600 bg-violet-50",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">פעילות אחרונה</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            עדכונים אחרונים במערכת
          </p>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors">
          <span>הצג הכל</span>
          <ArrowUpLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-1">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
                activity.color
              )}
            >
              <activity.icon className="w-[18px] h-[18px]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                {activity.title}
              </p>
              <p className="text-[13px] text-slate-500 truncate mt-0.5">
                {activity.description}
              </p>
            </div>
            <span className="text-[11px] text-slate-400 flex-shrink-0 mt-0.5 font-medium">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
