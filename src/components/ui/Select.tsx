import { cn } from "@/utils/cn";
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption { value: string; label: string; }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-zinc-400 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full py-3 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200",
              "focus:outline-none focus:ring-1 focus:ring-white/[0.12] focus:border-white/[0.12] transition-all",
              "appearance-none cursor-pointer pe-10",
              error && "border-red-500/30 focus:ring-red-500/20",
              className
            )}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
