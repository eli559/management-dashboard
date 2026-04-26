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
    <div className="space-y-6">
      <LiveRefresh interval={60} />

      <div className="animate-slide-up stagger-1 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-white">תובנות</h1>
          <p className="text-zinc-300 mt-0.5 text-[14px]">
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
