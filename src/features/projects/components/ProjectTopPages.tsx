import { Globe } from "lucide-react";
import type { TopPage } from "@/lib/dal/events";

interface Props {
  pages: TopPage[];
}

export function ProjectTopPages({ pages }: Props) {
  if (pages.length === 0) return null;

  const maxCount = Math.max(...pages.map((p) => p.count), 1);

  return (
    <div className="surface rounded-2xl p-6 overflow-hidden relative">
      <h3 className="text-[15px] font-bold text-zinc-200 mb-1">עמודים נצפים</h3>
      <p className="text-[13px] text-zinc-400 mb-5">העמודים שנצפו הכי הרבה</p>

      <div className="space-y-2">
        {pages.map((page) => {
          const pct = (page.count / maxCount) * 100;
          return (
            <div key={page.page} className="flex items-center gap-3">
              <code className="text-[11px] text-zinc-400 font-mono truncate max-w-[180px]" dir="ltr">
                {page.page}
              </code>
              <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-emerald-500/40 to-emerald-500/20 rounded-full"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
              <span className="text-[12px] text-zinc-400 tabular-nums w-10 text-start">
                {page.count.toLocaleString("he-IL")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
