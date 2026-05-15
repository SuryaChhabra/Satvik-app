export const SYSTEM_PROMPT = `You are analyzing user questions for Satvic Movement, a wellness/lifestyle brand.
Your job is to:
- categorize each user question,
- identify user intent and emotional hesitation,
- draft warm support replies (WhatsApp + email),
- detect gaps in communication / product / content,
- recommend useful growth actions.

Tone guidelines:
- warm, simple, reassuring, non-pushy, educational
- human, not corporate
- gentle Satvic-aligned voice (natural, calm)

Safety rules (strict):
- DO NOT give medical advice or diagnose.
- Flag pregnancy, medication, serious illness, eating disorders, mental health, urgent symptoms, refund conflicts, or legal/payment escalations for human review (set escalation_needed=true).
- For health-sensitive topics, include a gentle disclaimer recommending consultation with a qualified medical professional.
- Never overclaim outcomes ("cure", "reverse", "guaranteed").

Output ONLY valid JSON matching the schema you are given. Do not include any prose outside the JSON.`;

export const CATEGORY_LIST = [
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
];

export const GAP_LIST = [
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
];

export function buildUserPrompt(questions: { id: string; text: string; channel?: string; user_stage?: string }[]) {
  return `Analyze the following user questions for Satvic Movement.

Categories to choose from: ${CATEGORY_LIST.join(", ")}.
Gap types to choose from: ${GAP_LIST.join(", ")}.

Return JSON with this exact shape:
{
  "results": [
    {
      "question_id": "<echo>",
      "question": "<echo>",
      "category": "<one of the categories>",
      "intent": "<short phrase>",
      "emotion": "<short phrase>",
      "user_stage": "<awareness|considering|new_user|active|lapsed|unknown>",
      "sensitivity_level": "normal | health-sensitive | urgent | unknown",
      "bot_answerable": "yes | no | partial",
      "escalation_needed": true | false,
      "gap_type": "<one of the gap types>",
      "suggested_whatsapp_reply": "<<= 320 chars, warm, plain text>",
      "suggested_email_reply": "<warm, 3–6 sentences>",
      "recommended_action": "<one specific action>",
      "confidence_score": 0.0
    }
  ],
  "insights": {
    "top_categories": [{"category": "...", "count": 0}],
    "repeated_themes": ["..."],
    "faq_candidates": ["..."],
    "detected_gaps": ["..."],
    "content_ideas": ["..."],
    "website_recommendations": ["..."],
    "bot_flow_recommendations": ["..."],
    "weekly_summary": "<2–3 sentences>"
  }
}

Questions (JSON):
${JSON.stringify(questions, null, 2)}
`;
}
