"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [data] = useStore();
  const { analyses, runs } = data;

  const stats = useMemo(() => {
    const total = analyses.length;
    const catCount = new Map<string, number>();
    analyses.forEach((a) => catCount.set(a.category, (catCount.get(a.category) ?? 0) + 1));
    const topCategory = Array.from(catCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const health = analyses.filter((a) => a.sensitivity_level !== "normal").length;
    const faqCandidates = analyses.filter((a) => a.bot_answerable !== "no").length;
    const escalations = analyses.filter((a) => a.escalation_needed).length;
    const gapCount = new Map<string, number>();
    analyses.forEach((a) => gapCount.set(a.gap_type, (gapCount.get(a.gap_type) ?? 0) + 1));
    const topGap = Array.from(gapCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const botPct = total ? Math.round((analyses.filter((a) => a.bot_answerable !== "no").length / total) * 100) : 0;

    const themes = new Map<string, number>();
    analyses.forEach((a) => themes.set(a.intent, (themes.get(a.intent) ?? 0) + 1));
    const repeated = Array.from(themes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return { total, topCategory, health, faqCandidates, escalations, topGap, botPct, repeated };
  }, [analyses]);

  return (
    <>
      <PageHeader
        title="Welcome back 🌿"
        description="A calm overview of the questions your community is asking — and the next gentle actions you can take."
        actions={
          <>
            <Link href="/upload"><Button>Analyze new questions</Button></Link>
            <Link href="/report"><Button variant="outline">Weekly report</Button></Link>
          </>
        }
      />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total analyzed" value={stats.total} hint="Across all runs" tone="sage" />
        <StatCard label="Top category" value={stats.topCategory} />
        <StatCard label="Health-sensitive" value={stats.health} hint="Need disclaimers" tone="warn" />
        <StatCard label="FAQ candidates" value={stats.faqCandidates} />
        <StatCard label="Human escalation" value={stats.escalations} tone={stats.escalations ? "danger" : "default"} />
        <StatCard label="Top gap" value={stats.topGap} />
        <StatCard label="Bot-answerable" value={`${stats.botPct}%`} tone="sage" />
        <StatCard label="Runs" value={runs.length} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top repeated themes</CardTitle>
            <CardDescription>Patterns that come up again and again — gentle prompts for next content/FAQ/bot work.</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.repeated.length ? (
              <ul className="divide-y divide-cream-100">
                {stats.repeated.map(([theme, count]) => (
                  <li key={theme} className="flex items-center justify-between py-3">
                    <span className="text-sm text-ink-700">{theme}</span>
                    <Badge tone="sage">{count}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-ink-500">No themes yet. Upload some questions.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent analysis runs</CardTitle>
            <CardDescription>Each run analyzes one batch of questions.</CardDescription>
          </CardHeader>
          <CardContent>
            {runs.length ? (
              <ul className="space-y-3">
                {runs.slice(0, 6).map((r) => (
                  <li key={r.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-ink-900">
                        {r.total_questions} question{r.total_questions !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-ink-500">{new Date(r.ran_at).toLocaleString()}</div>
                    </div>
                    <Badge tone={r.source === "openai" ? "info" : "neutral"}>{r.source}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-ink-500">No runs yet.</div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recommended next actions</CardTitle>
            <CardDescription>A gentle to-do list shaped by what users are asking.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-ink-700 list-decimal pl-5">
              <li>
                Review <Link className="text-sage-600 underline underline-offset-4" href="/gaps">Gap Analysis</Link> and pick 2 high-priority gaps to close this week.
              </li>
              <li>
                Approve the top <Link className="text-sage-600 underline underline-offset-4" href="/faqs">FAQ candidates</Link> and add them to the website/app.
              </li>
              <li>
                Send the <Link className="text-sage-600 underline underline-offset-4" href="/report">Weekly Insights Report</Link> to the growth team.
              </li>
              <li>
                Use <Link className="text-sage-600 underline underline-offset-4" href="/templates">Response Templates</Link> for any recurring health-sensitive replies (with disclaimers).
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
