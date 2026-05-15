"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, sensitivityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import type { AnalysisResult } from "@/lib/types";
import { downloadFile, toCsv } from "@/lib/utils";

export default function ResultsPage() {
  const [data] = useStore();
  const { analyses } = data;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [gap, setGap] = useState("");
  const [sensitivity, setSensitivity] = useState("");
  const [escalation, setEscalation] = useState("");
  const [bot, setBot] = useState("");
  const [channel, setChannel] = useState("");
  const [stage, setStage] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered: AnalysisResult[] = useMemo(() => {
    return analyses.filter((a) => {
      if (search && !a.question.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && a.category !== category) return false;
      if (gap && a.gap_type !== gap) return false;
      if (sensitivity === "health" && a.sensitivity_level === "normal") return false;
      if (sensitivity === "normal" && a.sensitivity_level !== "normal") return false;
      if (escalation === "yes" && !a.escalation_needed) return false;
      if (escalation === "no" && a.escalation_needed) return false;
      if (bot && a.bot_answerable !== bot) return false;
      if (channel && a.channel !== channel) return false;
      if (stage && a.user_stage !== stage) return false;
      return true;
    });
  }, [analyses, search, category, gap, sensitivity, escalation, bot, channel, stage]);

  const categories = Array.from(new Set(analyses.map((a) => a.category)));
  const gaps = Array.from(new Set(analyses.map((a) => a.gap_type)));
  const channels = Array.from(new Set(analyses.map((a) => a.channel).filter(Boolean))) as string[];
  const stages = Array.from(new Set(analyses.map((a) => a.user_stage).filter(Boolean))) as string[];

  const exportCsv = () => {
    const rows = filtered.map((a) => ({
      question: a.question,
      category: a.category,
      intent: a.intent,
      emotion: a.emotion,
      user_stage: a.user_stage,
      sensitivity: a.sensitivity_level,
      bot_answerable: a.bot_answerable,
      escalation_needed: a.escalation_needed,
      gap_type: a.gap_type,
      whatsapp_reply: a.suggested_whatsapp_reply,
      email_reply: a.suggested_email_reply,
      recommended_action: a.recommended_action,
      confidence: a.confidence_score,
      channel: a.channel ?? "",
    }));
    downloadFile("satvic-analysis-results.csv", toCsv(rows), "text/csv");
  };

  if (!analyses.length) {
    return (
      <>
        <PageHeader title="Analysis results" />
        <EmptyState
          title="Nothing analyzed yet"
          description="Upload some questions to see warm, structured insight."
          icon="🌿"
          action={<Link href="/upload"><Button>Upload questions</Button></Link>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Analysis results"
        description={`Showing ${filtered.length} of ${analyses.length} questions.`}
        actions={
          <>
            <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
            <Link href="/upload"><Button>Add more</Button></Link>
          </>
        }
      />

      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3">
            <div className="col-span-2 md:col-span-2">
              <Label>Search</Label>
              <Input placeholder="Keyword in question…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>Gap type</Label>
              <Select value={gap} onChange={(e) => setGap(e.target.value)}>
                <option value="">All</option>
                {gaps.map((g) => <option key={g} value={g}>{g}</option>)}
              </Select>
            </div>
            <div>
              <Label>Sensitivity</Label>
              <Select value={sensitivity} onChange={(e) => setSensitivity(e.target.value)}>
                <option value="">All</option>
                <option value="health">Health-sensitive only</option>
                <option value="normal">Normal only</option>
              </Select>
            </div>
            <div>
              <Label>Escalation</Label>
              <Select value={escalation} onChange={(e) => setEscalation(e.target.value)}>
                <option value="">All</option>
                <option value="yes">Needed</option>
                <option value="no">Not needed</option>
              </Select>
            </div>
            <div>
              <Label>Bot-answerable</Label>
              <Select value={bot} onChange={(e) => setBot(e.target.value)}>
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="partial">Partial</option>
                <option value="no">No</option>
              </Select>
            </div>
            <div>
              <Label>Channel</Label>
              <Select value={channel} onChange={(e) => setChannel(e.target.value)}>
                <option value="">All</option>
                {channels.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>User stage</Label>
              <Select value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="">All</option>
                {stages.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((a) => (
          <Card key={a.id}>
            <CardContent>
              <div className="py-2">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge tone="sage">{a.category}</Badge>
                      <Badge tone={sensitivityTone(a.sensitivity_level)}>{a.sensitivity_level}</Badge>
                      {a.escalation_needed && <Badge tone="danger">Human review</Badge>}
                      <Badge tone="info">Bot: {a.bot_answerable}</Badge>
                      {a.channel && <Badge tone="neutral">#{a.channel}</Badge>}
                      <Badge tone="neutral">{a.user_stage}</Badge>
                    </div>
                    <div className="font-medium text-ink-900">{a.question}</div>
                    <div className="text-xs text-ink-500 mt-1">
                      Intent: <span className="text-ink-700">{a.intent}</span> · Emotion: <span className="text-ink-700">{a.emotion}</span> · Gap: <span className="text-ink-700">{a.gap_type}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  >
                    {expanded === a.id ? "Hide" : "Open"}
                  </Button>
                </div>

                {expanded === a.id && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-cream-100">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">WhatsApp reply</div>
                      <div className="rounded-xl bg-sage-50 p-3 text-sm text-ink-900 whitespace-pre-line">{a.suggested_whatsapp_reply}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Email reply</div>
                      <div className="rounded-xl bg-cream-100 p-3 text-sm text-ink-900 whitespace-pre-line">{a.suggested_email_reply}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Recommended action</div>
                      <div className="text-sm text-ink-900">{a.recommended_action}</div>
                      <div className="text-xs text-ink-500 mt-1">Confidence: {(a.confidence_score * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
