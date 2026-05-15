"use client";

import { useUserStore } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/card";
import { SeedPill } from "@/components/seed-pill";
import { BADGES } from "@/lib/badges";

export default function BadgesPage() {
  const { state } = useUserStore();
  const earned = new Set(state.earned_badges);

  const seedsToNext = nextLevelSeeds(state.seeds);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink-900">Your progress 🏵️</h1>
        <SeedPill />
      </header>

      <Card>
        <CardBody>
          <div className="text-xs uppercase tracking-wide text-ink-500">Level</div>
          <div className="font-serif text-2xl mt-1">{state.level}</div>
          <div className="mt-3 h-1.5 rounded-full bg-cream-200 overflow-hidden">
            <div className="h-full bg-sage-400 transition-all" style={{ width: `${seedsToNext.percent}%` }} />
          </div>
          <div className="text-xs text-ink-500 mt-2">
            {seedsToNext.remaining > 0
              ? `${seedsToNext.remaining} Seeds to ${seedsToNext.nextLevel}`
              : "You've reached the highest level. Beautifully done 🌳"}
          </div>
        </CardBody>
      </Card>

      <div className="text-xs uppercase tracking-wide text-ink-500">Badges</div>
      <div className="grid grid-cols-2 gap-3">
        {BADGES.map((b) => {
          const got = earned.has(b.id);
          return (
            <Card key={b.id} className={got ? "" : "opacity-50"}>
              <CardBody>
                <div className="text-3xl">{b.emoji}</div>
                <div className="font-medium text-ink-900 mt-1">{b.title}</div>
                <div className="text-xs text-ink-500 mt-1">{b.description}</div>
                {!got && <div className="text-[11px] text-ink-300 mt-2">{b.earn_condition}</div>}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function nextLevelSeeds(seeds: number) {
  const thresholds: [string, number][] = [
    ["Sprout", 100], ["Sapling", 300], ["Leaf", 600], ["Bloom", 1000],
    ["Fruit", 1800], ["Radiance", 3000], ["Guide", 5000],
  ];
  for (const [name, t] of thresholds) {
    if (seeds < t) return { nextLevel: name, remaining: t - seeds, percent: Math.min(100, Math.round((seeds / t) * 100)) };
  }
  return { nextLevel: "Guide", remaining: 0, percent: 100 };
}
