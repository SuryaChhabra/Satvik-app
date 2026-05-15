"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { assignPath } from "@/lib/paths";
import type { QuizAnswers } from "@/lib/types";

interface Question {
  id: keyof QuizAnswers;
  title: string;
  helper?: string;
  options: { value: string; label: string }[];
}

const universalQuestions: Question[] = [
  {
    id: "goal",
    title: "What brings you to Satvic today?",
    helper: "Pick whatever feels closest. You can change this anytime.",
    options: [
      { value: "beginner", label: "I'm new — show me the way 🌱" },
      { value: "digestion", label: "Better digestion 🌙" },
      { value: "weight_balance", label: "Gentle weight balance 🍃" },
      { value: "family", label: "Healthier family meals 👨‍👩‍👧" },
      { value: "seasonal", label: "Eat with the season ☀️" },
      { value: "busy", label: "I'm busy — keep it light 💧" },
      { value: "deep_practice", label: "I follow Satvic — go deeper 🌳" },
    ],
  },
  {
    id: "familiarity",
    title: "How familiar are you with Satvic living?",
    options: [
      { value: "new", label: "New to it — start gently" },
      { value: "some", label: "I know a little" },
      { value: "follows", label: "I follow Satvic often" },
      { value: "program", label: "I've taken a Satvic program" },
    ],
  },
  {
    id: "struggle",
    title: "What's your biggest struggle right now?",
    options: [
      { value: "start", label: "I don't know where to start" },
      { value: "stick", label: "I start but can't stick to it" },
      { value: "energy", label: "Low energy or sluggish" },
      { value: "info_overload", label: "Too much information" },
      { value: "family", label: "Family doesn't support it" },
    ],
  },
  {
    id: "time_minutes",
    title: "How much time can you give to a Satvic habit each day?",
    options: [
      { value: "5", label: "5 minutes" },
      { value: "15", label: "10–15 minutes" },
      { value: "30", label: "20–30 minutes" },
      { value: "60", label: "I'm flexible" },
    ],
  },
];

const adaptiveQuestions: Question[] = [
  {
    id: "learning",
    title: "How do you prefer to learn?",
    options: [
      { value: "video", label: "Short videos" },
      { value: "read", label: "Quick reads" },
      { value: "recipe", label: "Recipes I can try" },
      { value: "audio", label: "Audio while doing chores" },
    ],
  },
  {
    id: "family_size",
    title: "Are you doing this for yourself, or also for family?",
    options: [
      { value: "1", label: "Just me" },
      { value: "2", label: "Me + partner" },
      { value: "3", label: "Me + kids" },
      { value: "4", label: "Whole family" },
    ],
  },
  {
    id: "notification_time",
    title: "When do you prefer gentle reminders?",
    options: [
      { value: "morning", label: "Morning (6–9 am)" },
      { value: "midday", label: "Midday (12–2 pm)" },
      { value: "evening", label: "Evening (5–7 pm)" },
      { value: "night", label: "Night (9–10 pm)" },
      { value: "none", label: "No reminders, I'll come back" },
    ],
  },
  {
    id: "ready_for_challenge",
    title: "Would you like to start with a small challenge?",
    options: [
      { value: "three", label: "Yes — a 3-day gentle one" },
      { value: "seven", label: "Yes — a 7-day journey" },
      { value: "later", label: "Maybe later. Daily tips first." },
    ],
  },
];

const allQuestions = [...universalQuestions, ...adaptiveQuestions];

export default function OnboardingPage() {
  const router = useRouter();
  const { actions } = useUserStore();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const total = allQuestions.length;
  const q = allQuestions[idx];

  const onSelect = (val: string) => {
    const next: QuizAnswers = { ...answers };
    if (q.id === "time_minutes") next.time_minutes = Number(val) as QuizAnswers["time_minutes"];
    else if (q.id === "family_size") next.family_size = Number(val) as QuizAnswers["family_size"];
    else (next as Record<string, string>)[q.id as string] = val;
    setAnswers(next);
    setTimeout(() => advance(next), 180);
  };

  const advance = (current: QuizAnswers) => {
    if (idx + 1 >= total) {
      const pathId = assignPath(current);
      actions.completeOnboarding(current, pathId);
      router.push(`/path?id=${pathId}`);
      return;
    }
    setIdx(idx + 1);
  };

  const skip = () => advance(answers);

  const progress = useMemo(() => Math.round(((idx + 1) / total) * 100), [idx, total]);

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 rounded-full bg-cream-200 overflow-hidden">
          <div className="h-full bg-sage-400 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-ink-500">{idx + 1} / {total}</span>
      </div>

      <h1 className="font-serif text-2xl text-ink-900 leading-snug">{q.title}</h1>
      {q.helper && <p className="text-sm text-ink-500 mt-2">{q.helper}</p>}

      <div className="mt-6 space-y-3 flex-1">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="w-full text-left rounded-2xl border border-cream-200 bg-white hover:bg-sage-50 px-4 py-3 transition-colors"
          >
            <span className="text-ink-900">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between text-sm">
        <button onClick={() => setIdx(Math.max(0, idx - 1))} className="text-ink-500" disabled={idx === 0}>Back</button>
        <button onClick={skip} className="text-ink-500">Skip</button>
      </div>
    </div>
  );
}
