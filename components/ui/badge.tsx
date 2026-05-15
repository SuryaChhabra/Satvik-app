import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "sage" | "clay" | "warn" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-cream-100 text-ink-700",
  sage: "bg-sage-100 text-sage-700",
  clay: "bg-[#F6E6DC] text-clay-500",
  warn: "bg-[#FBEFD8] text-[#8A6E1E]",
  danger: "bg-[#F6D9D5] text-[#9C3A30]",
  info: "bg-[#E2EAF1] text-[#3A567A]",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: { tone?: Tone } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function sensitivityTone(s: string): Tone {
  if (s === "urgent") return "danger";
  if (s === "health-sensitive") return "warn";
  if (s === "needs-disclaimer") return "warn";
  if (s === "human-review") return "danger";
  return "sage";
}

export function priorityTone(p: string): Tone {
  if (p === "high") return "danger";
  if (p === "medium") return "warn";
  return "info";
}
