"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const { state } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (state.profile.current_path) {
      router.replace("/today");
    }
  }, [state.profile.current_path, router]);

  return (
    <div className="min-h-[80vh] flex flex-col justify-between text-center pt-10">
      <div>
        <div className="mx-auto w-28 h-28 rounded-full bg-sage-100 flex items-center justify-center text-5xl mb-6 float-soft">🌱</div>
        <h1 className="font-serif text-3xl text-ink-900 leading-tight">Begin a gentle Satvic journey</h1>
        <p className="text-ink-500 mt-3 max-w-sm mx-auto leading-relaxed">
          One small habit a day. A real-feeling garden that grows as you do. No pressure, no streaks to break.
        </p>
      </div>

      <div className="mt-10 grid gap-3 text-left text-sm text-ink-700">
        <Bullet emoji="🪴" text="Tiny daily habits, personalised to you." />
        <Bullet emoji="🌿" text="A Satvic Garden that grows with each step." />
        <Bullet emoji="🌙" text="Forgiving rhythm — missed days are simply rest days." />
      </div>

      <div className="mt-12">
        <Link href="/onboarding"><Button size="lg" className="w-full">Begin gently →</Button></Link>
        <p className="text-xs text-ink-500 mt-3">About 2 minutes. You can skip any question.</p>
      </div>
    </div>
  );
}

function Bullet({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white border border-cream-200 px-4 py-3">
      <div className="text-xl">{emoji}</div>
      <div>{text}</div>
    </div>
  );
}
