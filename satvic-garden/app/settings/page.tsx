"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { state, actions } = useUserStore();
  const router = useRouter();

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-2xl text-ink-900">Settings ⚙️</h1>
      <p className="text-sm text-ink-500">You're in charge of the pace 🌿</p>

      <Card>
        <CardBody>
          <label className="block text-xs uppercase tracking-wide text-ink-500 mb-1">Your name</label>
          <input
            type="text"
            value={state.profile.display_name}
            onChange={(e) => actions.setName(e.target.value)}
            className="w-full rounded-xl border border-cream-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-sage-200 focus:outline-none"
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-ink-900">Lite mode</div>
              <div className="text-xs text-ink-500">Only the essentials — one lesson + one habit a day.</div>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={state.profile.lite_mode}
                onChange={(e) => actions.setLiteMode(e.target.checked)}
                className="h-5 w-9 appearance-none rounded-full bg-cream-200 checked:bg-sage-400 transition-colors relative
                          before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all checked:before:left-[18px]"
              />
            </label>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Reminder time</div>
          <div className="text-sm text-ink-700 capitalize">{state.profile.notification_time}</div>
          <div className="text-xs text-ink-500 mt-2">You can change this by retaking the quiz.</div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Your path</div>
          <div className="font-medium text-ink-900">{state.profile.current_path ?? "Not chosen yet"}</div>
          <div className="mt-3 flex gap-2">
            <Button variant="soft" size="sm" onClick={() => router.push("/onboarding")}>Retake quiz</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-xs uppercase tracking-wide text-ink-500 mb-1">Privacy & data</div>
          <p className="text-sm text-ink-700">Your data stays on this device (localStorage) in this prototype. In the production app it will sync to your account with explicit consent.</p>
          <div className="mt-3">
            <Button variant="ghost" size="sm" onClick={() => { actions.reset(); router.push("/"); }}>Reset all data</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
