import { UserCog } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">צוות</h1>
        <p className="text-zinc-400 mt-1 text-[15px]">
          ניהול משתמשי המערכת והרשאותיהם
        </p>
      </div>

      <EmptyState
        icon={UserCog}
        title="ניהול צוות יהיה זמין בקרוב"
        description="כאן תוכל להוסיף משתמשים למערכת, להגדיר הרשאות ולנהל גישה. כרגע ניתן להתחבר עם חשבון מנהל."
      />
    </div>
  );
}
