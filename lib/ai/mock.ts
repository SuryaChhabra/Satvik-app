import type { AggregatedInsights, AnalysisResult, BotAnswerable, Category, GapType, Sensitivity } from "../types";
import { uid } from "../utils";

const HEALTH_KEYWORDS = [
  "pregnan",
  "medicat",
  "medicine",
  "thyroid",
  "diabet",
  "blood pressure",
  "bp",
  "acidity",
  "ulcer",
  "cancer",
  "depress",
  "anxiety",
  "mental",
  "eating disorder",
  "anorex",
  "bulim",
  "kidney",
  "liver",
];
const URGENT_KEYWORDS = ["pregnan", "emergency", "urgent", "hospital", "bleeding", "chest pain"];
const ACCESS_KEYWORDS = ["refund", "access", "login", "can't open", "cant access", "payment", "didn't receive", "order"];
const SEASONAL_KEYWORDS = ["summer", "winter", "monsoon", "rainy", "diwali", "navratri", "holi", "festival"];
const FAMILY_KEYWORDS = ["family", "kid", "children", "husband", "wife", "parents"];
const BEGINNER_KEYWORDS = ["new", "start", "begin", "confused", "overwhelm", "where do i", "where should i"];
const TIME_KEYWORDS = ["time", "busy", "full-time", "working", "schedule"];
const TRUST_KEYWORDS = ["different", "science", "ayurveda", "research", "proof", "trust", "talk to"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function mockAnalyze(q: { id: string; text: string; user_stage?: string; channel?: string }): AnalysisResult {
  const text = q.text.toLowerCase();

  let category: Category = "Other";
  let gap: GapType = "Content gap";
  let intent = "General enquiry";
  let emotion = "Curious";
  let sensitivity: Sensitivity = "normal";
  let bot: BotAnswerable = "partial";
  let escalation = false;

  if (HEALTH_KEYWORDS.some((k) => text.includes(k))) {
    category = "Health-sensitive doubts";
    gap = "Health/safety communication gap";
    sensitivity = URGENT_KEYWORDS.some((k) => text.includes(k)) ? "urgent" : "health-sensitive";
    bot = sensitivity === "urgent" ? "no" : "partial";
    escalation = true;
    intent = "Check suitability for a health condition";
    emotion = "Worried, cautious";
  } else if (ACCESS_KEYWORDS.some((k) => text.includes(k))) {
    category = text.includes("refund") || text.includes("payment") ? "Pricing/payment" : "Order/access support";
    gap = text.includes("refund") ? "Website copy gap" : "Post-purchase support gap";
    intent = "Resolve account or payment issue";
    emotion = "Frustrated";
    escalation = true;
    bot = "partial";
  } else if (BEGINNER_KEYWORDS.some((k) => text.includes(k))) {
    category = "Beginner confusion";
    gap = "Onboarding gap";
    intent = "Find a starting point";
    emotion = "Overwhelmed";
    bot = "yes";
  } else if (SEASONAL_KEYWORDS.some((k) => text.includes(k))) {
    category = "Seasonal wellness";
    gap = "Seasonal content gap";
    intent = "Seasonal eating";
    emotion = "Curious";
    bot = "yes";
  } else if (FAMILY_KEYWORDS.some((k) => text.includes(k))) {
    category = "Family adaptation";
    gap = "Content gap";
    intent = "Adapt program for family";
    emotion = "Hopeful";
    bot = "yes";
  } else if (TIME_KEYWORDS.some((k) => text.includes(k))) {
    category = "Product/program clarity";
    gap = "Trust/reassurance gap";
    intent = "Fit program into busy life";
    emotion = "Skeptical";
    bot = "yes";
  } else if (TRUST_KEYWORDS.some((k) => text.includes(k))) {
    category = "Trust/credibility";
    gap = "Trust/reassurance gap";
    intent = "Verify credibility";
    emotion = "Skeptical";
    bot = "yes";
  } else if (text.includes("recipe") || text.includes("cook") || text.includes("eat") || text.includes("ingredient")) {
    category = "Recipe/lifestyle implementation";
    gap = "Content gap";
    intent = "Daily implementation help";
    emotion = "Decision-fatigued";
    bot = "yes";
  } else if (text.includes("can't continue") || text.includes("couldn't continue") || text.includes("dropped")) {
    category = "Retention/consistency";
    gap = "Retention gap";
    intent = "Restart support";
    emotion = "Guilty, discouraged";
    bot = "yes";
  }

  const whatsapp =
    sensitivity === "urgent"
      ? "Thank you for sharing 🙏 This is a special situation that needs personal medical guidance — please consult your doctor. A team member will reach out shortly."
      : sensitivity === "health-sensitive"
      ? "Many in our community find these gentle Satvic habits supportive 🌿 This is general lifestyle guidance, not medical advice — please consult a qualified doctor for your specific case. Would you like a gentle starter plan?"
      : category === "Beginner confusion"
      ? "Welcome 🌱 The easiest first step is one small habit — a glass of warm water tomorrow morning. Want our free 3-Day Gentle Start?"
      : category === "Order/access support"
      ? "So sorry for the trouble 🙏 Could you share your purchase email or order ID? We'll fix this within a few hours."
      : category === "Seasonal wellness"
      ? "Yes 🌞 We have seasonal recipes ready for this time of year. Want a 3-recipe starter?"
      : category === "Family adaptation"
      ? "Absolutely 🌿 Satvic works beautifully as a family practice. Want our family-friendly starter plan?"
      : "Thanks for writing in 🌿 Here's a gentle suggestion to begin with. Want me to share the link?";

  const email =
    sensitivity === "urgent"
      ? `Hi,\n\nThank you for reaching out. This is a situation that needs personal medical guidance, so please consult your doctor before any change. A team member will reach out shortly with gentle, doctor-cleared lifestyle ideas.\n\nWarmly,\nTeam Satvic`
      : `Hi,\n\nThank you for reaching out. ${
          sensitivity === "health-sensitive"
            ? "Many community members find Satvic lifestyle practices supportive, but this is general guidance, not medical advice — please check with a qualified doctor for your specific situation."
            : "We'd be glad to guide you with a gentle, beginner-friendly starting point."
        }\n\nWarmly,\nTeam Satvic`;

  const action =
    category === "Beginner confusion"
      ? "Send 3-Day Gentle Start; add to onboarding sequence."
      : category === "Health-sensitive doubts"
      ? "Route to human reviewer; add condition-specific FAQ with disclaimer."
      : category === "Order/access support"
      ? "Resolve access issue; add post-purchase auto-flow."
      : category === "Retention/consistency"
      ? "Trigger 'Quiet Returner' re-engagement; offer 1-Day Soft Return."
      : category === "Seasonal wellness"
      ? "Highlight seasonal recipe collection on homepage."
      : "Add to FAQ and content backlog.";

  return {
    id: uid("a"),
    question_id: q.id,
    question: q.text,
    category,
    intent,
    emotion,
    user_stage: q.user_stage ?? "considering",
    sensitivity_level: sensitivity,
    bot_answerable: bot,
    escalation_needed: escalation,
    gap_type: gap,
    suggested_whatsapp_reply: whatsapp,
    suggested_email_reply: email,
    recommended_action: action,
    confidence_score: 0.7 + ((q.text.length % 25) / 100),
    channel: q.channel,
  };
}

export function mockAnalyzeBatch(input: { id: string; text: string; user_stage?: string; channel?: string }[]): {
  results: AnalysisResult[];
  insights: AggregatedInsights;
} {
  const results = input.map(mockAnalyze);

  const counts = new Map<string, number>();
  for (const r of results) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  const top_categories = Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const themes = new Set<string>();
  results.forEach((r) => themes.add(r.intent));

  const faq_candidates = Array.from(
    new Set(
      results
        .filter((r) => r.bot_answerable !== "no")
        .map((r) => r.question.replace(/\?$/, "") + "?"),
    ),
  ).slice(0, 8);

  const detected_gaps = Array.from(new Set(results.map((r) => `${r.gap_type}: ${r.category}`))).slice(0, 8);

  const content_ideas = [
    "Reel: 'Feeling overwhelmed? Begin Satvic with one glass of water.'",
    "Blog: 'Living with mild acidity — gentle Satvic habits' (with doctor disclaimer).",
    "Carousel: 'How busy professionals fit Satvic into 15 minutes a day.'",
    "Video: 'Why Satvic isn't a diet.'",
    "Family series: 'When your family eats differently.'",
  ];

  const website_recommendations = [
    "Homepage hero: 'Start with one small step' CTA + free 3-day starter.",
    "Program page: add 'Beginner-friendly' badge + 15-min/day note.",
    "Add 'Pregnancy, medication, conditions' disclaimer block.",
    "Surface refund policy clearly on checkout.",
    "Add international availability info to product pages.",
  ];

  const bot_flow_recommendations = [
    "Main menu with 'I'm new to Satvic / Health question / Program info / Order help / Recipes / Talk to human'.",
    "Health flow that gives general lifestyle guidance + disclaimer + escalation.",
    "Order/access flow that asks for order ID and routes to human within 4 hours.",
  ];

  const weekly_summary =
    "Beginner overwhelm and health-sensitive suitability questions dominate this week. Several users asked about working full-time and family adaptation. Health questions need a consistent disclaimer + escalation path; beginner journeys need a clearer 'one tiny step' on-ramp.";

  return {
    results,
    insights: {
      top_categories,
      repeated_themes: Array.from(themes).slice(0, 8),
      faq_candidates,
      detected_gaps,
      content_ideas,
      website_recommendations,
      bot_flow_recommendations,
      weekly_summary,
    },
  };
}
