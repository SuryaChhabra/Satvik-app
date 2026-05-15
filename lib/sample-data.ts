import type { Question, AnalysisResult, BrandSettings } from "./types";

export const SAMPLE_QUESTIONS_TEXT = [
  "I'm completely new to Satvic. Where should I start?",
  "Can I follow this if I have acidity?",
  "Is the 21-day plan beginner-friendly?",
  "How much time do I need daily?",
  "Can my family also follow this?",
  "Do you have recipes for summer?",
  "I bought the course but can't access it.",
  "Is this safe during pregnancy?",
  "I have thyroid. Can I follow the diet?",
  "I want to lose weight but I feel hungry at night.",
  "What should I eat for dinner?",
  "Do I have to stop tea completely?",
  "Is there a refund policy?",
  "Can I do this while working full-time?",
  "What if my family eats normal food?",
  "How is this different from other diet plans?",
  "Do you have a plan for kids?",
  "I started but couldn't continue.",
  "Can I talk to someone before joining?",
  "What ingredients do I need?",
  "I don't know what to cook every day.",
  "Is this backed by science or Ayurveda?",
  "Can I follow this if I'm on medication?",
  "Do you ship internationally?",
  "I'm feeling confused by too much information.",
];

export function buildSampleQuestions(): Question[] {
  const channels = ["whatsapp", "email", "instagram", "website", "quiz"];
  const stages = ["awareness", "considering", "new_user", "active", "lapsed"];
  const now = Date.now();
  return SAMPLE_QUESTIONS_TEXT.map((text, i) => ({
    id: `q_sample_${i + 1}`,
    raw_text: text,
    channel: channels[i % channels.length],
    user_stage: stages[i % stages.length],
    date: new Date(now - i * 36e5).toISOString(),
    created_at: new Date(now - i * 36e5).toISOString(),
  }));
}

export const DEFAULT_SETTINGS: BrandSettings = {
  tone_traits: ["warm", "simple", "reassuring", "non-pushy", "educational", "human", "Satvic-aligned"],
  ai_model: "gpt-4o-mini",
  health_disclaimer:
    "This is general lifestyle guidance, not medical advice. For your specific condition, please consult a qualified medical practitioner.",
  safety_rules: [
    "Never give direct medical advice or diagnoses.",
    "Flag pregnancy, medication, serious illness, eating disorders, mental health, or urgent symptoms for human review.",
    "Recommend qualified medical consultation for health-specific cases.",
    "Avoid overclaiming outcomes ('cure', 'reverse', 'guaranteed').",
    "Route refund disputes and legal/payment conflicts to a human teammate.",
  ],
  categories: [
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
  ],
  use_mock: true,
};

/**
 * Pre-built analysis for the 25 sample questions so the dashboard
 * has something to show on first load (without an AI call).
 */
export function buildSampleAnalyses(questions: Question[]): AnalysisResult[] {
  const map: Record<string, Partial<AnalysisResult>> = {
    "I'm completely new to Satvic. Where should I start?": {
      category: "Beginner confusion",
      intent: "Find a starting point",
      emotion: "Overwhelmed, curious",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Onboarding gap",
      suggested_whatsapp_reply:
        "Welcome 🌱 The easiest way to begin Satvic is with one small habit — a glass of warm water in the morning. Want me to share a free 3-Day Gentle Start?",
      suggested_email_reply:
        "Hello, and welcome to Satvic Movement.\n\nThe best way to begin is gently — one small habit at a time. We recommend starting with our free 3-Day Gentle Start journey. Reply 'yes' and we'll send the link.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Send 3-Day Gentle Start link + add to beginner onboarding sequence.",
    },
    "Can I follow this if I have acidity?": {
      category: "Health-sensitive doubts",
      intent: "Check suitability for a health condition",
      emotion: "Hopeful, cautious",
      sensitivity_level: "health-sensitive",
      bot_answerable: "partial",
      escalation_needed: true,
      gap_type: "Health/safety communication gap",
      suggested_whatsapp_reply:
        "Many of our community members with acidity find Satvic habits soothing — like early dinner and warm water. This is general lifestyle guidance and not medical advice. If acidity is chronic, please also consult a qualified doctor. Would you like a gentle starter plan?",
      suggested_email_reply:
        "Hi,\n\nThank you for reaching out. Many people with mild acidity feel relief with Satvic principles — light, early dinners, warm water, and chewing slowly. This is general lifestyle guidance, not medical advice — for chronic acidity, please consult a qualified practitioner.\n\nWe'd be glad to share a beginner-friendly plan to start with.\n\nWarmly,\nTeam Satvic",
      recommended_action:
        "Add 'Living with mild acidity' FAQ with disclaimer; route severe cases to human review.",
    },
    "Is the 21-day plan beginner-friendly?": {
      category: "Product/program clarity",
      intent: "Reassurance before purchase",
      emotion: "Hesitant",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Trust/reassurance gap",
      suggested_whatsapp_reply:
        "Yes 🌿 The 21-day plan is designed for complete beginners. Each day takes ~15 minutes and starts with one tiny habit. Want a preview of Day 1?",
      suggested_email_reply:
        "Hi,\n\nYes — the 21-Day plan is built for beginners. Most participants are completely new to Satvic. Each day is short, with one small habit and one easy recipe.\n\nWe'd be happy to share a preview of Day 1.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Add 'Beginner-friendly' badge + testimonial section to program page.",
    },
    "How much time do I need daily?": {
      category: "Product/program clarity",
      intent: "Practical time concern",
      emotion: "Skeptical, busy",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Website copy gap",
      suggested_whatsapp_reply:
        "Just 10–15 minutes a day is enough to begin 🌱 Most habits take 5 minutes. Want me to share a 5-minute version?",
      suggested_email_reply:
        "Hi,\n\nMost Satvic habits take 5–15 minutes a day. The program is built around small, doable steps — not large lifestyle overhauls.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Highlight '15 minutes a day' on program landing page hero.",
    },
    "Can my family also follow this?": {
      category: "Family adaptation",
      intent: "Adapt program for family",
      emotion: "Hopeful",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Content gap",
      suggested_whatsapp_reply:
        "Absolutely 🌿 Satvic works beautifully as a family practice. We have family-friendly recipes and a Family Satvic Week challenge. Want the link?",
      suggested_email_reply:
        "Hi,\n\nYes, Satvic principles work wonderfully for families. We have family-friendly recipes, kid tiffin ideas, and a Family Satvic Week challenge.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Create dedicated 'Satvic for Families' landing section.",
    },
    "Do you have recipes for summer?": {
      category: "Seasonal wellness",
      intent: "Seasonal eating",
      emotion: "Curious",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Seasonal content gap",
      suggested_whatsapp_reply:
        "Yes 🌞 Our Summer Cooling collection has sabja-lemon coolers, coconut drinks, and light dinners. Want a 3-recipe starter?",
      suggested_email_reply:
        "Hi,\n\nYes — we have a full Summer Cooling recipe collection. Personal favourites: sabja-lemon cooler, watermelon-mint sip, and moong khichdi for light dinners.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Surface Summer Cooling collection on homepage during May–June.",
    },
    "I bought the course but can't access it.": {
      category: "Order/access support",
      intent: "Resolve access issue",
      emotion: "Frustrated",
      sensitivity_level: "normal",
      bot_answerable: "partial",
      escalation_needed: true,
      gap_type: "Post-purchase support gap",
      suggested_whatsapp_reply:
        "So sorry for the trouble 🙏 Can you share the email you used at checkout? I'll get this fixed for you within a few hours.",
      suggested_email_reply:
        "Hi,\n\nApologies for the access trouble. Could you share your purchase email and order ID? We'll resolve this within a few hours.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Add automated access-recovery flow + post-purchase welcome email.",
    },
    "Is this safe during pregnancy?": {
      category: "Health-sensitive doubts",
      intent: "Pregnancy safety check",
      emotion: "Cautious",
      sensitivity_level: "urgent",
      bot_answerable: "no",
      escalation_needed: true,
      gap_type: "Health/safety communication gap",
      suggested_whatsapp_reply:
        "Congratulations 🌸 Pregnancy is a special phase that needs personal medical guidance. We don't recommend starting any new dietary practice without your obstetrician's clearance. A team member will share gentle, pregnancy-safe lifestyle tips shortly.",
      suggested_email_reply:
        "Hi,\n\nThank you for sharing this. Pregnancy needs personal medical guidance — please consult your obstetrician before starting any new practice. We'd be glad to share some gentle, pregnancy-safe lifestyle ideas once you have your doctor's clearance.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Route to human reviewer. Build 'Pregnancy & Satvic' resource with disclaimers.",
    },
    "I have thyroid. Can I follow the diet?": {
      category: "Health-sensitive doubts",
      intent: "Thyroid suitability",
      emotion: "Worried",
      sensitivity_level: "health-sensitive",
      bot_answerable: "partial",
      escalation_needed: true,
      gap_type: "Health/safety communication gap",
      suggested_whatsapp_reply:
        "Many people with thyroid issues follow Satvic principles gently — early dinners, less packaged food, more whole meals. This is general lifestyle guidance and not medical advice. Please check with your doctor before any change in medication or diet.",
      suggested_email_reply:
        "Hi,\n\nMany of our community members with thyroid follow Satvic principles gently. This is lifestyle guidance — please discuss specific dietary changes with your doctor, especially if you're on medication.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Add 'Thyroid & Satvic — gentle lifestyle notes' FAQ with disclaimer.",
    },
    "I want to lose weight but I feel hungry at night.": {
      category: "Retention/consistency",
      intent: "Manage hunger while losing weight",
      emotion: "Struggling",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Content gap",
      suggested_whatsapp_reply:
        "Night hunger is very common in the beginning 🌙 Try moving dinner slightly earlier and adding a fruit before dinner. Want a 'night hunger' tip sheet?",
      suggested_email_reply:
        "Hi,\n\nNight hunger usually softens after the first 1–2 weeks. Try an earlier dinner (before 7:30 pm) with a fruit plate before, and a warm jeera water if you're hungry late. Sustainable weight balance is gentle, not strict.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Create 'How to handle night hunger' blog + WhatsApp template.",
    },
    "What should I eat for dinner?": {
      category: "Recipe/lifestyle implementation",
      intent: "Daily meal planning",
      emotion: "Decision-fatigued",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Content gap",
      suggested_whatsapp_reply:
        "A light, early dinner is the Satvic favourite 🌙 Tonight try moong khichdi or vegetable soup. Want a 7-day light dinner plan?",
      suggested_email_reply:
        "Hi,\n\nDinner is best kept light and early in Satvic — moong khichdi, vegetable soups, or stewed seasonal vegetables work beautifully. We have a 7-Day Light Dinner plan we'd be happy to share.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Promote 7-Day Light Dinner Challenge.",
    },
    "Do I have to stop tea completely?": {
      category: "Beginner confusion",
      intent: "Understand lifestyle flexibility",
      emotion: "Anxious",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "FAQ gap",
      suggested_whatsapp_reply:
        "Not at all 🌿 Satvic is gentle — start by reducing or switching to herbal teas like tulsi or ginger. No 'stop everything' rules.",
      suggested_email_reply:
        "Hi,\n\nSatvic doesn't ask you to stop everything at once. Many begin by reducing tea or switching to herbal options like tulsi, ginger, or jeera-water. Start gently, change slowly.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Add 'Do I have to give up X?' FAQ for common foods.",
    },
    "Is there a refund policy?": {
      category: "Pricing/payment",
      intent: "Verify refund policy",
      emotion: "Cautious",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Website copy gap",
      suggested_whatsapp_reply:
        "Yes — full details are on our policy page. For refund requests please share your order ID and we'll guide you.",
      suggested_email_reply:
        "Hi,\n\nYou can find our refund policy here: [link]. For specific refund queries, please share your order ID and we'll guide you.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Surface refund link clearly on checkout and program page.",
    },
    "Can I do this while working full-time?": {
      category: "Product/program clarity",
      intent: "Fit program into busy life",
      emotion: "Sceptical",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Trust/reassurance gap",
      suggested_whatsapp_reply:
        "Yes 💚 Most of our community works full-time. Habits take 5–15 minutes a day. We can route you to the Busy Lifestyle Path if you'd like.",
      suggested_email_reply:
        "Hi,\n\nAbsolutely. The program is designed for busy lives — small habits, short videos, and no-cook options. Many in our community are working professionals.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Add 'Built for busy people' section to program page.",
    },
    "What if my family eats normal food?": {
      category: "Family adaptation",
      intent: "Manage household contrast",
      emotion: "Discouraged",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Content gap",
      suggested_whatsapp_reply:
        "That's very common 🌿 Start with one Satvic meal a day for yourself. Many family members slowly join in. Want a 'one-meal-a-day' starter?",
      suggested_email_reply:
        "Hi,\n\nThat's a question we hear often. Most begin with one Satvic meal a day for themselves. Family members usually start trying things slowly when they see the change.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Publish 'When your family eats differently' guide.",
    },
    "How is this different from other diet plans?": {
      category: "Trust/credibility",
      intent: "Differentiation",
      emotion: "Sceptical",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Website copy gap",
      suggested_whatsapp_reply:
        "Satvic isn't a diet — it's a gentle lifestyle. No counting, no restriction, no overnight rules. Want a 1-min explainer?",
      suggested_email_reply:
        "Hi,\n\nSatvic isn't a diet. It's a gentle, lifestyle-based approach rooted in natural and traditional principles. There's no calorie counting or harsh restriction.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Create 'Why Satvic isn't a diet' explainer reel + landing page section.",
    },
    "Do you have a plan for kids?": {
      category: "Family adaptation",
      intent: "Kids' wellness",
      emotion: "Caring",
      sensitivity_level: "normal",
      bot_answerable: "partial",
      escalation_needed: false,
      gap_type: "Content gap",
      suggested_whatsapp_reply:
        "We don't have a kids-only plan yet, but our family recipes are kid-friendly 🌿 Want a tiffin idea set?",
      suggested_email_reply:
        "Hi,\n\nWe don't have a dedicated kids plan yet, but our family recipes and tiffin ideas work beautifully for children. Many parents start there.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Validate demand for a dedicated 'Satvic Kids' product.",
    },
    "I started but couldn't continue.": {
      category: "Retention/consistency",
      intent: "Restart support",
      emotion: "Guilty, discouraged",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Retention gap",
      suggested_whatsapp_reply:
        "That's completely okay 🌿 Restarts are part of the journey. Want a 1-day soft return plan? It's tiny and forgiving.",
      suggested_email_reply:
        "Hi,\n\nRestarting is part of the journey — most of our community has paused at some point. We'd love to send you a gentle 1-Day Soft Return plan to begin again.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Build 'Quiet Returner' re-engagement flow.",
    },
    "Can I talk to someone before joining?": {
      category: "Trust/credibility",
      intent: "Pre-purchase conversation",
      emotion: "Cautious",
      sensitivity_level: "normal",
      bot_answerable: "no",
      escalation_needed: true,
      gap_type: "Trust/reassurance gap",
      suggested_whatsapp_reply:
        "Of course 🙏 A team member will reach out in the next 24 hours. Could you share your phone number and a good time?",
      suggested_email_reply:
        "Hi,\n\nAbsolutely. A team member will reach out within 24 hours. Please share a convenient phone number and time, and any questions you'd like covered.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Offer a 'Book a 10-min call' option for hesitant pre-purchase users.",
    },
    "What ingredients do I need?": {
      category: "Recipe/lifestyle implementation",
      intent: "Practical preparation",
      emotion: "Practical",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Content gap",
      suggested_whatsapp_reply:
        "We have a simple Satvic pantry list — mostly things you already have 🌿 Want me to share it?",
      suggested_email_reply:
        "Hi,\n\nMost Satvic recipes use ingredients you likely already have — whole grains, seasonal fruits, simple spices, ghee. We have a printable starter pantry list. Reply 'yes' and we'll send it.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Create downloadable Satvic pantry starter PDF.",
    },
    "I don't know what to cook every day.": {
      category: "Retention/consistency",
      intent: "Reduce decision fatigue",
      emotion: "Tired, overwhelmed",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Content gap",
      suggested_whatsapp_reply:
        "Totally understand 🌿 We have a 7-day Satvic meal plan that handles the thinking for you. Want it?",
      suggested_email_reply:
        "Hi,\n\nWe have a 7-Day Satvic meal plan that removes the daily 'what to cook' decision. Reply 'yes' and we'll share it.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Promote weekly meal plan + 'this week's plan' WhatsApp broadcast.",
    },
    "Is this backed by science or Ayurveda?": {
      category: "Trust/credibility",
      intent: "Verify credibility",
      emotion: "Sceptical",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Trust/reassurance gap",
      suggested_whatsapp_reply:
        "Both 🌿 Satvic blends traditional wisdom (Ayurveda, natural living) with modern nutrition. We share sources on our learn page.",
      suggested_email_reply:
        "Hi,\n\nSatvic principles blend traditional Indian wisdom (Ayurveda, natural living) with modern lifestyle nutrition. Our 'Learn' section shares the sources behind each principle.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Add 'Our approach: tradition + science' page with sources.",
    },
    "Can I follow this if I'm on medication?": {
      category: "Health-sensitive doubts",
      intent: "Medication interaction",
      emotion: "Worried",
      sensitivity_level: "health-sensitive",
      bot_answerable: "no",
      escalation_needed: true,
      gap_type: "Health/safety communication gap",
      suggested_whatsapp_reply:
        "Thank you for asking 🙏 Please check with your doctor before starting any new dietary practice while on medication. A team member can share general lifestyle notes once you have clearance.",
      suggested_email_reply:
        "Hi,\n\nFor your safety, please consult your doctor before starting any new dietary practice while on medication. We'd be glad to share general lifestyle notes after you have clearance.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Route to human; create 'On medication & curious about Satvic' resource.",
    },
    "Do you ship internationally?": {
      category: "Order/access support",
      intent: "Shipping availability",
      emotion: "Eager",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Website copy gap",
      suggested_whatsapp_reply:
        "Most of our digital programs are available worldwide 🌍 For physical products, please share your country and we'll check.",
      suggested_email_reply:
        "Hi,\n\nOur digital programs are available globally. For physical products, please share your country and we'll confirm shipping.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Add clear international availability info to product pages.",
    },
    "I'm feeling confused by too much information.": {
      category: "Beginner confusion",
      intent: "Reduce overwhelm",
      emotion: "Overwhelmed",
      sensitivity_level: "normal",
      bot_answerable: "yes",
      escalation_needed: false,
      gap_type: "Onboarding gap",
      suggested_whatsapp_reply:
        "Completely understand 🌿 Forget the rest. Begin with one thing: a glass of warm water tomorrow morning. We'll guide you from there.",
      suggested_email_reply:
        "Hi,\n\nOverwhelm is a very common feeling at the start. Please put everything aside and begin with one small step: a glass of warm water tomorrow morning. We'll walk with you from there.\n\nWarmly,\nTeam Satvic",
      recommended_action: "Add 'Feeling overwhelmed? Start here' card on homepage.",
    },
  };

  return questions.map((q, i) => {
    const m = map[q.raw_text] ?? {};
    return {
      id: `a_sample_${i + 1}`,
      question_id: q.id,
      question: q.raw_text,
      category: (m.category as string) ?? "Other",
      intent: m.intent ?? "General enquiry",
      emotion: m.emotion ?? "Curious",
      user_stage: q.user_stage ?? "considering",
      sensitivity_level: m.sensitivity_level ?? "normal",
      bot_answerable: m.bot_answerable ?? "partial",
      escalation_needed: m.escalation_needed ?? false,
      gap_type: m.gap_type ?? "Content gap",
      suggested_whatsapp_reply:
        m.suggested_whatsapp_reply ?? "Thanks for reaching out — we'll get back shortly with a gentle suggestion.",
      suggested_email_reply: m.suggested_email_reply ?? "Hello — thanks for writing in. We'll respond soon.",
      recommended_action: m.recommended_action ?? "Review with team.",
      confidence_score: 0.86,
      channel: q.channel,
    };
  });
}
