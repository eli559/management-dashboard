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
    <div className={cn("surface rounded-2xl p-10 md:p-16 text-center animate-slide-up", className)}>
      <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-4 md:mb-5">
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-zinc-500" />
      </div>
      <h3 className="text-base md:text-lg font-bold text-zinc-200 mb-2">{title}</h3>
      <p className="text-[13px] md:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
