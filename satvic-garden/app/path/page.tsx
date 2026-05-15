"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { PATHS } from "@/lib/paths";
import type { PathId } from "@/lib/types";

export default function PathResultPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-ink-500">Preparing your path 🌿</div>}>
      <PathResultInner />
    </Suspense>
  );
}

function PathResultInner() {
  const params = useSearchParams();
  const pathId = (params.get("id") as PathId) || "gentle_beginner";
  const path = PATHS[pathId];
  const { state } = useUserStore();
  const tomorrow = path.days[0];

  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="text-center mt-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-sage-100 flex items-center justify-center text-5xl mb-4 float-soft">
          {path.emoji}
        </div>
        <Chip tone="sage">Your path</Chip>
        <h1 className="font-serif text-3xl text-ink-900 mt-3 leading-tight">You're our {path.name}</h1>
        <p className="text-ink-500 mt-3 leading-relaxed max-w-sm mx-auto">{path.rationale}</p>
      </div>

      <div className="mt-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wide text-ink-500">Tomorrow's first step</div>
              <Chip tone="cream">~{tomorrow.estimated_minutes} min</Chip>
            </div>
            <div className="mt-2 font-medium text-ink-900">{tomorrow.title}</div>
            <div className="text-sm text-ink-500 mt-1">{tomorrow.lesson_title}</div>
          </CardBody>
        </Card>

        <Card className="mt-4">
          <CardBody>
            <div className="text-xs uppercase tracking-wide text-ink-500">A gentle promise</div>
            <ul className="mt-2 text-sm text-ink-700 space-y-1.5 list-disc pl-5">
              <li>One small step a day. Never more.</li>
              <li>Missed days are rest days — your garden waits.</li>
              <li>For any health condition, a soft disclaimer + your doctor first.</li>
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="mt-10">
        <Link href="/today"><Button size="lg" className="w-full">Begin Day 1 →</Button></Link>
        <p className="text-xs text-ink-500 mt-2 text-center">+{state.seeds >= 15 ? 15 : state.seeds} Satvic Seeds planted from your quiz</p>
      </div>
    </div>
  );
}
