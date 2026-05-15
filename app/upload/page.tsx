"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { parseCsv, uid } from "@/lib/utils";
import { SAMPLE_QUESTIONS_TEXT } from "@/lib/sample-data";
import type { Question } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();
  const [, actions] = useStore();
  const [text, setText] = useState("");
  const [channel, setChannel] = useState("");
  const [product, setProduct] = useState("");
  const [stage, setStage] = useState("");
  const [forceMock, setForceMock] = useState(false);
  const [csvRows, setCsvRows] = useState<Record<string, string>[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const raw = await file.text();
    const rows = parseCsv(raw).filter((r) => (r.question ?? "").trim().length > 0);
    setCsvRows(rows);
  };

  const onUseSample = () => setText(SAMPLE_QUESTIONS_TEXT.join("\n"));

  const onAnalyze = async () => {
    setError(null);
    const pasted = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map<Question>((q) => ({
        id: uid("q"),
        raw_text: q,
        channel: channel || undefined,
        product: product || undefined,
        user_stage: stage || undefined,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }));

    const csv = csvRows.map<Question>((r) => ({
      id: uid("q"),
      raw_text: r.question,
      channel: r.channel || channel || undefined,
      product: r.product || product || undefined,
      user_stage: r.user_stage || stage || undefined,
      date: r.date || new Date().toISOString(),
      current_reply: r.current_reply || undefined,
      created_at: new Date().toISOString(),
    }));

    const newQuestions = [...pasted, ...csv];
    if (!newQuestions.length) {
      setError("Please paste some questions or upload a CSV.");
      return;
    }

    setRunning(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: newQuestions.map((q) => ({
            id: q.id,
            text: q.raw_text,
            channel: q.channel,
            user_stage: q.user_stage,
          })),
          forceMock,
        }),
      });
      if (!res.ok) throw new Error("Analysis failed.");
      const data = await res.json();

      actions.addQuestions(newQuestions);
      actions.appendAnalyses(data.results);
      actions.setInsights(data.insights);
      actions.addRun({
        id: uid("run"),
        ran_at: new Date().toISOString(),
        total_questions: newQuestions.length,
        source: data.source,
      });
      router.push("/results");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Upload questions"
        description="Paste questions from WhatsApp/email/Instagram/website or upload a CSV. We'll analyze them gently in one batch."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paste questions</CardTitle>
            <CardDescription>One question per line. Optional context applies to all.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label>Questions</Label>
            <Textarea
              rows={12}
              placeholder={"I'm new to Satvic. Where should I start?\nIs the 21-day plan beginner-friendly?\nCan I do this if I have acidity?"}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <Label>Channel</Label>
                <Select value={channel} onChange={(e) => setChannel(e.target.value)}>
                  <option value="">Any</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="instagram">Instagram</option>
                  <option value="website">Website</option>
                  <option value="quiz">Quiz</option>
                </Select>
              </div>
              <div>
                <Label>Product / Program</Label>
                <Input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. 21-Day Reset" />
              </div>
              <div>
                <Label>User stage</Label>
                <Select value={stage} onChange={(e) => setStage(e.target.value)}>
                  <option value="">Unknown</option>
                  <option value="awareness">Awareness</option>
                  <option value="considering">Considering</option>
                  <option value="new_user">New user</option>
                  <option value="active">Active</option>
                  <option value="lapsed">Lapsed</option>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={onUseSample}>Use 25 sample questions</Button>
              <Badge tone="sage">{text.split("\n").filter((l) => l.trim()).length} lines</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload CSV</CardTitle>
            <CardDescription>
              Columns: <code className="text-xs">question</code> (required), <code className="text-xs">channel</code>, <code className="text-xs">date</code>, <code className="text-xs">product</code>, <code className="text-xs">user_stage</code>, <code className="text-xs">current_reply</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept=".csv"
              onChange={onPickFile}
              className="block w-full text-sm text-ink-700 file:mr-3 file:rounded-xl file:border-0 file:bg-sage-100 file:px-4 file:py-2 file:text-sage-700 file:cursor-pointer"
            />
            {csvRows.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-ink-700 mb-2">
                  <Badge tone="sage">{csvRows.length} rows parsed</Badge>
                </div>
                <div className="rounded-xl border border-cream-200 overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-cream-100 text-ink-500">
                      <tr>
                        {Object.keys(csvRows[0]).map((h) => (
                          <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvRows.slice(0, 8).map((r, i) => (
                        <tr key={i} className="border-t border-cream-100">
                          {Object.values(r).map((v, j) => (
                            <td key={j} className="px-3 py-2 text-ink-700">{String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="mt-6 rounded-xl bg-cream-100 p-4 text-xs text-ink-500">
              No file? You can paste questions on the left and still run the analysis.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-3">
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" checked={forceMock} onChange={(e) => setForceMock(e.target.checked)} />
              Force mock mode (don't call the AI even if a key is set)
            </label>
            <div className="flex items-center gap-3">
              {error && <span className="text-sm text-clay-500">{error}</span>}
              <Button onClick={onAnalyze} disabled={running}>
                {running ? "Analyzing gently…" : "Analyze Questions"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
