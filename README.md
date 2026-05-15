# 🌱 Satvic Garden — MVP

A calm, mobile-first Next.js prototype of the Satvic habit-building + personalization + gentle gamification layer.

This is the **consumer-facing** companion app concept (separate from the internal Response Intelligence Dashboard at the repo root).

## What's in it

- **Welcome screen** with brand-warm intro.
- **Onboarding quiz** — 8 questions (4 universal + 4 adaptive). One-tap chips, progress bar, skip-anywhere.
- **Path result** screen — assigns one of 7 paths (Gentle Beginner, Digestion, Weight Balance, Family, Seasonal, Busy, Deep Practice) and previews Day 1.
- **Today screen** — the daily habit loop: lesson, tiny action, recipe of the day, completion, 3-emoji reflection, next-day preview, weekly rhythm bar.
- **Satvic Garden** — handcrafted SVG garden that visually grows (3 states), seasonal background (auto), tappable plants with a "plant story" sheet.
- **Challenges** — full library (3-day / 7-day / 21-day / seasonal / family), in-progress tracker, badge + garden unlock previews.
- **Badges & level** progress (Seed → Sprout → Sapling → Leaf → Bloom → Fruit → Radiance → Guide).
- **Settings** — name, Lite Mode, reminder time, retake quiz, privacy + reset.

## Tech

- Next.js 14 App Router + TypeScript + Tailwind
- LocalStorage-backed reactive store (`lib/store.ts`)
- Custom mobile-first shadcn-style UI (no CLI)
- Pure SVG garden (no canvas/Three.js — keeps it fast and accessible)

## Run

```bash
cd satvic-garden
npm install
npm run dev
# open http://localhost:3001
```

## Where things live

```
app/
  page.tsx                # Welcome
  onboarding/page.tsx     # Quiz
  path/page.tsx           # Path result reveal
  today/page.tsx          # Daily habit loop (home)
  garden/page.tsx         # Satvic Garden visual
  challenges/page.tsx     # Challenge library + in-progress
  badges/page.tsx         # Levels + badges
  settings/page.tsx       # Profile + lite mode + reset
components/
  bottom-nav.tsx          # 5-tab calm nav
  garden-svg.tsx          # Hand-drawn SVG library + season backgrounds
  seed-pill.tsx           # Seeds + level pill
  ui/                     # button, card, chip
lib/
  types.ts                # All typed models (UserState, GardenState, Plant, etc.)
  paths.ts                # 7 path definitions, each with 7 days
  challenges.ts           # 9 starter challenges
  badges.ts               # 11 starter badges
  store.ts                # Reactive localStorage store + actions
  utils.ts                # cn(), level/growth/season helpers
```

## Safety + tone built-in

- **No leaderboards. No red broken-streak alerts.** Streaks are framed as practice-day rhythm.
- **"Restart gently"** copy after lapsed days, with a soft return banner ("Your garden has waited softly").
- **Health-sensitive path** (Digestion Support) starts with a soft disclaimer.
- **No outcome overclaims.** Copy speaks of "gentle, lifestyle guidance."
- **One push/day** intent (notifications wiring is left for Phase 2; copy library is ready).

## What's next (Phase 2)

- Web push / native push via OneSignal or Expo.
- Supabase backend + auth (schema in the framework above).
- Pop-up quizzes (8 designs in the spec — Where should you start?, What does your body need this summer?, etc.).
- Family Aangan shared garden.
- Sangha Garden global counter.
- Animated multi-zone garden + AR mode.

🌿
