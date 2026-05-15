"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { generateFaqsFromAnalyses, detectGapsFromAnalyses, generateWeeklyReport } from "@/lib/aggregations";
import { downloadFile } from "@/lib/utils";

export default function ReportPage() {
  const [data, actions] = useStore();
  const { analyses, insights, faqs, gaps } = data;

  const report = useMemo(() => {
    const f = faqs.length ? faqs : generateFaqsFromAnalyses(analyses);
    const g = gaps.length ? gaps : detectGapsFromAnalyses(analyses);
    return generateWeeklyReport(analyses, g, f, insights);
  }, [analyses, faqs, gaps, insights]);

  const exportMd = () => {
    const md = renderReportMarkdown(report);
    downloadFile("satvic-weekly-report.md", md, "text/markdown");
  };

  const saveReport = () => actions.saveReport(report);

  if (!analyses.length) {
    return (
      <>
        <PageHeader title="Weekly insights report" />
        <EmptyState
          title="No report yet"
          description="Analyze a batch of questions and we'll draft a clean weekly report you can paste into Notion."
          icon="📰"
          action={<Link href="/upload"><Button>Upload questions</Button></Link>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Weekly insights report"
        description="A calm, copy-pastable summary for the growth team."
        actions={
          <>
            <Button variant="outline" onClick={saveReport}>Save snapshot</Button>
            <Button onClick={exportMd}>Export Markdown</Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Executive summary</CardTitle>
          <CardDescription>{report.date_range}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-ink-700 text-sm leading-relaxed">{report.summary}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
            {report.metrics.map((m) => (
              <div key={m.label} className="rounded-xl bg-cream-50 border border-cream-200 px-3 py-2">
                <div className="text-xs uppercase tracking-wide text-ink-500">{m.label}</div>
                <div className="font-serif text-xl text-ink-900">{m.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Section title="Top 5 repeated question themes" items={report.top_themes} />
        <Section title="Top 5 user hesitations" items={report.top_hesitations} />
        <Section title="Top 5 gaps" items={report.gaps} />
        <Section title="New FAQ recommendations" items={report.faq_recommendations} />
        <Section title="Content ideas" items={report.content_ideas} />
        <Section title="Website / app improvements" items={report.website_recommendations} />
        <Section title="Support workflow suggestions" items={report.support_workflow} />
        <Section title="Bot improvement suggestions" items={report.bot_improvements} />
        <Section title="Experiments for next week" items={report.experiments} tone="sage" />
      </div>
    </>
  );
}

function Section({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "sage" }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-ink-700">
            {items.map((it, i) => (
              <li key={i} className={tone === "sage" ? "text-sage-700" : undefined}>{it}</li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-ink-500">—</div>
        )}
      </CardContent>
    </Card>
  );
}

function renderReportMarkdown(r: ReturnType<typeof generateWeeklyReport>) {
  const block = (title: string, items: string[]) => `## ${title}\n${items.length ? items.map((i) => `- ${i}`).join("\n") : "—"}\n`;
  return `# Satvic Response Intelligence — Weekly Report\n_${r.date_range}_\n\n## Executive summary\n${r.summary}\n\n## Metrics\n${r.metrics.map((m) => `- **${m.label}:** ${m.value}`).join("\n")}\n\n${block("Top themes", r.top_themes)}\n${block("Top hesitations", r.top_hesitations)}\n${block("Top gaps", r.gaps)}\n${block("New FAQ recommendations", r.faq_recommendations)}\n${block("Content ideas", r.content_ideas)}\n${block("Website / app improvements", r.website_recommendations)}\n${block("Support workflow", r.support_workflow)}\n${block("Bot improvements", r.bot_improvements)}\n${block("Experiments next week", r.experiments)}\n`;
}
