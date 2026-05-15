import * as React from "react";

export function EmptyState({
  title,
  description,
  action,
  icon = "🌱",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-cream-200 bg-white px-8 py-16 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-serif text-lg text-ink-900">{title}</div>
      {description && <p className="text-ink-500 text-sm mt-1 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-4 inline-flex">{action}</div>}
    </div>
  );
}
