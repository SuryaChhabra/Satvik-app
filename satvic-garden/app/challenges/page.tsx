"use client";

import { useMemo, useState } from "react";
import { useUserStore } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SeedPill } from "@/components/seed-pill";
import { CHALLENGES, CHALLENGE_MAP } from "@/lib/challenges";
import { BADGE_MAP } from "@/lib/badges";

type Tab = "all" | "3-day" | "7-day" | "21-day" | "seasonal" | "family";

export default function ChallengesPage() {
  const [tab, setTab] = useState<Tab>("all");
  const { state, actions } = useUserStore();

  const filtered = useMemo(() => {
    if (tab === "all") return CHALLENGES;
    if (tab === "seasonal") return CHALLENGES.filter((c) => c.category === "seasonal" || c.category === "festival");
    if (tab === "family") return CHALLENGES.filter((c) => c.category === "family");
    if (tab === "3-day") return CHALLENGES.filter((c) => c.duration_days === 3);
    if (tab === "7-day") return CHALLENGES.filter((c) => c.duration_days === 7);
    if (tab === "21-day") return CHALLENGES.filter((c) => c.duration_days === 21);
    return CHALLENGES;
  }, [tab]);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink-900">Challenges 🎋</h1>
        <SeedPill />
      </header>
      <p className="text-sm text-ink-500">Choose one when you feel ready. No rush.</p>

      <div className="flex flex-wrap gap-2">
        {(["all", "3-day", "7-day", "21-day", "seasonal", "family"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${tab === t ? "bg-sage-100 border-sage-200 text-sage-700" : "border-cream-200 text-ink-500 bg-white"}`}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>

      {state.active_challenges.length > 0 && (
        <Card>
          <CardBody>
            <div className="text-xs uppercase tracking-wide text-ink-500">In progress</div>
            <ul className="mt-2 space-y-3">
              {state.active_challenges.map((c) => {
                const def = CHALLENGE_MAP[c.id];
                return (
                  <li key={c.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-ink-900 text-sm">{def.title}</div>
                      <div className="text-xs text-ink-500">Day {c.current_day} of {def.duration_days}</div>
                    </div>
                    <Button size="sm" onClick={() => actions.advanceChallenge(c.id)}>Mark today done</Button>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-4">
        {filtered.map((c) => {
          const active = state.active_challenges.some((x) => x.id === c.id);
          const done = state.completed_challenges.some((x) => x.id === c.id);
          return (
            <Card key={c.id}>
              <CardBody>
                <div className="flex items-center justify-between mb-1">
                  <Chip tone="sage">{c.duration_days}-day · {c.category}</Chip>
                  {done && <Chip tone="cream">Complete ✓</Chip>}
                </div>
                <h3 className="font-serif text-lg text-ink-900">{c.title}</h3>
                <ul className="mt-2 space-y-0.5 text-sm text-ink-700 list-disc pl-5">
                  {c.daily_structure.slice(0, 4).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                  {c.daily_structure.length > 4 && <li>+{c.daily_structure.length - 4} more days</li>}
                </ul>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Chip tone="cream">Badge: {BADGE_MAP[c.badge_id]?.emoji} {BADGE_MAP[c.badge_id]?.title}</Chip>
                  <Chip tone="sky">Garden: {c.garden_unlock.replace("_", " ")}</Chip>
                </div>
                <div className="mt-4 flex gap-2">
                  {!active && !done && <Button size="sm" onClick={() => actions.startChallenge(c.id)}>Begin</Button>}
                  {active && <Button size="sm" variant="soft" onClick={() => actions.advanceChallenge(c.id)}>Mark today done</Button>}
                  {done && <Button size="sm" variant="soft" disabled>Completed</Button>}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
