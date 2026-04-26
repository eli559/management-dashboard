"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, Bug, CheckCircle, Search as SearchIcon,
  ChevronLeft, ChevronRight, X, Eye,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { getPageLabel } from "@/lib/page-labels";

interface ProjectError {
  id: string;
  message: string;
  stack: string | null;
  page: string | null;
  severity: string;
  status: string;
  sessionId: string | null;
  userAgent: string | null;
  deviceType: string | null;
  deviceName: string | null;
  browser: string | null;
  count: number;
  createdAt: string;
  project: { name: string; slug: string };
}

interface Props {
  errors: ProjectError[];
  stats: { total: number; newErrors: number; critical: number; projectsWithErrors: number };
  projects: { id: string; name: string }[];
  currentProject?: string;
  currentSeverity?: string;
  currentStatus?: string;
}

const SEVERITY_MAP: Record<string, { label: string; color: string; dot: string }> = {
  critical: { label: "קריטית", color: "text-red-400", dot: "bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]" },
  high: { label: "גבוהה", color: "text-orange-400", dot: "bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.5)]" },
  medium: { label: "בינונית", color: "text-amber-400", dot: "bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]" },
  low: { label: "נמוכה", color: "text-zinc-300", dot: "bg-zinc-400" },
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: "חדשה", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  investigating: { label: "בבדיקה", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  resolved: { label: "טופלה", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

const PAGE_SIZE = 30;

function timeAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "עכשיו";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `לפני ${h} שע׳`;
  return `לפני ${Math.floor(h / 24)} ימים`;
}

export function ErrorsClient({ errors, stats, projects, currentProject, currentSeverity, currentStatus }: Props) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState<ProjectError | null>(null);

  const totalPages = Math.ceil(errors.length / PAGE_SIZE);
  const visible = errors.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function navigate(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    if (params.project) p.set("project", params.project);
    if (params.severity) p.set("severity", params.severity);
    if (params.status) p.set("status", params.status);
    const q = p.toString();
    router.push(q ? `/errors?${q}` : "/errors");
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/errors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setDetail(null);
  }

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Bug className="w-4 h-4 text-red-400" /><span className="text-[11px] text-zinc-300">סה״כ שגיאות</span></div>
          <p className="text-[24px] font-extrabold text-white">{stats.total}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-amber-400" /><span className="text-[11px] text-zinc-300">חדשות</span></div>
          <p className="text-[24px] font-extrabold text-white">{stats.newErrors}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-[11px] text-zinc-300">קריטיות</span></div>
          <p className="text-[24px] font-extrabold text-white">{stats.critical}</p>
        </div>
        <div className="surface-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Bug className="w-4 h-4 text-violet-400" /><span className="text-[11px] text-zinc-300">פרויקטים עם שגיאות</span></div>
          <p className="text-[24px] font-extrabold text-white">{stats.projectsWithErrors}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select value={currentProject ?? ""} onChange={(e) => navigate({ project: e.target.value || undefined, severity: currentSeverity, status: currentStatus })}
          className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.1] rounded-lg text-[12px] text-zinc-200 cursor-pointer">
          <option value="">כל הפרויקטים</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={currentSeverity ?? ""} onChange={(e) => navigate({ project: currentProject, severity: e.target.value || undefined, status: currentStatus })}
          className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.1] rounded-lg text-[12px] text-zinc-200 cursor-pointer">
          <option value="">כל החומרות</option>
          <option value="critical">קריטית</option>
          <option value="high">גבוהה</option>
          <option value="medium">בינונית</option>
          <option value="low">נמוכה</option>
        </select>
        <select value={currentStatus ?? ""} onChange={(e) => navigate({ project: currentProject, severity: currentSeverity, status: e.target.value || undefined })}
          className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.1] rounded-lg text-[12px] text-zinc-200 cursor-pointer">
          <option value="">כל הסטטוסים</option>
          <option value="new">חדשה</option>
          <option value="investigating">בבדיקה</option>
          <option value="resolved">טופלה</option>
        </select>
      </div>

      {/* Error list */}
      {visible.length > 0 ? (
        <div className="space-y-2">
          {visible.map((err) => {
            const sev = SEVERITY_MAP[err.severity] ?? SEVERITY_MAP.low;
            const st = STATUS_MAP[err.status] ?? STATUS_MAP.new;
            return (
              <div key={err.id} className="surface rounded-2xl p-4 cursor-pointer hover:bg-white/[0.02] transition-all" onClick={() => setDetail(err)}>
                <div className="flex items-start gap-3">
                  <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 animate-[pulse_2.5s_ease-in-out_infinite]", sev.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] text-zinc-300 bg-white/[0.06] px-2 py-0.5 rounded-full">{err.project.name}</span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", st.color)}>{st.label}</span>
                      <span className={cn("text-[10px]", sev.color)}>{sev.label}</span>
                      {err.count > 1 && <span className="text-[10px] text-zinc-300 bg-white/[0.06] px-2 py-0.5 rounded-full">×{err.count}</span>}
                    </div>
                    <p className="text-[13px] text-zinc-200 truncate font-mono" dir="ltr">{err.message}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-300">
                      {err.page && <span>{getPageLabel(err.page)}</span>}
                      {err.deviceType && <span>{err.deviceType} · {err.browser}</span>}
                      <span>{timeAgo(err.createdAt)}</span>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-zinc-300 flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="surface rounded-2xl p-16 text-center">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-zinc-200 mb-2">אין שגיאות</h3>
          <p className="text-sm text-zinc-300">הכל תקין! אין שגיאות JavaScript שנקלטו</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-[13px] text-zinc-300 tabular-nums">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] disabled:opacity-30 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" onClick={() => setDetail(null)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-[100000] w-full max-w-[600px] max-h-[80vh] overflow-y-auto glass-strong rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-white">פרטי שגיאה</h2>
              <button onClick={() => setDetail(null)} className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-300"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[11px] text-zinc-300 mb-1">הודעה</p>
                <code className="block text-[12px] text-zinc-200 font-mono bg-white/[0.04] p-3 rounded-xl break-all" dir="ltr">{detail.message}</code>
              </div>

              {detail.stack && (
                <div>
                  <p className="text-[11px] text-zinc-300 mb-1">Stack Trace</p>
                  <pre className="text-[10px] text-zinc-300 font-mono bg-white/[0.04] p-3 rounded-xl overflow-x-auto max-h-[200px]" dir="ltr">{detail.stack}</pre>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div><span className="text-zinc-300">פרויקט:</span> <span className="text-zinc-200">{detail.project.name}</span></div>
                <div><span className="text-zinc-300">עמוד:</span> <span className="text-zinc-200">{getPageLabel(detail.page)}</span></div>
                <div><span className="text-zinc-300">מכשיר:</span> <span className="text-zinc-200">{detail.deviceType} · {detail.deviceName}</span></div>
                <div><span className="text-zinc-300">דפדפן:</span> <span className="text-zinc-200">{detail.browser}</span></div>
                <div><span className="text-zinc-300">מופעים:</span> <span className="text-zinc-200">{detail.count}</span></div>
                <div><span className="text-zinc-300">זמן:</span> <span className="text-zinc-200">{timeAgo(detail.createdAt)}</span></div>
              </div>

              <div className="flex gap-2 pt-2">
                {detail.status !== "resolved" && (
                  <button onClick={() => updateStatus(detail.id, "resolved")}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                    סמן כטופלה
                  </button>
                )}
                {detail.status === "new" && (
                  <button onClick={() => updateStatus(detail.id, "investigating")}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                    בבדיקה
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
