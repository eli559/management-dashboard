import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Key, Calendar, Activity } from "lucide-react";
import { cn } from "@/utils/cn";
import { getProjectBySlug } from "@/lib/dal/projects";
import {
  getProjectEventStats,
  getRecentEventsByProject,
  getProjectEventBreakdown,
  getProjectTopPages,
  getProjectMonthlyEvents,
} from "@/lib/dal/events";
import { ApiKeyDisplay } from "@/features/projects/components/ApiKeyDisplay";
import { ProjectKpiGrid } from "@/features/projects/components/ProjectKpiGrid";
import { PaginatedEventsTable } from "@/features/projects/components/PaginatedEventsTable";
import { ProjectEventBreakdown } from "@/features/projects/components/ProjectEventBreakdown";
import { ProjectTopPages } from "@/features/projects/components/ProjectTopPages";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import {
  PROJECT_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_COLORS,
  PROJECT_STATUS_COLORS,
} from "@/features/projects/types";
import { formatDate } from "@/utils/formatters";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const [stats, recentEvents, eventBreakdown, topPages, monthlyData] =
    await Promise.all([
      getProjectEventStats(project.id),
      getRecentEventsByProject(project.id, 200),
      getProjectEventBreakdown(project.id),
      getProjectTopPages(project.id),
      getProjectMonthlyEvents(project.id),
    ]);

  return (
    <div className="space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-300 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>חזרה לפרויקטים</span>
      </Link>

      {/* כותרת */}
      <div className="surface rounded-2xl p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                  PROJECT_TYPE_COLORS[project.type]
                )}
              >
                {PROJECT_TYPE_LABELS[project.type]}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full shadow-[0_0_6px_currentColor]",
                    PROJECT_STATUS_COLORS[project.status]
                  )}
                />
                <span className="text-sm text-zinc-300 font-medium">
                  {PROJECT_STATUS_LABELS[project.status]}
                </span>
              </div>
            </div>
            {project.description && (
              <p className="text-[15px] text-zinc-300 max-w-xl leading-relaxed">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-5 text-sm text-zinc-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>נוצר ב-{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>
                  {stats.totalEvents.toLocaleString("he-IL")} אירועים
                </span>
              </div>
            </div>
          </div>

          <div className="lg:min-w-[380px]">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-zinc-300" />
              <span className="text-sm font-medium text-zinc-300">
                מפתח API
              </span>
            </div>
            <ApiKeyDisplay apiKey={project.apiKey} />
            <p className="text-[11px] text-zinc-300 mt-2">
              השתמש במפתח זה כדי לשלוח אירועים לפרויקט דרך ה-API
            </p>
          </div>
        </div>
      </div>

      {/* KPI */}
      <ProjectKpiGrid {...stats} />

      {/* גרף חודשי */}
      <ActivityChart data={monthlyData} />

      {/* חלוקה + עמודים */}
      {(eventBreakdown.length > 0 || topPages.length > 0) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ProjectEventBreakdown
            data={eventBreakdown}
            totalEvents={stats.totalEvents}
          />
          <ProjectTopPages pages={topPages} />
        </div>
      )}

      {/* אירועים אחרונים */}
      <div>
        <h2 className="text-lg font-bold text-zinc-200 mb-4">אירועים אחרונים</h2>
        <PaginatedEventsTable
          events={recentEvents.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() }))}
          totalEvents={stats.totalEvents}
        />
      </div>
    </div>
  );
}
