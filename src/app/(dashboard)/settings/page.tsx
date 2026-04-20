import { Settings } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">הגדרות</h1>
        <p className="text-zinc-500 mt-1 text-[15px]">
          ניהול הגדרות המערכת וההעדפות שלך
        </p>
      </div>

      <EmptyState
        icon={Settings}
        title="הגדרות יהיו זמינות בקרוב"
        description="עמוד ההגדרות נמצא בפיתוח ויהיה זמין בגרסה הבאה."
      />
    </div>
  );
}
