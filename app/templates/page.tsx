"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { generateTemplatesFromAnalyses } from "@/lib/aggregations";
import { downloadFile, toCsv } from "@/lib/utils";

export default function TemplatesPage() {
  const [data, actions] = useStore();
  const { analyses, templates } = data;

  useEffect(() => {
    if (!templates.length && analyses.length) {
      actions.saveTemplates(generateTemplatesFromAnalyses(analyses));
    }
  }, [analyses, templates.length, actions]);

  const regenerate = () => actions.saveTemplates(generateTemplatesFromAnalyses(analyses));
  const copy = (s: string) => navigator.clipboard?.writeText(s);

  const exportCsv = () => {
    const rows = templates.map((t) => ({
      name: t.name,
      category: t.category,
      use_case: t.use_case,
      whatsapp: t.whatsapp_version,
      email: t.email_version,
      tone_notes: t.tone_notes,
      escalation_rule: t.escalation_rule,
      follow_up: t.follow_up_message ?? "",
    }));
    downloadFile("satvic-templates.csv", toCsv(rows), "text/csv");
  };

  const exportMd = () => {
    const md = templates
      .map(
        (t) =>
          `## ${t.name}\n\n**Category:** ${t.category}\n\n**Use case:** ${t.use_case}\n\n**WhatsApp:**\n> ${t.whatsapp_version}\n\n**Email:**\n${t.email_version}\n\n**Tone notes:** ${t.tone_notes}\n\n**Escalation:** ${t.escalation_rule}\n\n**Follow-up:** ${t.follow_up_message ?? "—"}\n`,
      )
      .join("\n---\n\n");
    downloadFile("satvic-templates.md", md, "text/markdown");
  };

  if (!analyses.length) {
    return (
      <>
        <PageHeader title="Response templates" />
        <EmptyState
          title="No templates yet"
          description="Analyze questions first to generate templates."
          icon="💬"
          action={<Link href="/upload"><Button>Upload questions</Button></Link>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Response templates"
        description="Reusable, warm replies your support team can drop into WhatsApp or email."
        actions={
          <>
            <Button variant="outline" onClick={regenerate}>Regenerate</Button>
            <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
            <Button onClick={exportMd}>Export Markdown</Button>
          </>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{t.name}</CardTitle>
                  <CardDescription>{t.use_case}</CardDescription>
                </div>
                <Badge tone="sage">{t.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-ink-500 mb-1">
                    <span>WhatsApp version</span>
                    <button onClick={() => copy(t.whatsapp_version)} className="text-sage-600 hover:underline normal-case">Copy</button>
                  </div>
                  <div className="rounded-xl bg-sage-50 p-3 text-sm text-ink-900 whitespace-pre-line">{t.whatsapp_version}</div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-ink-500 mb-1">
                    <span>Email version</span>
                    <button onClick={() => copy(t.email_version)} className="text-sage-600 hover:underline normal-case">Copy</button>
                  </div>
                  <div className="rounded-xl bg-cream-100 p-3 text-sm text-ink-900 whitespace-pre-line">{t.email_version}</div>
                </div>
                <div className="text-xs text-ink-500"><span className="font-medium text-ink-700">Tone:</span> {t.tone_notes}</div>
                <div className="text-xs text-ink-500"><span className="font-medium text-ink-700">Escalation:</span> {t.escalation_rule}</div>
                {t.follow_up_message && (
                  <div className="text-xs text-ink-500"><span className="font-medium text-ink-700">Follow-up:</span> {t.follow_up_message}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
