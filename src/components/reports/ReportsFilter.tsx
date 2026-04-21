"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface Project {
  id: string;
  name: string;
  slug: string;
}

interface ReportsFilterProps {
  projects: Project[];
  currentDays: number;
  currentProjectId?: string;
}

const TIME_OPTIONS = [
  { value: "7", label: "7 ימים" },
  { value: "14", label: "14 ימים" },
  { value: "30", label: "30 ימים" },
  { value: "60", label: "60 ימים" },
  { value: "90", label: "90 ימים" },
];

export function ReportsFilter({ projects, currentDays, currentProjectId }: ReportsFilterProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasFilter = currentDays !== 30 || currentProjectId;

  function applyFilter(days?: string, projectId?: string) {
    const params = new URLSearchParams();
    if (days && days !== "30") params.set("days", days);
    if (projectId) params.set("project", projectId);
    const query = params.toString();
    router.push(query ? `/reports?${query}` : "/reports");
  }

  function clearFilters() {
    router.push("/reports");
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
          hasFilter
            ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
            : "bg-white/[0.04] text-zinc-300 border border-white/[0.1] hover:bg-white/[0.06]"
        )}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>סינון</span>
        {hasFilter && (
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
        )}
      </button>

      {open && (
        <div className="absolute top-full end-0 mt-2 w-[280px] glass-strong rounded-xl overflow-hidden animate-[dialog-in_150ms_ease-out] z-50 p-4 space-y-4">
          {/* תקופה */}
          <div>
            <p className="text-[11px] text-zinc-300 font-semibold mb-2">תקופה</p>
            <div className="flex flex-wrap gap-1.5">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    applyFilter(opt.value, currentProjectId);
                    setOpen(false);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all",
                    String(currentDays) === opt.value
                      ? "bg-white/[0.12] text-white border border-white/[0.15]"
                      : "bg-white/[0.04] text-zinc-300 border border-white/[0.06] hover:bg-white/[0.08]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* פרויקט */}
          {projects.length > 1 && (
            <div>
              <p className="text-[11px] text-zinc-300 font-semibold mb-2">פרויקט</p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    applyFilter(String(currentDays), undefined);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-start px-3 py-2 rounded-lg text-[12px] font-medium transition-all",
                    !currentProjectId
                      ? "bg-white/[0.12] text-white border border-white/[0.15]"
                      : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                  )}
                >
                  כל הפרויקטים
                </button>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      applyFilter(String(currentDays), p.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full text-start px-3 py-2 rounded-lg text-[12px] font-medium transition-all",
                      currentProjectId === p.id
                        ? "bg-white/[0.12] text-white border border-white/[0.15]"
                        : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ניקוי */}
          {hasFilter && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.06] transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>נקה סינון</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
