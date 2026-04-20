import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Key,
  Calendar,
  Activity,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { getProjectBySlug } from "@/lib/dal/projects";

export const dynamic = "force-dynamic";
import { getProjectEventStats, getRecentEventsByProject } from "@/lib/dal/events";
import { ApiKeyDisplay } from "@/features/projects/components/ApiKeyDisplay";
import { ProjectKpiGrid } from "@/features/projects/components/ProjectKpiGrid";
import { EventsTable } from "@/features/projects/components/EventsTable";
import {
  PROJECT_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_COLORS,
  PROJECT_STATUS_COLORS,
} from "@/features/projects/types";
import { formatDate } from "@/utils/formatters";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const [stats, recentEvents] = await Promise.all([
    getProjectEventStats(project.id),
    getRecentEventsByProject(project.id, 15),
  ]);

  return (
    <div className="space-y-8">
      {/* ── Back Link ── */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>חזרה לפרויקטים</span>
      </Link>

      {/* ── Project Header ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left - Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {project.name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                  PROJECT_TYPE_COLORS[project.type]
                )}
              >
                {PROJECT_TYPE_LABELS[project.type]}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    PROJECT_STATUS_COLORS[project.status]
                  )}
                />
                <span className="text-sm text-slate-500 font-medium">
                  {PROJECT_STATUS_LABELS[project.status]}
                </span>
              </div>
            </div>

            {project.description && (
              <p className="text-[15px] text-slate-500 max-w-xl leading-relaxed">
                {project.description}
              </p>
            )}

            <div className="flex items-center gap-5 text-sm text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>נוצר ב-{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>{stats.totalEvents.toLocaleString("he-IL")} אירועים</span>
              </div>
            </div>
          </div>

          {/* Right - API Key */}
          <div className="lg:min-w-[380px]">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                API Key
              </span>
            </div>
            <ApiKeyDisplay apiKey={project.apiKey} />
            <p className="text-[11px] text-slate-400 mt-2">
              השתמש במפתח זה כדי לשלוח אירועים לפרויקט דרך ה-API
            </p>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <ProjectKpiGrid {...stats} />

      {/* ── Recent Events ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">אירועים אחרונים</h2>
          <span className="text-sm text-slate-400">
            {recentEvents.length} אירועים מת��ך {stats.totalEvents.toLocaleString("he-IL")}
          </span>
        </div>
        <EventsTable events={recentEvents} />
      </div>
    </div>
  );
}
