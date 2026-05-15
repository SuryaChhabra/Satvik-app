export type Sensitivity = "normal" | "health-sensitive" | "urgent" | "unknown";
export type BotAnswerable = "yes" | "no" | "partial";
export type Priority = "high" | "medium" | "low";

export const CATEGORIES = [
  "Beginner confusion",
  "Health-sensitive doubts",
  "Product/program clarity",
  "Recipe/lifestyle implementation",
  "Trust/credibility",
  "Pricing/payment",
  "Order/access support",
  "Retention/consistency",
  "Seasonal wellness",
  "Family adaptation",
  "Content gap",
  "Technical/app support",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const GAP_TYPES = [
  "FAQ gap",
  "Website copy gap",
  "Product/program clarity gap",
  "Trust/reassurance gap",
  "Health/safety communication gap",
  "Onboarding gap",
  "Retention gap",
  "Content gap",
  "Seasonal content gap",
  "Pricing/value gap",
  "Post-purchase support gap",
  "Bot flow gap",
] as const;
export type GapType = (typeof GAP_TYPES)[number];

export interface Question {
  id: string;
  raw_text: string;
  channel?: string;
  date?: string;
  product?: string;
  user_stage?: string;
  current_reply?: string;
  created_at: string;
}

export interface AnalysisResult {
  id: string;
  question_id: string;
  question: string;
  category: Category | string;
  intent: string;
  emotion: string;
  user_stage: string;
  sensitivity_level: Sensitivity;
  bot_answerable: BotAnswerable;
  escalation_needed: boolean;
  gap_type: GapType | string;
  suggested_whatsapp_reply: string;
  suggested_email_reply: string;
  recommended_action: string;
  confidence_score: number;
  channel?: string;
}

export interface FAQ {
  id: string;
  question: string;
  short_answer: string;
  detailed_answer: string;
  placement: string[]; // website-home | product-page | program-page | checkout | app-onboarding | whatsapp-bot | email-support
  sensitivity: "normal" | "health-sensitive" | "needs-disclaimer" | "human-review";
  disclaimer_needed: boolean;
  status: "suggested" | "approved" | "rejected";
  source_question_ids: string[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  use_case: string;
  whatsapp_version: string;
  email_version: string;
  tone_notes: string;
  escalation_rule: string;
  follow_up_message?: string;
  related_faq_id?: string;
}

export interface Gap {
  id: string;
  title: string;
  gap_type: GapType | string;
  evidence: string[];
  why_it_matters: string;
  recommended_action: string;
  priority: Priority;
  owner: "support" | "growth" | "content" | "product" | "website";
  suggested_output: string[];
  source_question_ids: string[];
}

export interface BotFlowStep {
  speaker: "bot" | "user";
  text: string;
  options?: string[];
  escalation?: boolean;
  linked_faq_id?: string;
}

export interface BotFlow {
  id: string;
  title: string;
  trigger_category: string;
  opening_message: string;
  steps: BotFlowStep[];
  escalation_rules: string[];
  final_cta: string;
}

export interface InsightReport {
  id: string;
  date_range: string;
  summary: string;
  top_themes: string[];
  top_hesitations: string[];
  gaps: string[];
  faq_recommendations: string[];
  content_ideas: string[];
  website_recommendations: string[];
  support_workflow: string[];
  bot_improvements: string[];
  experiments: string[];
  metrics: { label: string; value: string }[];
}

export interface AggregatedInsights {
  top_categories: { category: string; count: number }[];
  repeated_themes: string[];
  faq_candidates: string[];
  detected_gaps: string[];
  content_ideas: string[];
  website_recommendations: string[];
  bot_flow_recommendations: string[];
  weekly_summary: string;
}

export interface AnalyzeResponse {
  results: AnalysisResult[];
  insights: AggregatedInsights;
  source: "openai" | "mock";
}

export interface BrandSettings {
  tone_traits: string[];
  ai_model: string;
  health_disclaimer: string;
  safety_rules: string[];
  categories: string[];
  use_mock: boolean;
}
