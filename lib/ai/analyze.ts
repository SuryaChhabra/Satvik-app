import "server-only";
import OpenAI from "openai";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import { mockAnalyzeBatch } from "./mock";
import type { AggregatedInsights, AnalysisResult, AnalyzeResponse } from "../types";
import { uid } from "../utils";

interface AnalyzeInput {
  questions: { id: string; text: string; channel?: string; user_stage?: string }[];
  forceMock?: boolean;
}

export async function analyzeQuestions({ questions, forceMock }: AnalyzeInput): Promise<AnalyzeResponse> {
  const key = process.env.OPENAI_API_KEY;
  if (forceMock || !key) {
    const { results, insights } = mockAnalyzeBatch(questions);
    return { results, insights, source: "mock" };
  }

  try {
    const client = new OpenAI({ apiKey: key });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const completion = await client.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(questions) },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty completion");
    const parsed = JSON.parse(raw);

    const results: AnalysisResult[] = (parsed.results ?? []).map((r: Record<string, unknown>) => ({
      id: uid("a"),
      question_id: String(r.question_id ?? ""),
      question: String(r.question ?? ""),
      category: String(r.category ?? "Other"),
      intent: String(r.intent ?? ""),
      emotion: String(r.emotion ?? ""),
      user_stage: String(r.user_stage ?? "unknown"),
      sensitivity_level: (r.sensitivity_level as AnalysisResult["sensitivity_level"]) ?? "normal",
      bot_answerable: (r.bot_answerable as AnalysisResult["bot_answerable"]) ?? "partial",
      escalation_needed: Boolean(r.escalation_needed),
      gap_type: String(r.gap_type ?? "Content gap"),
      suggested_whatsapp_reply: String(r.suggested_whatsapp_reply ?? ""),
      suggested_email_reply: String(r.suggested_email_reply ?? ""),
      recommended_action: String(r.recommended_action ?? ""),
      confidence_score: Number(r.confidence_score ?? 0.7),
      channel: questions.find((q) => q.id === r.question_id)?.channel,
    }));

    const insights: AggregatedInsights = {
      top_categories: parsed.insights?.top_categories ?? [],
      repeated_themes: parsed.insights?.repeated_themes ?? [],
      faq_candidates: parsed.insights?.faq_candidates ?? [],
      detected_gaps: parsed.insights?.detected_gaps ?? [],
      content_ideas: parsed.insights?.content_ideas ?? [],
      website_recommendations: parsed.insights?.website_recommendations ?? [],
      bot_flow_recommendations: parsed.insights?.bot_flow_recommendations ?? [],
      weekly_summary: parsed.insights?.weekly_summary ?? "",
    };

    return { results, insights, source: "openai" };
  } catch (err) {
    console.error("OpenAI analyze failed, falling back to mock:", err);
    const { results, insights } = mockAnalyzeBatch(questions);
    return { results, insights, source: "mock" };
  }
}
