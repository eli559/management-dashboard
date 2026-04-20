import { Settings } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">הגדרות</h1>
        <p className="text-slate-500 mt-1 text-[15px]">
          ניהול הגדרות המערכת וההעדפות שלך
        </p>
      </div>

      {/* ── Empty State ── */}
      <EmptyState
        icon={Settings}
        title="ההגדרות יהיו זמינות בקרוב"
        description="עמוד ההגדרות נמצא בבנייה ויהיה זמין בגרסה הבאה"
      />
    </div>
  );
}
