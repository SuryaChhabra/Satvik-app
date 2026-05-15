"use client";

import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [data, actions] = useStore();
  const { settings } = data;

  const update = (patch: Partial<typeof settings>) => actions.saveSettings({ ...settings, ...patch });

  return (
    <>
      <PageHeader
        title="Settings"
        description="Tune brand tone, AI behavior, and safety rules. Used as guidance for the AI prompt."
        actions={<Button variant="outline" onClick={actions.reset}>Reset all data</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand tone</CardTitle>
            <CardDescription>Words the AI should honour in every reply.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {settings.tone_traits.map((t) => (
                <Badge key={t} tone="sage">{t}</Badge>
              ))}
            </div>
            <Label>Tone traits (comma-separated)</Label>
            <Input
              value={settings.tone_traits.join(", ")}
              onChange={(e) => update({ tone_traits: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI model</CardTitle>
            <CardDescription>Defaults to mock mode if <code>OPENAI_API_KEY</code> is unset.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label>Preferred model name</Label>
            <Input value={settings.ai_model} onChange={(e) => update({ ai_model: e.target.value })} placeholder="gpt-4o-mini" />
            <div className="text-xs text-ink-500 mt-2">
              Set the actual model via the <code>OPENAI_MODEL</code> env var. This field is informational.
            </div>
            <label className="flex items-center gap-2 mt-3 text-sm text-ink-700">
              <input type="checkbox" checked={settings.use_mock} onChange={(e) => update({ use_mock: e.target.checked })} />
              Prefer mock mode for new runs
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health disclaimer</CardTitle>
            <CardDescription>Auto-appended to health-sensitive replies.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={3}
              value={settings.health_disclaimer}
              onChange={(e) => update({ health_disclaimer: e.target.value })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety rules</CardTitle>
            <CardDescription>Rules the AI must follow when drafting replies.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={7}
              value={settings.safety_rules.join("\n")}
              onChange={(e) => update({ safety_rules: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>The category vocabulary the AI is asked to use.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={5}
              value={settings.categories.join("\n")}
              onChange={(e) => update({ categories: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
            />
            <div className="text-xs text-ink-500 mt-2">One per line. These appear as filter options in Analysis Results.</div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
