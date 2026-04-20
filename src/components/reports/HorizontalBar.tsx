import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";

interface HorizontalBarItem {
  label: string;
  value: number;
}

interface HorizontalBarProps {
  title: string;
  subtitle?: string;
  items: HorizontalBarItem[];
  color?: "blue" | "violet" | "emerald" | "amber";
  emptyText?: string;
  useBadge?: boolean;
  mono?: boolean;
  className?: string;
}

const barColors = {
  blue: "from-blue-500/40 to-blue-500/15",
  violet: "from-violet-500/40 to-violet-500/15",
  emerald: "from-emerald-500/40 to-emerald-500/15",
  amber: "from-amber-500/40 to-amber-500/15",
};

export function HorizontalBar({
  title,
  subtitle,
  items,
  color = "blue",
  emptyText = "אין נתונים",
  useBadge = false,
  mono = false,
  className,
}: HorizontalBarProps) {
  if (items.length === 0) {
    return (
      <div className={cn("surface rounded-2xl p-6 overflow-hidden relative", className)}>
        <h3 className="text-[15px] font-bold text-zinc-200 mb-4">{title}</h3>
        <div className="text-center py-8 text-[13px] text-zinc-600">{emptyText}</div>
      </div>
    );
  }

  const maxVal = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={cn("surface rounded-2xl p-6 overflow-hidden relative", className)}>
      <h3 className="text-[15px] font-bold text-zinc-200 mb-0.5">{title}</h3>
      {subtitle && <p className="text-[12px] text-zinc-600 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}

      <div className="space-y-2">
        {items.map((item) => {
          const pct = (item.value / maxVal) * 100;
          return (
            <div key={item.label} className="flex items-center gap-3">
              {useBadge ? (
                <Badge className="min-w-[80px] justify-center">{item.label}</Badge>
              ) : mono ? (
                <code className="text-[11px] text-zinc-400 font-mono truncate min-w-[120px] max-w-[160px]" dir="ltr">
                  {item.label}
                </code>
              ) : (
                <span className="text-[12px] text-zinc-400 min-w-[60px] truncate max-w-[120px]">{item.label}</span>
              )}
              <div className="flex-1 h-[7px] bg-white/[0.03] rounded-full overflow-hidden">
                <div
                  className={cn("h-full bg-gradient-to-l rounded-full transition-all duration-700", barColors[color])}
                  style={{ width: `${Math.max(pct, 3)}%` }}
                />
              </div>
              <span className="text-[11px] text-zinc-500 tabular-nums w-10 text-start font-medium">
                {item.value.toLocaleString("he-IL")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
