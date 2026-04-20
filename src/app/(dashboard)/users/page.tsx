import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">משתמשים</h1>
        <p className="text-zinc-500 mt-1 text-[15px]">
          ניהול משתמשי המערכת והרשאותיהם
        </p>
      </div>

      <EmptyState
        icon={Users}
        title="ניהול משתמשים יהיה זמין בקרוב"
        description="מודול ניהול המשתמשים נמצא בפיתוח. כרגע ניתן להתחבר עם חשבון מנהל."
      />
    </div>
  );
}
