import { cn } from "@/utils/cn";
import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full py-3 px-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-zinc-200 placeholder:text-zinc-300",
            "focus:outline-none focus:ring-1 focus:ring-white/[0.12] focus:border-white/[0.12] transition-all resize-none",
            error && "border-red-500/30 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
