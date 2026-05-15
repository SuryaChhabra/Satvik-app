"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "soft" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-sage-500 text-white hover:bg-sage-600",
  soft: "bg-sage-100 text-sage-700 hover:bg-sage-200",
  ghost: "bg-transparent text-ink-700 hover:bg-cream-100",
  outline: "border border-sage-200 text-ink-900 bg-white hover:bg-sage-50",
};
const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-full",
  md: "px-4 py-2 text-sm rounded-full",
  lg: "px-5 py-3 text-base rounded-full",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-sage-300 focus:ring-offset-1 focus:ring-offset-cream-50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
