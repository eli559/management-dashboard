import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, className, children }: EmptyStateProps) {
  return (
    <div className={cn("surface rounded-2xl p-16 text-center", className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-5">
        <Icon className="w-7 h-7 text-zinc-500" />
      </div>
      <h3 className="text-lg font-bold text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
