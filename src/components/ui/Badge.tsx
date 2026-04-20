import { cn } from "@/utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/[0.06] text-zinc-400 border-white/[0.06]",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/10",
  danger: "bg-red-500/10 text-red-400 border-red-500/10",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/10",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
