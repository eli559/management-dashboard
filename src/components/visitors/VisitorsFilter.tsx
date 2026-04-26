"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { FilterModal } from "@/components/ui/FilterModal";

interface Project { id: string; name: string; slug: string; }

interface VisitorsFilterProps {
  projects: Project[];
  currentDays: number;
  currentProjectId?: string;
  currentDevice?: string;
}

const TIME_OPTIONS = [
  { value: "7", label: "7 ימים" },
  { value: "14", label: "14 ימים" },
  { value: "30", label: "30 ימים" },
  { value: "90", label: "90 ימים" },
];

const DEVICE_OPTIONS = [
  { value: "", label: "כל המכשירים" },
  { value: "טלפון", label: "טלפון" },
  { value: "מחשב", label: "מחשב" },
  { value: "טאבלט", label: "טאבלט" },
];

export function VisitorsFilter({ projects, currentDays, currentProjectId, currentDevice }: VisitorsFilterProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const hasFilter = currentDays !== 30 || currentProjectId || currentDevice;

  function go(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    if (params.days && params.days !== "30") p.set("days", params.days);
    if (params.project) p.set("project", params.project);
    if (params.device) p.set("device", params.device);
    const q = p.toString();
    router.push(q ? `/visitors?${q}` : "/visitors");
    setOpen(false);
  }

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

      <FilterModal open={open} onClose={() => setOpen(false)} title="סינון מבקרים">
        <div className="space-y-5">
          <div>
            <p className="text-[12px] text-zinc-300 font-semibold mb-2">תקופה</p>
            <div className="flex flex-wrap gap-1.5">
              {TIME_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => go({ days: opt.value, project: currentProjectId, device: currentDevice })}
                  className={cn("px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all",
                    String(currentDays) === opt.value ? "bg-white/[0.12] text-white border border-white/[0.15]" : "bg-white/[0.04] text-zinc-300 border border-white/[0.06] hover:bg-white/[0.08]"
                  )}>{opt.label}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[12px] text-zinc-300 font-semibold mb-2">סוג מכשיר</p>
            <div className="flex flex-wrap gap-1.5">
              {DEVICE_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => go({ days: String(currentDays), project: currentProjectId, device: opt.value || undefined })}
                  className={cn("px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all",
                    (currentDevice ?? "") === opt.value ? "bg-white/[0.12] text-white border border-white/[0.15]" : "bg-white/[0.04] text-zinc-300 border border-white/[0.06] hover:bg-white/[0.08]"
                  )}>{opt.label}</button>
              ))}
            </div>
          </div>

          {projects.length > 1 && (
            <div>
              <p className="text-[12px] text-zinc-300 font-semibold mb-2">פרויקט</p>
              <div className="space-y-1">
                <button onClick={() => go({ days: String(currentDays), device: currentDevice })}
                  className={cn("w-full text-start px-3 py-2 rounded-lg text-[12px] font-medium transition-all",
                    !currentProjectId ? "bg-white/[0.12] text-white border border-white/[0.15]" : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                  )}>כל הפרויקטים</button>
                {projects.map((p) => (
                  <button key={p.id} onClick={() => go({ days: String(currentDays), device: currentDevice, project: p.id })}
                    className={cn("w-full text-start px-3 py-2 rounded-lg text-[12px] font-medium transition-all",
                      currentProjectId === p.id ? "bg-white/[0.12] text-white border border-white/[0.15]" : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                    )}>{p.name}</button>
                ))}
              </div>
            </div>
          )}

          {hasFilter && (
            <button onClick={() => { router.push("/visitors"); setOpen(false); }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] transition-all">
              <X className="w-3.5 h-3.5" /><span>נקה סינון</span>
            </button>
          )}
        </div>
      </FilterModal>
    </>
  );
}
