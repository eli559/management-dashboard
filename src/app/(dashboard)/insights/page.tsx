import { prisma } from "@/lib/prisma";
import { generateInsights } from "@/lib/insights/insights-engine";
import { InsightsClient } from "@/components/insights/InsightsClient";
import { InsightsProjectFilter } from "@/components/insights/InsightsProjectFilter";
import { LiveRefresh } from "@/components/LiveRefresh";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const projectId = params.project || undefined;

  const [insights, allProjects] = await Promise.all([
    generateInsights(projectId),
    prisma.project.findMany({ select: { id: true, name: true, slug: true } }),
  ]);

  const currentProject = projectId ? allProjects.find((p) => p.id === projectId) : null;

  return (
    <div className="space-y-4 md:space-y-6">
      <LiveRefresh interval={60} />

      <div className="animate-slide-up stagger-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-[clamp(1.2rem,3vw,1.375rem)] font-bold text-white tracking-tight">תובנות</h1>
          <p className="text-zinc-300 mt-0.5 text-[clamp(0.75rem,2vw,0.875rem)]">
            ניתוח חכם של הנתונים במערכת
            {currentProject ? ` · ${currentProject.name}` : ""}
          </p>
        </div>
        <InsightsProjectFilter projects={allProjects} currentProjectId={projectId} />
      </div>

      <div className="animate-slide-up stagger-2">
        <InsightsClient insights={insights} projects={allProjects} currentProjectId={projectId} />
      </div>
    </div>
  );
}
