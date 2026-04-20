import { cn } from "@/utils/cn";
import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 pointer-events-none" />
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 placeholder:text-zinc-600",
              "focus:outline-none focus:ring-1 focus:ring-white/[0.12] focus:border-white/[0.12] transition-all",
              Icon ? "ps-12 pe-4" : "px-4",
              error && "border-red-500/30 focus:ring-red-500/20 focus:border-red-500/30",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
