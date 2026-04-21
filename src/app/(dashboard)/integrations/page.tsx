import { Puzzle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">אינטגרציות</h1>
        <p className="text-zinc-300 mt-1 text-[15px]">
          חיבור כלים ושירותים חיצוניים למערכת
        </p>
      </div>

      <EmptyState
        icon={Puzzle}
        title="אינטגרציות יהיו זמינות בקרוב"
        description="מודול האינטגרציות נמצא בפיתוח. בעתיד ניתן יהיה לחבר כלים כמו Slack, Google Drive ועוד."
      />
    </div>
  );
}
