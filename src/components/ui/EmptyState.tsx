import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-zinc-100 shadow-sm p-16 text-center",
        className
      )}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-50 mb-5">
        <Icon className="w-7 h-7 text-zinc-400" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
