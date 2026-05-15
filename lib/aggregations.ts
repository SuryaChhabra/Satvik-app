import type { AnalysisResult, BotFlow, FAQ, Gap, InsightReport, Template } from "./types";
import { uid } from "./utils";

export function generateFaqsFromAnalyses(analyses: AnalysisResult[]): FAQ[] {
  const byQuestion = new Map<string, AnalysisResult[]>();
  for (const a of analyses) {
    const key = a.question.trim().toLowerCase();
    if (!byQuestion.has(key)) byQuestion.set(key, []);
    byQuestion.get(key)!.push(a);
  }

  const faqs: FAQ[] = [];
  byQuestion.forEach((group) => {
    const sample = group[0];
    if (sample.bot_answerable === "no") return;
    const placement: string[] = [];
    if (sample.category === "Pricing/payment") placement.push("checkout", "website-home");
    else if (sample.category === "Product/program clarity") placement.push("product-page", "program-page");
    else if (sample.category === "Beginner confusion") placement.push("website-home", "app-onboarding");
    else if (sample.category === "Order/access support") placement.push("email-support", "whatsapp-bot");
    else if (sample.category === "Health-sensitive doubts") placement.push("program-page");
    else placement.push("website-home");

    const sensitivity: FAQ["sensitivity"] =
      sample.sensitivity_level === "urgent"
        ? "human-review"
        : sample.sensitivity_level === "health-sensitive"
        ? "needs-disclaimer"
        : "normal";

    faqs.push({
      id: uid("faq"),
      question: sample.question,
      short_answer: sample.suggested_whatsapp_reply,
      detailed_answer: sample.suggested_email_reply,
      placement,
      sensitivity,
      disclaimer_needed: sensitivity !== "normal",
      status: "suggested",
      source_question_ids: group.map((g) => g.question_id),
    });
  });
  return faqs.slice(0, 30);
}

export function generateTemplatesFromAnalyses(analyses: AnalysisResult[]): Template[] {
  const categories = new Set(analyses.map((a) => a.category));
  const templates: Template[] = [];
  categories.forEach((cat) => {
    const samples = analyses.filter((a) => a.category === cat);
    if (!samples.length) return;
    const sample = samples[0];
    templates.push({
      id: uid("tpl"),
      name: `${cat} — gentle reply`,
      category: String(cat),
      use_case: `Reply when a user shows ${sample.intent.toLowerCase()} (${samples.length} similar question${samples.length > 1 ? "s" : ""}).`,
      whatsapp_version: sample.suggested_whatsapp_reply,
      email_version: sample.suggested_email_reply,
      tone_notes: "Warm, simple, reassuring. Avoid claims. Offer the next small step.",
      escalation_rule:
        sample.escalation_needed || sample.sensitivity_level !== "normal"
          ? "Escalate to human reviewer if user mentions pregnancy, medication, severe symptoms, or refund conflicts."
          : "Bot-answerable. No escalation by default.",
      follow_up_message: "If no reply in 48 hours: 'Just checking in 🌿 anything we can help with?'",
    });
  });
  return templates;
}

export function detectGapsFromAnalyses(analyses: AnalysisResult[]): Gap[] {
  const byGap = new Map<string, AnalysisResult[]>();
  for (const a of analyses) {
    const key = a.gap_type;
    if (!byGap.has(key)) byGap.set(key, []);
    byGap.get(key)!.push(a);
  }

  const gaps: Gap[] = [];
  byGap.forEach((group, gapType) => {
    const evidence = group.slice(0, 5).map((g) => g.question);
    const priority: Gap["priority"] = group.length >= 4 ? "high" : group.length >= 2 ? "medium" : "low";
    const owner: Gap["owner"] = gapType.includes("Website")
      ? "website"
      : gapType.includes("Onboarding") || gapType.includes("Retention")
      ? "product"
      : gapType.includes("Health")
      ? "support"
      : gapType.includes("Pricing") || gapType.includes("Trust")
      ? "growth"
      : "content";

    const outputs: string[] = [];
    if (group.some((g) => g.bot_answerable !== "no")) outputs.push("FAQ", "WhatsApp template");
    if (gapType.includes("Website")) outputs.push("Landing page section");
    if (gapType.includes("Content") || gapType.includes("Seasonal")) outputs.push("Reel/blog idea");
    if (gapType.includes("Onboarding")) outputs.push("App onboarding update");
    if (gapType.includes("Bot")) outputs.push("Chatbot flow");

    gaps.push({
      id: uid("gap"),
      title: `${gapType} — ${group.length} related question${group.length > 1 ? "s" : ""}`,
      gap_type: gapType,
      evidence,
      why_it_matters: `Multiple users have raised this concern. Closing this gap reduces support load and builds trust.`,
      recommended_action: group[0].recommended_action,
      priority,
      owner,
      suggested_output: Array.from(new Set(outputs)),
      source_question_ids: group.map((g) => g.question_id),
    });
  });
  return gaps.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

function priorityRank(p: Gap["priority"]) {
  return p === "high" ? 0 : p === "medium" ? 1 : 2;
}

export function generateBotFlows(analyses: AnalysisResult[]): BotFlow[] {
  const flows: BotFlow[] = [];

  flows.push({
    id: uid("flow"),
    title: "Main menu",
    trigger_category: "Entry point",
    opening_message: "Namaste 🌿 Welcome to Satvic Movement. What can we help you with today?",
    steps: [
      {
        speaker: "bot",
        text: "Pick one to get started:",
        options: [
          "🌱 I'm new to Satvic",
          "🌸 I have a health-related question",
          "📘 I want to know about a program/product",
          "🛒 I need help with my order/access",
          "🍲 I want recipe/lifestyle guidance",
          "👋 I want to speak to a human",
        ],
      },
    ],
    escalation_rules: ["If 'speak to human' or no match after 2 turns → route to support."],
    final_cta: "Reply with the option number, or type 'human' anytime to reach our team.",
  });

  flows.push({
    id: uid("flow"),
    title: "Beginner flow",
    trigger_category: "Beginner confusion",
    opening_message: "Welcome 🌱 Starting Satvic is easier than it looks — one small habit at a time.",
    steps: [
      { speaker: "bot", text: "How much time can you give daily?", options: ["5 minutes", "10–15 minutes", "I'm flexible"] },
      {
        speaker: "bot",
        text: "Beautiful. Begin tomorrow with one glass of warm water 🌿. Want the free 3-Day Gentle Start?",
        options: ["Yes, send it", "Maybe later"],
      },
    ],
    escalation_rules: ["If user types 'human' or 'call me' → escalate."],
    final_cta: "Tap 'Yes, send it' to receive the free 3-Day Gentle Start.",
  });

  flows.push({
    id: uid("flow"),
    title: "Health-sensitive flow (general guidance only)",
    trigger_category: "Health-sensitive doubts",
    opening_message:
      "Thank you for sharing 🙏 We can offer general Satvic lifestyle guidance — not medical advice. For your safety, please also consult your doctor.",
    steps: [
      {
        speaker: "bot",
        text: "Which area is your question about?",
        options: ["Digestion / acidity", "Weight balance", "Thyroid", "Pregnancy", "On medication", "Other"],
      },
      {
        speaker: "bot",
        text: "Got it. A team member will share gentle lifestyle notes shortly. For anything urgent, please consult your doctor.",
        escalation: true,
      },
    ],
    escalation_rules: [
      "Always escalate pregnancy, medication, urgent symptoms, eating disorders, mental health.",
      "Never give specific medical advice.",
    ],
    final_cta: "Our team will follow up within 24 hours with gentle, doctor-friendly notes.",
  });

  flows.push({
    id: uid("flow"),
    title: "Order / access flow",
    trigger_category: "Order/access support",
    opening_message: "So sorry for the trouble 🙏 Let's get this sorted.",
    steps: [
      { speaker: "bot", text: "Could you share your purchase email or order ID?" },
      { speaker: "bot", text: "Thanks. A team member will resolve this within 4 hours.", escalation: true },
    ],
    escalation_rules: ["Always escalate refunds and payment disputes."],
    final_cta: "We'll email you a confirmation once access is restored.",
  });

  flows.push({
    id: uid("flow"),
    title: "Recipe & lifestyle flow",
    trigger_category: "Recipe/lifestyle implementation",
    opening_message: "Lovely 🌿 What would you like ideas for?",
    steps: [
      {
        speaker: "bot",
        text: "Pick one:",
        options: ["Breakfast", "Light dinner", "Summer cooler", "Tiffin for family", "Surprise me"],
      },
      { speaker: "bot", text: "Here are 3 simple Satvic options to try this week 🌱" },
    ],
    escalation_rules: ["Escalate if user asks for health-condition-specific recipes."],
    final_cta: "Want a 7-day meal plan? Reply 'yes'.",
  });

  // Add count-aware annotations
  flows.forEach((f) => {
    const count = analyses.filter((a) => a.category === f.trigger_category).length;
    if (count > 0) f.title = `${f.title} (${count} matching question${count > 1 ? "s" : ""})`;
  });

  return flows;
}

export function generateWeeklyReport(
  analyses: AnalysisResult[],
  gaps: Gap[],
  faqs: FAQ[],
  insights: { content_ideas?: string[]; website_recommendations?: string[]; bot_flow_recommendations?: string[]; weekly_summary?: string } | null,
): InsightReport {
  const categoryCount = new Map<string, number>();
  const emotionCount = new Map<string, number>();
  for (const a of analyses) {
    categoryCount.set(a.category, (categoryCount.get(a.category) ?? 0) + 1);
    emotionCount.set(a.emotion, (emotionCount.get(a.emotion) ?? 0) + 1);
  }
  const topThemes = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, v]) => `${k} — ${v} questions`);
  const topHesitations = Array.from(emotionCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, v]) => `${k} (${v})`);
  const topGaps = gaps.slice(0, 5).map((g) => `${g.title} [${g.priority}]`);

  const health = analyses.filter((a) => a.sensitivity_level !== "normal").length;
  const escalations = analyses.filter((a) => a.escalation_needed).length;
  const botPct = analyses.length
    ? Math.round((analyses.filter((a) => a.bot_answerable !== "no").length / analyses.length) * 100)
    : 0;

  return {
    id: uid("report"),
    date_range: `Week ending ${new Date().toLocaleDateString()}`,
    summary:
      insights?.weekly_summary ??
      `Analyzed ${analyses.length} questions. ${health} health-sensitive cases, ${escalations} flagged for human review. ${botPct}% of questions are bot-answerable.`,
    top_themes: topThemes,
    top_hesitations: topHesitations,
    gaps: topGaps,
    faq_recommendations: faqs.slice(0, 8).map((f) => f.question),
    content_ideas: insights?.content_ideas ?? [],
    website_recommendations: insights?.website_recommendations ?? [],
    support_workflow: [
      "Auto-route refund + access issues to a single inbox.",
      "Use the health-sensitive template for any pregnancy/medication mention.",
      "Send weekly recap of FAQs to the content team.",
    ],
    bot_improvements: insights?.bot_flow_recommendations ?? [],
    experiments: [
      "A/B test: 'Start with one warm water habit' homepage banner.",
      "Try a 3-day Gentle Start opt-in popup on first 10s of homepage.",
      "Pilot WhatsApp 'Quiet Returner' flow for users inactive 14+ days.",
    ],
    metrics: [
      { label: "Total analyzed", value: String(analyses.length) },
      { label: "Health-sensitive", value: String(health) },
      { label: "Escalations needed", value: String(escalations) },
      { label: "Bot-answerable", value: `${botPct}%` },
      { label: "FAQ candidates", value: String(faqs.length) },
      { label: "Gaps detected", value: String(gaps.length) },
    ],
  };
}
