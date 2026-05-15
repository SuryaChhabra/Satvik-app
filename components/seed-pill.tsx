"use client";
import { useUserStore } from "@/lib/store";

export function SeedPill() {
  const { state } = useUserStore();
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-sage-100 text-sage-700 px-3 py-1 text-sm font-medium">
      <span>🌱 {state.seeds} Seeds</span>
      <span className="text-ink-500 text-xs">· {state.level}</span>
    </div>
  );
}
