"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

const ACTION_BY_CATEGORY: Record<string, string> = {
  "Beginner confusion": "Build a calmer onboarding: '1 small step' homepage CTA + 3-Day Gentle Start.",
  "Health-sensitive doubts": "Add a single 'Conditions & Satvic' explainer page with disclaimers + human escalation path.",
  "Product/program clarity": "Add a 'How it works' module to the program page + 'Built for beginners' badge.",
  "Recipe/lifestyle implementation": "Publish a weekly meal plan + cooking starter pantry list.",
  "Trust/credibility": "Publish 'Our approach: tradition + science' page; collect 5 short video testimonials.",
  "Pricing/payment": "Surface refund policy + 'What you get' breakdown clearly on checkout.",
  "Order/access support": "Build a self-serve access-recovery flow + welcome email automation.",
  "Retention/consistency": "Launch a 'Quiet Returner' re-engagement flow + 1-Day Soft Return plan.",
  "Seasonal wellness": "Auto-surface seasonal recipe collections by month.",
  "Family adaptation": "Create a dedicated 'Satvic for families' landing page + family challenge.",
  "Content gap": "Add the top 3 content ideas to the editorial calendar.",
  "Technical/app support": "Add a status page + 'common access issues' help article.",
  "Other": "Send to the team for manual review.",
};

export default function CategoriesPage() {
  const [data] = useStore();
  const { analyses } = data;

  const grouped = useMemo(() => {
    const map = new Map<string, typeof analyses>();
    for (const a of analyses) {
      if (!map.has(a.category)) map.set(a.category, []);
      map.get(a.category)!.push(a);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [analyses]);

  if (!analyses.length) {
    return (
      <>
        <PageHeader title="Categories" />
        <EmptyState title="No categories yet" description="Upload questions to see them grouped by theme." />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="A calm map of what your community is asking — with a recommended next action for each theme."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grouped.map(([cat, items]) => {
          const intents = new Map<string, number>();
          items.forEach((i) => intents.set(i.intent, (intents.get(i.intent) ?? 0) + 1));
          const patterns = Array.from(intents.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
          return (
            <Card key={cat}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{cat}</CardTitle>
                  <Badge tone="sage">{items.length}</Badge>
                </div>
                <CardDescription>{patterns.map(([p]) => p).join(" · ") || "—"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Sample questions</div>
                <ul className="list-disc pl-5 text-sm text-ink-700 space-y-1 mb-4">
                  {items.slice(0, 4).map((i) => (
                    <li key={i.id}>{i.question}</li>
                  ))}
                </ul>
                <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">FAQ candidate</div>
                <div className="text-sm text-ink-700 mb-3">{items[0].question}</div>
                <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Template starter</div>
                <div className="rounded-xl bg-sage-50 p-3 text-sm text-ink-900 whitespace-pre-line">
                  {items[0].suggested_whatsapp_reply}
                </div>
                <div className="text-xs uppercase tracking-wide text-ink-500 mt-4 mb-1">Recommended product/growth action</div>
                <div className="text-sm text-ink-900">{ACTION_BY_CATEGORY[cat] ?? items[0].recommended_action}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
