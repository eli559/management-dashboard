import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">דוחות</h1>
          <p className="text-slate-500 mt-1 text-[15px]">
            צפייה וייצוא דוחות מערכת
          </p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4" />
          <span>ייצוא דוח</span>
        </Button>
      </div>

      {/* ── Empty State ── */}
      <EmptyState
        icon={BarChart3}
        title="אין דוחות זמינים"
        description="הדוחות ייווצרו אוטומטית כאשר תהיה פעילות מספיקה במערכת"
      />
    </div>
  );
}
