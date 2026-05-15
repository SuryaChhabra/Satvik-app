# Satvic · Response Intelligence Dashboard

A calm, AI-assisted internal tool that turns raw user questions (WhatsApp, email, Instagram, website, quizzes) into:

- categorized insight
- intent + emotion + sensitivity
- ready-to-send WhatsApp / email replies
- FAQ candidates
- response templates
- gap analysis with priorities + owners
- starter chatbot flows
- weekly insights reports

Built for Satvic Movement's growth & support team. Designed to feel warm, simple, and Satvic-aligned — not a noisy enterprise SaaS.

> **Mock mode by default.** If you don't set an `OPENAI_API_KEY`, the app runs end-to-end with a deterministic mock analyzer so you can demo and test it instantly.

---

## Quick start

```bash
# 1. Install
npm install

# 2. (Optional) Copy env file and add your OpenAI key for real AI
cp .env.example .env.local

# 3. Run dev server
npm run dev
```

Then open <http://localhost:3000>.

The app is seeded with 25 realistic sample questions and their analyses on first load — you can explore every page right away.

---

## Tech stack

- **Next.js 14** App Router + **TypeScript**
- **Tailwind CSS** with a warm wellness palette (sage / cream / clay)
- **Custom shadcn-style UI** components (no CLI dependency, easier to deploy)
- **OpenAI** server route at `/api/analyze` with strict JSON output
- **Built-in mock analyzer** fallback (no key needed)
- **LocalStorage**-backed client store (zero-config persistence)
- Optional Supabase upgrade — see *Next iterations* below

---

## Folder structure

```
app/
  layout.tsx                  # sidebar + main shell
  globals.css                 # Tailwind + soft wellness palette
  page.tsx                    # Dashboard home
  upload/page.tsx             # Paste / CSV upload + Analyze
  results/page.tsx            # Filterable, expandable result cards
  categories/page.tsx         # Grouped by theme + recommended action
  faqs/page.tsx               # FAQ candidates: approve / edit / reject / export
  templates/page.tsx          # Reusable WhatsApp + email templates
  gaps/page.tsx               # Gap analysis with priority + owner
  bot-flows/page.tsx          # Starter chatbot flows + exports
  report/page.tsx             # Weekly insights report
  settings/page.tsx           # Brand tone / safety rules / categories
  api/analyze/route.ts        # POST /api/analyze — OpenAI + mock fallback

components/
  sidebar.tsx                 # Calm sidebar + mobile top bar
  page-header.tsx
  empty-state.tsx
  stat-card.tsx
  ui/                         # button, card, badge, input/textarea/select

lib/
  types.ts                    # All TypeScript types / enums
  utils.ts                    # cn, uid, CSV parse, CSV/MD export, download
  sample-data.ts              # 25 sample questions + analyses + default settings
  store.ts                    # localStorage-backed reactive store
  aggregations.ts             # FAQ / Template / Gap / Bot flow / Report builders
  ai/
    prompt.ts                 # System + user prompts
    mock.ts                   # Keyword-driven deterministic mock analyzer
    analyze.ts                # Server entry: tries OpenAI, falls back to mock
```

---

## Core data model (TypeScript)

All defined in `lib/types.ts`:

- `Question` · `AnalysisResult` · `FAQ` · `Template` · `Gap` · `BotFlow` · `BotFlowStep` · `InsightReport` · `BrandSettings` · `AggregatedInsights`

These map 1:1 to the spec. They're persisted in `localStorage` for the MVP. To move to Supabase, see the next section.

---

## AI route

`POST /api/analyze`

```jsonc
// Request
{
  "questions": [
    { "id": "q_1", "text": "Is this safe during pregnancy?", "channel": "whatsapp", "user_stage": "considering" }
  ],
  "forceMock": false   // optional, forces mock even if OPENAI_API_KEY is set
}
```

Returns the full `AnalyzeResponse` shape: `{ results, insights, source }` where each `result` matches the structured JSON in the product spec and `source` is `"openai"` or `"mock"`.

The OpenAI prompt:

- enforces Satvic tone (warm, simple, reassuring, non-pushy, educational, human),
- forbids medical advice,
- flags pregnancy / medication / serious illness / mental health / eating disorders / urgent symptoms / refund disputes for human review,
- requires a doctor-consultation disclaimer for health-sensitive cases,
- and requests strict JSON via `response_format: { type: "json_object" }`.

If the OpenAI call fails for any reason, the route transparently falls back to the mock analyzer so the dashboard never blocks the team.

---

## Environment variables

`.env.local`:

```bash
OPENAI_API_KEY=             # leave empty for mock mode
OPENAI_MODEL=gpt-4o-mini    # optional; defaults to gpt-4o-mini
```

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. In Vercel: *New Project → Import → set `OPENAI_API_KEY` (optional) → Deploy*.
3. No other configuration needed. The app builds with `next build` and runs on Node 20+.

If you'd rather demo without a key, just deploy as-is — mock mode is the default.

---

## Adding real WhatsApp / email integrations later

The MVP is intentionally I/O-agnostic. To go live:

1. **WhatsApp Business Cloud API**
   - Add a webhook route `app/api/webhooks/whatsapp/route.ts`.
   - When a message arrives, push it into the store as a `Question`, then call `analyzeQuestions({ questions: [...] })` server-side.
   - Reply with `result.suggested_whatsapp_reply` — gated through human approval if `escalation_needed === true` or `sensitivity_level !== "normal"`.

2. **Email (Gmail / Helpdesk / Postmark)**
   - Poll inbox or use an inbound webhook → push as `Question` with `channel: "email"`.
   - Use `result.suggested_email_reply` as the draft body.
   - Surface escalations in a `/queue` page (next iteration).

3. **Instagram / DM / Comment ingestion**
   - Use Meta Graph API webhook → same pattern.

4. **Quiz / website forms**
   - Send form payload to a Next.js Route Handler that batches into `/api/analyze`.

5. **Supabase upgrade (recommended for production)**
   - Replace `lib/store.ts` with a Supabase client.
   - Schema: tables for each TS interface in `lib/types.ts`. Suggested SQL:

     ```sql
     create table questions(
       id uuid primary key default gen_random_uuid(),
       raw_text text not null,
       channel text, date timestamptz, product text, user_stage text,
       current_reply text, created_at timestamptz default now()
     );
     create table analyses(
       id uuid primary key default gen_random_uuid(),
       question_id uuid references questions(id) on delete cascade,
       category text, intent text, emotion text, user_stage text,
       sensitivity_level text, bot_answerable text, escalation_needed boolean,
       gap_type text, suggested_whatsapp_reply text, suggested_email_reply text,
       recommended_action text, confidence_score real,
       created_at timestamptz default now()
     );
     create table faqs(...); -- mirror FAQ type
     create table templates(...);
     create table gaps(...);
     create table bot_flows(...);
     create table reports(...);
     ```
   - Add Supabase Auth for the support team (magic link is enough).

---

## Safety + brand guardrails (built in)

- Health-sensitive sensitivity tone → soft yellow badges, never red.
- Health questions always include a "consult a qualified medical practitioner" disclaimer.
- Pregnancy / medication / urgent symptoms / eating disorders → forced human escalation.
- Refund / payment disputes → forced human escalation.
- No outcome overclaims ("cure", "guaranteed") in any template or mock reply.
- Forgiving copy throughout the UI ("Analyzing gently…", "Save snapshot").

---

## Sample data

25 realistic Indian user questions are pre-seeded (`lib/sample-data.ts`), each with a hand-crafted analysis so the dashboard is meaningful from the very first render. They cover beginner overwhelm, health-sensitive doubts (acidity, pregnancy, thyroid, medication), product clarity, family adaptation, seasonal eating, order/access support, refund queries, retention drop-offs, and credibility questions.

---

## Next iterations

1. **Supabase migration** — multi-user, shared inbox, audit log.
2. **Inbox queue** — a single page that combines raw incoming questions, AI suggestions, and "send / escalate" actions.
3. **WhatsApp / email webhooks** — turn this from a batch tool into a live cockpit.
4. **Bot designer** — drag-drop the generated flows into an editor and publish to WhatsApp Cloud.
5. **Tone fine-tuning** — feed approved replies back into the prompt as few-shot examples.
6. **Multi-language** — Hindi & regional language analysis and replies.
7. **Insights dashboard** — week-over-week trendlines for category share, sentiment, and escalation volume.
8. **Reviewer roles** — `support`, `growth`, `content`, `product` views with assignment workflow.
9. **AI safety layer** — second-pass classifier that vetoes any draft mentioning diagnosis or guaranteed outcomes.
10. **Connector to the Satvic Companion app** — push approved FAQs and bot flows directly into the consumer app.

---

## Commands

```bash
npm run dev         # local dev
npm run typecheck   # strict TS check
npm run build       # production build
npm run start       # serve production build
```

---

🌿 Built warmly for Satvic Movement.
