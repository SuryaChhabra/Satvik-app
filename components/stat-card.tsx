import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "sage" | "warn" | "danger";
}) {
  const toneClass =
    tone === "sage"
      ? "bg-sage-50"
      : tone === "warn"
      ? "bg-[#FCF6E9]"
      : tone === "danger"
      ? "bg-[#FBEDEA]"
      : "bg-white";
  return (
    <Card className={cn("border-cream-200", toneClass)}>
      <div className="px-5 py-4">
        <div className="text-xs uppercase tracking-wide text-ink-500">{label}</div>
        <div className="font-serif text-2xl text-ink-900 mt-1">{value}</div>
        {hint && <div className="text-xs text-ink-500 mt-1">{hint}</div>}
      </div>
    </Card>
  );
}
