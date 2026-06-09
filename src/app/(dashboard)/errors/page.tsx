import { prisma } from "@/lib/prisma";
import { getErrors, getErrorStats } from "@/lib/dal/errors";
import { LiveRefresh } from "@/components/LiveRefresh";
import { ErrorsClient } from "@/components/errors/ErrorsClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ project?: string; severity?: string; status?: string }>;
}

export default async function ErrorsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const [errors, stats, allProjects] = await Promise.all([
    getErrors({
      projectId: params.project || undefined,
      severity: params.severity || undefined,
      status: params.status || undefined,
    }),
    getErrorStats(),
    prisma.project.findMany({ select: { id: true, name: true, slug: true } }),
  ]);

  const serialized = errors.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      <LiveRefresh interval={15} />

      <div className="animate-slide-up stagger-1">
        <h1 className="text-[clamp(1.2rem,3vw,1.375rem)] font-bold text-white tracking-tight">שגיאות</h1>
        <p className="text-zinc-300 mt-0.5 text-[clamp(0.75rem,2vw,0.875rem)]">מעקב שגיאות JavaScript מכל הפרויקטים</p>
      </div>

      <div className="animate-slide-up stagger-2">
        <ErrorsClient
          errors={serialized}
          stats={stats}
          projects={allProjects}
          currentProject={params.project}
          currentSeverity={params.severity}
          currentStatus={params.status}
        />
      </div>
    </div>
  );
}
