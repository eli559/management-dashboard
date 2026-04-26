"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { MONTH_NAMES_HE } from "@/utils/formatters";
import { FilterModal } from "@/components/ui/FilterModal";

interface Project { id: string; name: string; slug: string; }

interface ReportsFilterProps {
  projects: Project[];
  currentDays: number;
  currentProjectId?: string;
  currentMonth?: string;
}

const TIME_OPTIONS = [
  { value: "7", label: "7 ימים" },
  { value: "14", label: "14 ימים" },
  { value: "30", label: "30 ימים" },
  { value: "60", label: "60 ימים" },
  { value: "90", label: "90 ימים" },
];

function getMonths() {
  const m = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    m.push({ value: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`, label: `${MONTH_NAMES_HE[d.getMonth()]} ${d.getFullYear()}` });
  }
  return m;
}

export function ReportsFilter({ projects, currentDays, currentProjectId, currentMonth }: ReportsFilterProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const hasFilter = currentDays !== 30 || currentProjectId || currentMonth;

  function go(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    if (params.days && params.days !== "30") p.set("days", params.days);
    if (params.project) p.set("project", params.project);
    if (params.month) p.set("month", params.month);
    const q = p.toString();
    router.push(q ? `/reports?${q}` : "/reports");
    setOpen(false);
  }

  const months = getMonths();

  return (
    <>
      <button onClick={() => setOpen(true)}
        className={cn("flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
          hasFilter ? "bg-amber-400/10 text-amber-300 border border-amber-400/20" : "bg-white/[0.04] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.06]"
        )}>
        <SlidersHorizontal className="w-4 h-4" />
        <span>סינון</span>
        {hasFilter && <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />}
      </button>

      <FilterModal open={open} onClose={() => setOpen(false)} title="סינון דוחות">
        <div className="space-y-5">
          <div>
            <p className="text-[12px] text-zinc-300 font-semibold mb-2">תקופה אחרונה</p>
            <div className="flex flex-wrap gap-1.5">
              {TIME_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => go({ days: opt.value, project: currentProjectId })}
                  className={cn("px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all",
                    !currentMonth && String(currentDays) === opt.value ? "bg-white/[0.12] text-white border border-white/[0.15]" : "bg-white/[0.04] text-zinc-300 border border-white/[0.06] hover:bg-white/[0.08]"
                  )}>{opt.label}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] text-zinc-300 font-semibold mb-2">חודש ספציפי</p>
            <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto">
              {months.map((m) => (
                <button key={m.value} onClick={() => go({ month: m.value, project: currentProjectId })}
                  className={cn("px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all text-start",
                    currentMonth === m.value ? "bg-white/[0.12] text-white border border-white/[0.15]" : "bg-white/[0.04] text-zinc-300 border border-white/[0.06] hover:bg-white/[0.08]"
                  )}>{m.label}</button>
              ))}
            </div>
          </div>

          {projects.length > 1 && (
            <div>
              <p className="text-[12px] text-zinc-300 font-semibold mb-2">פרויקט</p>
              <div className="space-y-1 max-h-[120px] overflow-y-auto">
                <button onClick={() => go({ days: currentMonth ? undefined : String(currentDays), month: currentMonth })}
                  className={cn("w-full text-start px-3 py-2 rounded-lg text-[12px] font-medium transition-all",
                    !currentProjectId ? "bg-white/[0.12] text-white border border-white/[0.15]" : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                  )}>כל הפרויקטים</button>
                {projects.map((p) => (
                  <button key={p.id} onClick={() => go({ days: currentMonth ? undefined : String(currentDays), month: currentMonth, project: p.id })}
                    className={cn("w-full text-start px-3 py-2 rounded-lg text-[12px] font-medium transition-all",
                      currentProjectId === p.id ? "bg-white/[0.12] text-white border border-white/[0.15]" : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                    )}>{p.name}</button>
                ))}
              </div>
            </div>
          )}

          {hasFilter && (
            <button onClick={() => { router.push("/reports"); setOpen(false); }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] transition-all">
              <X className="w-3.5 h-3.5" /><span>נקה סינון</span>
            </button>
          )}
        </div>
      </FilterModal>
    </>
  );
}
