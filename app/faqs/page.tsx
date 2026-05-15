"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, sensitivityTone } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import { generateFaqsFromAnalyses } from "@/lib/aggregations";
import type { FAQ } from "@/lib/types";
import { downloadFile, toCsv } from "@/lib/utils";

const PLACEMENTS = [
  "website-home",
  "product-page",
  "program-page",
  "checkout",
  "app-onboarding",
  "whatsapp-bot",
  "email-support",
];

export default function FaqsPage() {
  const [data, actions] = useStore();
  const { analyses, faqs } = data;
  const [editing, setEditing] = useState<string | null>(null);

  // Auto-seed FAQ candidates the first time the user visits this page.
  useEffect(() => {
    if (!faqs.length && analyses.length) {
      actions.saveFaqs(generateFaqsFromAnalyses(analyses));
    }
  }, [analyses, faqs.length, actions]);

  const regenerate = () => actions.saveFaqs(generateFaqsFromAnalyses(analyses));
  const stats = useMemo(() => ({
    suggested: faqs.filter((f) => f.status === "suggested").length,
    approved: faqs.filter((f) => f.status === "approved").length,
    rejected: faqs.filter((f) => f.status === "rejected").length,
  }), [faqs]);

  const setStatus = (f: FAQ, status: FAQ["status"]) => actions.upsertFaq({ ...f, status });
  const updateFaq = (f: FAQ, patch: Partial<FAQ>) => actions.upsertFaq({ ...f, ...patch });
  const togglePlacement = (f: FAQ, place: string) =>
    actions.upsertFaq({
      ...f,
      placement: f.placement.includes(place) ? f.placement.filter((p) => p !== place) : [...f.placement, place],
    });

  const exportCsv = () => {
    const rows = faqs.map((f) => ({
      question: f.question,
      short_answer: f.short_answer,
      detailed_answer: f.detailed_answer,
      placement: f.placement.join("; "),
      sensitivity: f.sensitivity,
      disclaimer_needed: f.disclaimer_needed,
      status: f.status,
    }));
    downloadFile("satvic-faqs.csv", toCsv(rows), "text/csv");
  };

  const exportMd = () => {
    const md = faqs
      .map(
        (f) =>
          `## ${f.question}\n\n**Short:** ${f.short_answer}\n\n**Detailed:**\n${f.detailed_answer}\n\n_Placement: ${f.placement.join(", ")} · Sensitivity: ${f.sensitivity} · Status: ${f.status}_\n`,
      )
      .join("\n---\n\n");
    downloadFile("satvic-faqs.md", md, "text/markdown");
  };

  if (!analyses.length) {
    return (
      <>
        <PageHeader title="FAQ generator" />
        <EmptyState
          title="No analyses yet"
          description="Analyze some questions first to generate FAQ candidates."
          icon="❓"
          action={<Link href="/upload"><Button>Upload questions</Button></Link>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="FAQ generator"
        description="Suggested FAQs drawn from your real user questions. Approve, edit, or reject — then export."
        actions={
          <>
            <Button variant="outline" onClick={regenerate}>Regenerate from analyses</Button>
            <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
            <Button onClick={exportMd}>Export Markdown</Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-3 mb-6 text-sm text-ink-500">
        <Badge tone="info">{faqs.length} total</Badge>
        <Badge tone="sage">{stats.approved} approved</Badge>
        <Badge tone="neutral">{stats.suggested} suggested</Badge>
        <Badge tone="danger">{stats.rejected} rejected</Badge>
      </div>

      <div className="space-y-4">
        {faqs.map((f) => {
          const isEditing = editing === f.id;
          return (
            <Card key={f.id}>
              <CardContent>
                <div className="py-3">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge tone={f.status === "approved" ? "sage" : f.status === "rejected" ? "danger" : "neutral"}>
                      {f.status}
                    </Badge>
                    <Badge tone={sensitivityTone(f.sensitivity)}>{f.sensitivity}</Badge>
                    {f.disclaimer_needed && <Badge tone="warn">Disclaimer required</Badge>}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label>Question</Label>
                        <Input value={f.question} onChange={(e) => updateFaq(f, { question: e.target.value })} />
                      </div>
                      <div>
                        <Label>Short answer (WhatsApp)</Label>
                        <Textarea rows={3} value={f.short_answer} onChange={(e) => updateFaq(f, { short_answer: e.target.value })} />
                      </div>
                      <div>
                        <Label>Detailed answer (Email / FAQ page)</Label>
                        <Textarea rows={5} value={f.detailed_answer} onChange={(e) => updateFaq(f, { detailed_answer: e.target.value })} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-medium text-ink-900">{f.question}</div>
                      <div className="text-sm text-ink-700 mt-2 whitespace-pre-line"><span className="text-ink-500 text-xs uppercase tracking-wide mr-2">Short</span>{f.short_answer}</div>
                      <div className="text-sm text-ink-700 mt-2 whitespace-pre-line"><span className="text-ink-500 text-xs uppercase tracking-wide mr-2">Detailed</span>{f.detailed_answer}</div>
                    </>
                  )}

                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Placement</div>
                    <div className="flex flex-wrap gap-2">
                      {PLACEMENTS.map((p) => {
                        const on = f.placement.includes(p);
                        return (
                          <button
                            key={p}
                            onClick={() => togglePlacement(f, p)}
                            className={`text-xs rounded-full px-2.5 py-1 border ${on ? "bg-sage-100 border-sage-200 text-sage-700" : "border-cream-200 text-ink-500 bg-white"}`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant={f.status === "approved" ? "primary" : "outline"} onClick={() => setStatus(f, "approved")}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(isEditing ? null : f.id)}>{isEditing ? "Done" : "Edit"}</Button>
                    <Button size="sm" variant="ghost" onClick={() => setStatus(f, "rejected")}>Reject</Button>
                    <Button size="sm" variant="ghost" onClick={() => actions.deleteFaq(f.id)}>Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
