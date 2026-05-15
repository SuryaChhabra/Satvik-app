"use client";

import { useState } from "react";
import { useUserStore } from "@/lib/store";
import { GardenSVG } from "@/components/garden-svg";
import { SeedPill } from "@/components/seed-pill";
import { Card, CardBody } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import type { Plant } from "@/lib/types";

const SEASON_LABEL = {
  spring: "Spring 🌸",
  summer: "Summer ☀️",
  monsoon: "Monsoon 🌧️",
  autumn: "Autumn 🍂",
  winter: "Winter ❄️",
} as const;

export default function GardenPage() {
  const { state } = useUserStore();
  const [active, setActive] = useState<Plant | null>(null);

  const garden = state.garden;
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink-900">Your Satvic Garden 🌿</h1>
          <div className="text-xs text-ink-500 mt-1">{SEASON_LABEL[garden.season]} · {garden.plants.length} plants growing</div>
        </div>
        <SeedPill />
      </header>

      <GardenSVG garden={garden} lush={garden.growth_state} onPlantClick={setActive} />

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-ink-500">Growth state</div>
              <div className="font-medium text-ink-900 mt-1">{labelForGrowth(garden.growth_state)}</div>
            </div>
            <Chip tone="sage">{state.level}</Chip>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-xs uppercase tracking-wide text-ink-500 mb-2">Plants in your garden</div>
          {garden.plants.length === 0 ? (
            <div className="text-sm text-ink-500">A tulsi will be planted with your first habit. 🌿</div>
          ) : (
            <ul className="space-y-2">
              {[...garden.plants].reverse().slice(0, 8).map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-900 capitalize">{prettySpecies(p.species)}</span>
                  <span className="text-ink-500 text-xs">{p.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {active && (
        <div className="fixed inset-0 bg-ink-900/40 flex items-end z-50" onClick={() => setActive(null)}>
          <div className="bg-white rounded-t-3xl w-full p-5 max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-cream-200 rounded-full mx-auto mb-4" />
            <div className="text-xs uppercase tracking-wide text-ink-500">Plant story</div>
            <div className="font-serif text-xl mt-1 text-ink-900 capitalize">{prettySpecies(active.species)}</div>
            <div className="text-sm text-ink-700 mt-2">{active.reason}</div>
            <div className="text-xs text-ink-500 mt-2">Planted {new Date(active.planted_at).toLocaleDateString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function labelForGrowth(g: 1 | 2 | 3) {
  if (g === 1) return "Just beginning";
  if (g === 2) return "Growing softly";
  return "Lush and full";
}
function prettySpecies(s: string) {
  if (s === "tree_family") return "Family Tree";
  return s.replace("_", " ");
}
