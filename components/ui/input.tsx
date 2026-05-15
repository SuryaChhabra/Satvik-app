import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-cream-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300",
        "focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-cream-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 leading-relaxed",
        "focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-cream-200 bg-white px-3 py-2 text-sm text-ink-900",
        "focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-xs font-medium text-ink-700 mb-1", className)} {...props} />;
}
