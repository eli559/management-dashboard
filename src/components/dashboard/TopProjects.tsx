import Link from "next/link";
import { FolderKanban, ArrowLeft } from "lucide-react";
import type { ProjectSummary } from "@/lib/dal/dashboard";

interface TopProjectsProps {
  projects: ProjectSummary[];
}

export function TopProjects({ projects }: TopProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <div className="relative glass rounded-2xl p-6 animate-slide-up stagger-6 overflow-hidden">

      <h3 className="text-[15px] font-bold text-zinc-200 mb-1">פרויקטים מובילים</h3>
      <p className="text-[13px] text-zinc-400 mb-5">לפי מספר אירועים</p>

      <div className="space-y-1">
        {projects.map((project, idx) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 flex-shrink-0">
              <span className="text-[11px] font-bold">{idx + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-zinc-300 truncate">{project.name}</p>
            </div>
            <span className="text-[12px] text-zinc-400 tabular-nums">
              {project.eventCount.toLocaleString("he-IL")}
            </span>
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
