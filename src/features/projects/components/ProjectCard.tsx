import Link from "next/link";
import { Calendar, Activity, ArrowLeft, Clock, Zap } from "lucide-react";
import { cn } from "@/utils/cn";
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS, PROJECT_TYPE_COLORS, PROJECT_STATUS_COLORS } from "@/features/projects/types";
import { formatDate, formatRelativeTime } from "@/utils/formatters";

interface ProjectCardProps {
  name: string;
  slug: string;
  type: string;
  status: string;
  description: string | null;
  createdAt: Date;
  eventCount: number;
  lastEventAt: Date | null;
}

export function ProjectCard({
  name, slug, type, status, description,
  createdAt, eventCount, lastEventAt,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block">
      <div className="surface rounded-2xl p-6 h-full flex flex-col hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative">

        <div className="flex items-center gap-2 mb-4">
          <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border", PROJECT_TYPE_COLORS[type])}>
            {PROJECT_TYPE_LABELS[type]}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]", PROJECT_STATUS_COLORS[status])} />
            <span className="text-[11px] text-zinc-500 font-medium">{PROJECT_STATUS_LABELS[status]}</span>
          </div>
        </div>

        <h3 className="text-[15px] font-bold text-zinc-200 mb-1.5 group-hover:text-white transition-colors">{name}</h3>

        {description && (
          <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2 mb-4">{description}</p>
        )}

        <div className="flex-1" />

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[12px] font-semibold">{eventCount.toLocaleString("he-IL")}</span>
            <span className="text-[11px] text-zinc-600">אירועים</span>
          </div>
          {lastEventAt && (
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Zap className="w-3 h-3" />
              <span className="text-[11px]">{formatRelativeTime(lastEventAt)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-zinc-600">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{formatDate(createdAt)}</span>
          </div>
          <ArrowLeft className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
        </div>
      </div>
    </Link>
  );
}
