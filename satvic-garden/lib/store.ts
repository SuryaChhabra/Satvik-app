"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  GardenState,
  HabitLog,
  Plant,
  PlantSpecies,
  PathId,
  QuizAnswers,
  UserState,
} from "./types";
import { PATHS } from "./paths";
import { CHALLENGE_MAP } from "./challenges";
import { growthStateFromSeeds, levelFromSeeds, seasonForDate, todayKey, uid } from "./utils";

const STORAGE_KEY = "satvic-garden:v1";

function emptyState(): UserState {
  return {
    profile: {
      display_name: "Friend",
      language: "en",
      current_path: null,
      notification_time: "morning",
      lite_mode: false,
      created_at: new Date().toISOString(),
    },
    quiz_answers: {},
    seeds: 0,
    level: "Seed",
    rhythm_days_this_week: 0,
    grace_used_this_week: false,
    last_active_at: new Date().toISOString(),
    habit_logs: [],
    earned_badges: [],
    active_challenges: [],
    completed_challenges: [],
    saved_recipes: [],
    garden: {
      growth_state: 1,
      season: seasonForDate(),
      plants: [],
      last_visited_at: new Date().toISOString(),
    },
  };
}

function load(): UserState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as UserState;
    // Always refresh season to current date on load.
    parsed.garden.season = seasonForDate();
    return parsed;
  } catch {
    return emptyState();
  }
}

function persist(s: UserState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

type Listener = (s: UserState) => void;
const listeners = new Set<Listener>();
let cache: UserState | null = null;

function get(): UserState {
  if (cache) return cache;
  cache = load();
  return cache;
}

function set(updater: (prev: UserState) => UserState) {
  const next = updater(get());
  next.seeds = Math.max(0, Math.round(next.seeds));
  next.level = levelFromSeeds(next.seeds);
  next.garden.growth_state = growthStateFromSeeds(next.seeds);
  cache = next;
  persist(next);
  listeners.forEach((l) => l(next));
}

function plantSpeciesFromPath(pid: PathId): PlantSpecies {
  return PATHS[pid].starter_plant;
}

export function useUserStore() {
  const [state, setState] = useState<UserState>(() => get());

  useEffect(() => {
    const l: Listener = (s) => setState(s);
    listeners.add(l);
    setState(get());
    return () => {
      listeners.delete(l);
    };
  }, []);

  const reset = useCallback(() => set(() => emptyState()), []);

  const setName = useCallback((n: string) =>
    set((p) => ({ ...p, profile: { ...p.profile, display_name: n || "Friend" } })), []);

  const completeOnboarding = useCallback((answers: QuizAnswers, pathId: PathId) => {
    set((p) => {
      const starterPlant: Plant = {
        id: uid("plant"),
        species: plantSpeciesFromPath(pathId),
        reason: "Starter gift on choosing your path",
        planted_at: new Date().toISOString(),
      };
      return {
        ...p,
        quiz_answers: answers,
        profile: {
          ...p.profile,
          current_path: pathId,
          notification_time: answers.notification_time ?? "morning",
        },
        seeds: p.seeds + 15, // quiz bonus
        garden: { ...p.garden, plants: [...p.garden.plants, starterPlant] },
      };
    });
  }, []);

  const completeTodayHabit = useCallback(
    (day_index: number, reflection?: HabitLog["reflection"]) => {
      set((p) => {
        const date = todayKey();
        const already = p.habit_logs.find((h) => h.day_index === day_index && h.date === date);
        if (already) return p;
        const seedsGain = 5 + (reflection ? 2 : 0);
        const path = p.profile.current_path ? PATHS[p.profile.current_path] : null;
        const habit = path?.days.find((d) => d.day_index === day_index);
        const newPlant: Plant = {
          id: uid("plant"),
          species: pickSpeciesForHabit(habit?.title ?? "", path?.starter_plant ?? "tulsi"),
          reason: `Day ${day_index} — ${habit?.title ?? "Habit"}`,
          planted_at: new Date().toISOString(),
        };
        const log: HabitLog = { day_index, date, status: "done", reflection };
        const newBadges: string[] = [];
        if (day_index === 1 && !p.earned_badges.includes("gentle_starter") && p.profile.current_path === "gentle_beginner") newBadges.push("gentle_starter");
        if (path && day_index === 7) {
          if (!p.earned_badges.includes("seven_day_rhythm")) newBadges.push("seven_day_rhythm");
          if (!p.earned_badges.includes(path.starter_badge)) newBadges.push(path.starter_badge);
        }
        return {
          ...p,
          seeds: p.seeds + seedsGain,
          last_active_at: new Date().toISOString(),
          habit_logs: [log, ...p.habit_logs],
          earned_badges: [...p.earned_badges, ...newBadges],
          rhythm_days_this_week: Math.min(7, p.rhythm_days_this_week + 1),
          garden: { ...p.garden, plants: [...p.garden.plants, newPlant], last_visited_at: new Date().toISOString() },
        };
      });
    },
    [],
  );

  const startChallenge = useCallback((id: string) => {
    set((p) => {
      if (p.active_challenges.some((c) => c.id === id)) return p;
      return {
        ...p,
        seeds: p.seeds + 5,
        active_challenges: [...p.active_challenges, { id, started_at: new Date().toISOString(), current_day: 1 }],
      };
    });
  }, []);

  const advanceChallenge = useCallback((id: string) => {
    set((p) => {
      const c = p.active_challenges.find((x) => x.id === id);
      if (!c) return p;
      const def = CHALLENGE_MAP[id];
      const newDay = c.current_day + 1;
      const isLast = newDay > def.duration_days;
      const updated = isLast
        ? p.active_challenges.filter((x) => x.id !== id)
        : p.active_challenges.map((x) => (x.id === id ? { ...x, current_day: newDay } : x));
      const completed = isLast
        ? [...p.completed_challenges, { ...c, completed_at: new Date().toISOString(), current_day: def.duration_days }]
        : p.completed_challenges;
      const newBadges =
        isLast && !p.earned_badges.includes(def.badge_id) ? [def.badge_id] : [];
      const newPlant: Plant | null = isLast
        ? { id: uid("plant"), species: def.garden_unlock as PlantSpecies, reason: `Challenge: ${def.title}`, planted_at: new Date().toISOString() }
        : null;
      return {
        ...p,
        seeds: p.seeds + (isLast ? 50 : 10),
        active_challenges: updated,
        completed_challenges: completed,
        earned_badges: [...p.earned_badges, ...newBadges],
        garden: newPlant ? { ...p.garden, plants: [...p.garden.plants, newPlant] } : p.garden,
      };
    });
  }, []);

  const saveRecipe = useCallback((id: string) => {
    set((p) => (p.saved_recipes.includes(id) ? p : { ...p, saved_recipes: [...p.saved_recipes, id], seeds: p.seeds + 2 }));
  }, []);

  const setReflection = useCallback((day_index: number, reflection: HabitLog["reflection"]) => {
    set((p) => ({
      ...p,
      habit_logs: p.habit_logs.map((h) =>
        h.day_index === day_index && h.date === todayKey() ? { ...h, reflection } : h,
      ),
    }));
  }, []);

  const setLiteMode = useCallback((on: boolean) => set((p) => ({ ...p, profile: { ...p.profile, lite_mode: on } })), []);

  return {
    state,
    actions: {
      reset,
      setName,
      completeOnboarding,
      completeTodayHabit,
      startChallenge,
      advanceChallenge,
      saveRecipe,
      setReflection,
      setLiteMode,
    },
  };
}

function pickSpeciesForHabit(title: string, fallback: PlantSpecies): PlantSpecies {
  const t = title.toLowerCase();
  if (t.includes("water") || t.includes("hydrat")) return "mint";
  if (t.includes("fruit")) return "lemon";
  if (t.includes("dinner") || t.includes("khichdi")) return "jowar";
  if (t.includes("walk")) return "marigold";
  if (t.includes("almond")) return "spice";
  if (t.includes("family") || t.includes("tiffin")) return "tree_family";
  if (t.includes("season")) return "marigold";
  if (t.includes("breath") || t.includes("mindful")) return "lotus";
  return fallback;
}

// Helpers exposed for screens that don't need full hook
export function getTodayDayIndex(state: UserState): number {
  if (!state.profile.current_path) return 0;
  const path = PATHS[state.profile.current_path];
  // Day index = next day not yet completed today (1..7).
  const date = todayKey();
  const doneDays = new Set(state.habit_logs.filter((h) => h.status === "done").map((h) => h.day_index));
  // If today's last log matches today's date and most recent day is done, advance.
  for (let d = 1; d <= path.days.length; d++) {
    if (!doneDays.has(d)) return d;
  }
  return path.days.length;
}

export function todayHabitFor(state: UserState) {
  if (!state.profile.current_path) return null;
  const day = getTodayDayIndex(state);
  const path = PATHS[state.profile.current_path];
  const habit = path.days.find((d) => d.day_index === day) ?? path.days[path.days.length - 1];
  const log = state.habit_logs.find((l) => l.day_index === habit.day_index && l.date === todayKey());
  return { path, habit, day, completedToday: !!log, log };
}

export function rhythmThisWeek(state: UserState) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay()); // Sunday
  start.setHours(0, 0, 0, 0);
  return state.habit_logs.filter((l) => l.status === "done" && new Date(l.date) >= start).length;
}

export function isLapsed(state: UserState): boolean {
  if (!state.habit_logs.length) return false;
  const last = state.habit_logs[0]?.date;
  if (!last) return false;
  const diff = (Date.now() - new Date(last).getTime()) / 86_400_000;
  return diff > 3;
}
