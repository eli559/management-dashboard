"use client";

import { useState } from "react";
import {
  AlertTriangle, TrendingDown, TrendingUp, Activity,
  BarChart3, Globe, FolderKanban, Database,
  ChevronLeft, ChevronRight, Lightbulb,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { Insight, InsightSeverity, InsightType } from "@/lib/insights/insights-engine";

interface Props {
  insights: Insight[];
  projects: { id: string; name: string }[];
  currentProjectId?: string;
}

const PAGE_SIZE = 30;

const SEVERITY_STYLES: Record<InsightSeverity, { bg: string; border: string; dot: string; label: string }> = {
  critical: { bg: "bg-red-500/8", border: "border-red-500/20", dot: "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]", label: "חשוב" },
  warning: { bg: "bg-amber-500/8", border: "border-amber-500/20", dot: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]", label: "בינוני" },
  success: { bg: "bg-emerald-500/8", border: "border-emerald-500/20", dot: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]", label: "חיובי" },
  info: { bg: "bg-blue-500/8", border: "border-blue-500/20", dot: "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]", label: "מידע" },
};

const TYPE_ICONS: Record<InsightType, typeof Activity> = {
  no_activity: AlertTriangle,
  high_activity: Activity,
  drop: TrendingDown,
  rise: TrendingUp,
  top_event: BarChart3,
  top_page: Globe,
  top_project: FolderKanban,
  low_data: Database,
};

const SEVERITY_OPTIONS = [
  { value: "", label: "כל החומרות" },
  { value: "critical", label: "חשוב" },
  { value: "warning", label: "בינוני" },
  { value: "success", label: "חיובי" },
  { value: "info", label: "מידע" },
];

const TYPE_OPTIONS = [
  { value: "", label: "כל הסוגים" },
  { value: "no_activity", label: "אין פעילות" },
  { value: "drop", label: "ירידה" },
  { value: "rise", label: "עליה" },
  { value: "high_activity", label: "פעילות גבוהה" },
  { value: "low_data", label: "חוסר דאטה" },
  { value: "top_event", label: "אירוע דומיננטי" },
  { value: "top_page", label: "עמוד מוביל" },
  { value: "top_project", label: "פרויקט מוביל" },
];

export function InsightsClient({ insights, projects, currentProjectId }: Props) {
  const [severityFilter, setSeverityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(0);

  let filtered = insights;
  if (severityFilter) filtered = filtered.filter((i) => i.severity === severityFilter);
  if (typeFilter) filtered = filtered.filter((i) => i.type === typeFilter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const criticalCount = insights.filter((i) => i.severity === "critical").length;
  const successCount = insights.filter((i) => i.severity === "success").length;
  const projectsWithIssues = new Set(insights.filter((i) => i.severity === "critical" || i.severity === "warning").map((i) => i.projectId)).size;

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] text-zinc-300">סה״כ תובנות</span>
          </div>
          <p className="text-[24px] font-extrabold text-white">{insights.length}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-[11px] text-zinc-300">קריטיות</span>
          </div>
          <p className="text-[24px] font-extrabold text-white">{criticalCount}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-zinc-300">חיוביות</span>
          </div>
          <p className="text-[24px] font-extrabold text-white">{successCount}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FolderKanban className="w-4 h-4 text-violet-400" />
            <span className="text-[11px] text-zinc-300">פרויקטים עם בעיות</span>
          </div>
          <p className="text-[24px] font-extrabold text-white">{projectsWithIssues}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value); setPage(0); }}
          className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.1] rounded-lg text-[12px] text-zinc-200 focus:outline-none focus:ring-1 focus:ring-white/[0.15] cursor-pointer">
          {SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
          className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.1] rounded-lg text-[12px] text-zinc-200 focus:outline-none focus:ring-1 focus:ring-white/[0.15] cursor-pointer">
          {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {(severityFilter || typeFilter) && (
          <button onClick={() => { setSeverityFilter(""); setTypeFilter(""); setPage(0); }}
            className="px-3 py-1.5 rounded-lg text-[12px] text-zinc-300 bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] transition-all">
            נקה סינון
          </button>
        )}
      </div>

      {/* Insights cards */}
      {visible.length > 0 ? (
        <div className="space-y-3">
          {visible.map((insight) => {
            const s = SEVERITY_STYLES[insight.severity];
            const Icon = TYPE_ICONS[insight.type] ?? Lightbulb;
            return (
              <div key={insight.id} className={cn("surface rounded-2xl p-5 border-s-4", s.border)}>
                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
                    <Icon className="w-5 h-5 text-zinc-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn("w-2 h-2 rounded-full animate-[pulse_2.5s_ease-in-out_infinite]", s.dot)} />
                      <h3 className="text-[14px] font-bold text-white">{insight.title}</h3>
                      {insight.projectName && (
                        <span className="text-[11px] text-zinc-300 bg-white/[0.06] px-2 py-0.5 rounded-full">{insight.projectName}</span>
                      )}
                    </div>
                    <p className="text-[13px] text-zinc-300 leading-relaxed">{insight.description}</p>
                    <p className="text-[12px] text-zinc-300 mt-2 flex items-center gap-1.5">
                      <Lightbulb className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span>{insight.recommendation}</span>
                    </p>
                  </div>
                  {insight.metricValue !== null && (
                    <div className="text-end flex-shrink-0">
                      <p className="text-[20px] font-extrabold text-white">{insight.metricValue}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="surface rounded-2xl p-16 text-center">
          <Lightbulb className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-200 mb-2">אין תובנות</h3>
          <p className="text-sm text-zinc-300 max-w-sm mx-auto">
            {insights.length === 0 ? "אין מספיק נתונים כדי לייצר תובנות. המערכת תנתח את הנתונים ברגע שיהיו מספיק אירועים." : "אין תובנות שמתאימות לסינון שבחרת."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-[13px] text-zinc-300 tabular-nums">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
