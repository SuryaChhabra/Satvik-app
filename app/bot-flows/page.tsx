"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { generateBotFlows } from "@/lib/aggregations";
import { downloadFile, toCsv } from "@/lib/utils";

export default function BotFlowsPage() {
  const [data, actions] = useStore();
  const { analyses, bot_flows } = data;

  useEffect(() => {
    if (!bot_flows.length && analyses.length) {
      actions.saveFlows(generateBotFlows(analyses));
    }
  }, [analyses, bot_flows.length, actions]);

  const regenerate = () => actions.saveFlows(generateBotFlows(analyses));
  const exportJson = () => downloadFile("satvic-bot-flows.json", JSON.stringify(bot_flows, null, 2), "application/json");
  const exportMd = () => {
    const md = bot_flows
      .map((f) => {
        const steps = f.steps
          .map(
            (s, i) =>
              `${i + 1}. **${s.speaker}**: ${s.text}${
                s.options ? `\n   - Options: ${s.options.join(" | ")}` : ""
              }${s.escalation ? "\n   - 🚨 Escalation point" : ""}`,
          )
          .join("\n");
        return `## ${f.title}\n\n**Trigger:** ${f.trigger_category}\n\n**Opening:** ${f.opening_message}\n\n${steps}\n\n**Escalation rules:**\n${f.escalation_rules.map((e) => `- ${e}`).join("\n")}\n\n**Final CTA:** ${f.final_cta}\n`;
      })
      .join("\n---\n\n");
    downloadFile("satvic-bot-flows.md", md, "text/markdown");
  };
  const exportCsv = () => {
    const rows = bot_flows.flatMap((f) =>
      f.steps.map((s, i) => ({
        flow: f.title,
        step: i + 1,
        speaker: s.speaker,
        text: s.text,
        options: s.options?.join(" | ") ?? "",
        escalation: s.escalation ? "yes" : "no",
      })),
    );
    downloadFile("satvic-bot-flows.csv", toCsv(rows), "text/csv");
  };

  if (!analyses.length) {
    return (
      <>
        <PageHeader title="Bot flows" />
        <EmptyState
          title="No flows generated yet"
          description="Analyze questions to generate starter chatbot flows."
          icon="🤖"
          action={<Link href="/upload"><Button>Upload questions</Button></Link>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Bot flow builder"
        description="Starter conversational flows mapped to the categories you're seeing — with strict safety rules for health questions."
        actions={
          <>
            <Button variant="outline" onClick={regenerate}>Regenerate</Button>
            <Button variant="outline" onClick={exportJson}>JSON</Button>
            <Button variant="outline" onClick={exportCsv}>CSV</Button>
            <Button onClick={exportMd}>Markdown</Button>
          </>
        }
      />
      <div className="space-y-5">
        {bot_flows.map((f) => (
          <Card key={f.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>{f.title}</CardTitle>
                  <CardDescription>Trigger: {f.trigger_category}</CardDescription>
                </div>
                <Badge tone="sage">{f.steps.length + 1} steps</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-cream-50 border border-cream-200 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Badge tone="info">bot</Badge>
                  <div className="text-sm text-ink-900">{f.opening_message}</div>
                </div>
                {f.steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Badge tone={s.speaker === "bot" ? "info" : "neutral"}>{s.speaker}</Badge>
                    <div className="text-sm text-ink-900 flex-1">
                      <div>{s.text}</div>
                      {s.options && (
                        <ul className="mt-1 flex flex-wrap gap-2">
                          {s.options.map((o, j) => (
                            <li key={j} className="text-xs rounded-full bg-white border border-cream-200 px-2.5 py-0.5 text-ink-700">{o}</li>
                          ))}
                        </ul>
                      )}
                      {s.escalation && <div className="text-xs text-clay-500 mt-1">🚨 Escalation point — route to human.</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Escalation rules</div>
                <ul className="list-disc pl-5 text-sm text-ink-700">
                  {f.escalation_rules.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                <div className="text-xs uppercase tracking-wide text-ink-500 mt-3 mb-1">Final CTA</div>
                <div className="text-sm text-ink-900">{f.final_cta}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
