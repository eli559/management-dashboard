import Link from "next/link";
import { Calendar, Activity, ArrowLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";
import {
  PROJECT_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_COLORS,
  PROJECT_STATUS_COLORS,
} from "@/features/projects/types";
import { formatDate } from "@/utils/formatters";

interface ProjectCardProps {
  name: string;
  slug: string;
  type: string;
  status: string;
  description: string | null;
  createdAt: Date;
  eventCount: number;
}

export function ProjectCard({
  name,
  slug,
  type,
  status,
  description,
  createdAt,
  eventCount,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full flex flex-col hover:shadow-md hover:border-slate-200 transition-all duration-300">
        {/* Header - Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
              PROJECT_TYPE_COLORS[type]
            )}
          >
            {PROJECT_TYPE_LABELS[type]}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                PROJECT_STATUS_COLORS[status]
              )}
            />
            <span className="text-[11px] text-slate-500 font-medium">
              {PROJECT_STATUS_LABELS[status]}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">
                {formatDate(createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">
                {eventCount.toLocaleString("he-IL")} אירועים
              </span>
            </div>
          </div>
          <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </div>
      </div>
    </Link>
  );
}
