import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "sage" | "cream" | "sky";
const tones: Record<Tone, string> = {
  neutral: "bg-cream-100 text-ink-700",
  sage: "bg-sage-100 text-sage-700",
  cream: "bg-[#F6E6DC] text-clay-500",
  sky: "bg-sky-soft text-[#3A567A]",
};

export function Chip({
  tone = "neutral",
  className,
  ...props
}: { tone?: Tone } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  );
}
