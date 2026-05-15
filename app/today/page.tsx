"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore, todayHabitFor, rhythmThisWeek, isLapsed } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SeedPill } from "@/components/seed-pill";
import type { HabitLog } from "@/lib/types";

export default function TodayPage() {
  const router = useRouter();
  const { state, actions } = useUserStore();

  if (!state.profile.current_path) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🌱</div>
        <h2 className="font-serif text-xl">Let's start gently</h2>
        <p className="text-ink-500 mt-2 max-w-sm mx-auto">Take a short quiz to get your personalised Satvic path.</p>
        <Link href="/onboarding" className="inline-block mt-6">
          <Button>Take the quiz</Button>
        </Link>
      </div>
    );
  }

  const today = todayHabitFor(state)!;
  const rhythm = rhythmThisWeek(state);
  const lapsed = isLapsed(state);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-xs text-ink-500">Day {today.day} of your {today.path.name} journey</div>
          <h1 className="font-serif text-2xl text-ink-900 leading-tight">Today's small step 🌿</h1>
        </div>
        <SeedPill />
      </header>

      {lapsed && (
        <div className="rounded-2xl bg-sky-soft p-4 text-sm text-[#2E4452]">
          <div className="font-medium">Welcome back 🌿</div>
          Your garden has waited softly. No streak was broken — let's plant one seed today.
        </div>
      )}

      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-2">
            <Chip tone="sage">{today.habit.lesson_title}</Chip>
            <Chip tone="cream">~{today.habit.estimated_minutes} min</Chip>
          </div>
          <h2 className="font-serif text-xl text-ink-900 mt-2">{today.habit.title}</h2>
          <p className="text-sm text-ink-700 mt-2 leading-relaxed">{today.habit.lesson_body}</p>

          {today.completedToday ? (
            <CompletedSection
              dayIndex={today.day}
              reflection={today.log?.reflection}
              setReflection={(r) => actions.setReflection(today.day, r)}
              nextPreview={today.habit.next_preview}
            />
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button onClick={() => actions.completeTodayHabit(today.day)}>I did it 🌱</Button>
              <Button variant="soft" onClick={() => router.push("/garden")}>See garden</Button>
            </div>
          )}
        </CardBody>
      </Card>

      {today.habit.recipe_id && (
        <Card>
          <CardBody>
            <div className="text-xs uppercase tracking-wide text-ink-500">Recipe of the day</div>
            <div className="font-medium text-ink-900 mt-1">{niceRecipeName(today.habit.recipe_id)}</div>
            <p className="text-sm text-ink-500 mt-1">A gentle option to try today.</p>
            <div className="mt-3 flex gap-2">
              <Button variant="soft" size="sm" onClick={() => actions.saveRecipe(today.habit.recipe_id!)}>
                {state.saved_recipes.includes(today.habit.recipe_id) ? "Saved ✓" : "Save"}
              </Button>
              <Button variant="ghost" size="sm">Open</Button>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <div className="text-xs uppercase tracking-wide text-ink-500">This week's rhythm</div>
          <div className="mt-3 flex items-center gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < rhythm ? "bg-sage-400" : "bg-cream-200"}`} />
            ))}
          </div>
          <div className="text-xs text-ink-500 mt-2">
            {rhythm >= 5 ? "Beautiful rhythm this week 🌿" : rhythm > 0 ? "Steady, gentle progress." : "Today is a fresh leaf."}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-xs uppercase tracking-wide text-ink-500">Tomorrow</div>
          <div className="text-sm text-ink-700 mt-1">{today.habit.next_preview}</div>
        </CardBody>
      </Card>
    </div>
  );
}

function CompletedSection({
  dayIndex,
  reflection,
  setReflection,
  nextPreview,
}: {
  dayIndex: number;
  reflection?: HabitLog["reflection"];
  setReflection: (r: HabitLog["reflection"]) => void;
  nextPreview: string;
}) {
  const opts: { value: HabitLog["reflection"]; label: string; emoji: string }[] = [
    { value: "easy", label: "Easy", emoji: "🌸" },
    { value: "okay", label: "Okay", emoji: "🌿" },
    { value: "hard", label: "Hard", emoji: "🌥️" },
  ];
  return (
    <div className="mt-5 rounded-2xl bg-sage-50 p-4">
      <div className="text-sm text-ink-900 font-medium">Beautifully done 🌱 Day {dayIndex} complete.</div>
      <div className="text-xs text-ink-500 mt-1">How did this feel today?</div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {opts.map((o) => (
          <button
            key={o.value}
            onClick={() => setReflection(o.value)}
            className={`rounded-2xl border px-2 py-3 text-sm transition-colors ${reflection === o.value ? "border-sage-300 bg-white" : "border-cream-200 bg-white/60 hover:bg-white"}`}
          >
            <div className="text-lg leading-none">{o.emoji}</div>
            <div className="text-xs mt-1 text-ink-700">{o.label}</div>
          </button>
        ))}
      </div>
      <div className="text-xs text-ink-500 mt-3">Tomorrow: {nextPreview}</div>
    </div>
  );
}

function niceRecipeName(id: string) {
  return id
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
