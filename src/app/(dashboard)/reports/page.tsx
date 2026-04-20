import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">דוחות</h1>
        <p className="text-zinc-500 mt-1 text-[15px]">
          צפייה וייצוא דוחות מערכת
        </p>
      </div>

      <EmptyState
        icon={BarChart3}
        title="דוחות יהיו זמינים בקרוב"
        description="מודול הדוחות נמצא בפיתוח. בינתיים, ניתן לצפות בנתונים דרך הדשבורד ועמודי הפרויקטים."
      />
    </div>
  );
}
