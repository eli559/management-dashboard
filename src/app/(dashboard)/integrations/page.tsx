import { Puzzle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">אינטגרציות</h1>
          <p className="text-slate-500 mt-1 text-[15px]">
            חיבור כלים ושירותים חיצוניים למערכת
          </p>
        </div>
        <Button variant="secondary">
          <Plus className="w-4 h-4" />
          <span>הוסף אינטגרציה</span>
        </Button>
      </div>

      {/* ── Empty State ── */}
      <EmptyState
        icon={Puzzle}
        title="אין אינטגרציות מחוברות"
        description="חבר כלים חיצוניים כמו Slack, Google Drive או Jira כדי לשפר את תהליכי העבודה"
      />
    </div>
  );
}
