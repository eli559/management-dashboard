import { prisma } from "@/lib/prisma";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const projects = await prisma.project.findMany({
    select: { id: true, name: true, slug: true, _count: { select: { events: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="animate-slide-up stagger-1">
        <h1 className="text-[clamp(1.2rem,3vw,1.375rem)] font-bold text-white tracking-tight">הגדרות</h1>
        <p className="text-zinc-300 mt-0.5 text-[clamp(0.75rem,2vw,0.875rem)]">ניהול סיסמה וייצוא נתונים</p>
      </div>

      <div className="animate-slide-up stagger-2">
        <SettingsClient projects={projects.map((p) => ({ id: p.id, name: p.name, eventCount: p._count.events }))} />
      </div>
    </div>
  );
}
