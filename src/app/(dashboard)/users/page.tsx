import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function UsersPage() {
  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">משתמשים</h1>
          <p className="text-slate-500 mt-1 text-[15px]">
            ניהול משתמשי המערכת והרשאותיהם
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4" />
          <span>הוסף משתמש</span>
        </Button>
      </div>

      {/* ── Empty State ── */}
      <EmptyState
        icon={Users}
        title="אין משתמשים נוספים"
        description="הזמן משתמשים חדשים למערכת כדי לשתף פעולה ולנהל פרויקטים יחד"
      >
        <Button variant="secondary" size="sm">
          <UserPlus className="w-3.5 h-3.5" />
          <span>הזמן משתמש ראשון</span>
        </Button>
      </EmptyState>
    </div>
  );
}
