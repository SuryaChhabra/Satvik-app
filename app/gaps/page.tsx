"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge, priorityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { detectGapsFromAnalyses } from "@/lib/aggregations";
import { downloadFile, toCsv } from "@/lib/utils";

export default function GapsPage() {
  const [data, actions] = useStore();
  const { analyses, gaps } = data;

  useEffect(() => {
    if (!gaps.length && analyses.length) {
      actions.saveGaps(detectGapsFromAnalyses(analyses));
    }
  }, [analyses, gaps.length, actions]);

  const regenerate = () => actions.saveGaps(detectGapsFromAnalyses(analyses));
  const exportCsv = () => {
    const rows = gaps.map((g) => ({
      title: g.title,
      gap_type: g.gap_type,
      priority: g.priority,
      owner: g.owner,
      why_it_matters: g.why_it_matters,
      recommended_action: g.recommended_action,
      evidence: g.evidence.join(" | "),
      output: g.suggested_output.join("; "),
    }));
    downloadFile("satvic-gaps.csv", toCsv(rows), "text/csv");
  };

  if (!analyses.length) {
    return (
      <>
        <PageHeader title="Gap analysis" />
        <EmptyState
          title="No gaps detected yet"
          description="Analyze questions to surface repeated themes and recommended actions."
          icon="🪴"
          action={<Link href="/upload"><Button>Upload questions</Button></Link>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Gap analysis"
        description="Where your communication, content, or product can gently close the loop for users."
        actions={
          <>
            <Button variant="outline" onClick={regenerate}>Regenerate</Button>
            <Button onClick={exportCsv}>Export CSV</Button>
          </>
        }
      />

      <div className="space-y-4">
        {gaps.map((g) => (
          <Card key={g.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{g.title}</CardTitle>
                  <CardDescription>Owner: <span className="capitalize">{g.owner}</span></CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={priorityTone(g.priority)}>Priority: {g.priority}</Badge>
                  <Badge tone="sage">{g.gap_type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Evidence (user questions)</div>
                  <ul className="list-disc pl-5 text-sm text-ink-700 space-y-1">
                    {g.evidence.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Why it matters</div>
                  <p className="text-sm text-ink-700">{g.why_it_matters}</p>
                  <div className="text-xs uppercase tracking-wide text-ink-500 mt-3 mb-1">Recommended action</div>
                  <p className="text-sm text-ink-900">{g.recommended_action}</p>
                  <div className="text-xs uppercase tracking-wide text-ink-500 mt-3 mb-1">Suggested output</div>
                  <div className="flex flex-wrap gap-2">
                    {g.suggested_output.map((o) => (
                      <Badge key={o} tone="info">{o}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
