export type Goal =
  | "beginner"
  | "digestion"
  | "weight_balance"
  | "family"
  | "seasonal"
  | "busy"
  | "deep_practice";

export type PathId =
  | "gentle_beginner"
  | "digestion_support"
  | "weight_balance"
  | "family_satvic"
  | "seasonal_wellness"
  | "busy_lifestyle"
  | "deep_practice";

export type Level =
  | "Seed"
  | "Sprout"
  | "Sapling"
  | "Leaf"
  | "Bloom"
  | "Fruit"
  | "Radiance"
  | "Guide";

export type Season = "spring" | "summer" | "monsoon" | "autumn" | "winter";

export interface QuizAnswers {
  goal?: Goal;
  familiarity?: "new" | "some" | "follows" | "program";
  struggle?: "start" | "stick" | "energy" | "info_overload" | "family";
  time_minutes?: 5 | 15 | 30 | 60;
  learning?: "video" | "read" | "recipe" | "audio";
  family_size?: 1 | 2 | 3 | 4;
  notification_time?: "morning" | "midday" | "evening" | "night" | "none";
  ready_for_challenge?: "three" | "seven" | "later";
}

export interface UserProfile {
  display_name: string;
  city?: string;
  language: "en";
  current_path: PathId | null;
  notification_time: string;     // human-readable: "morning" | "evening" ...
  lite_mode: boolean;
  created_at: string;
}

export interface DailyHabit {
  day_index: number;             // 1..7
  title: string;                 // "Drink one glass of warm water"
  lesson_title: string;
  lesson_body: string;           // 1-paragraph lesson
  estimated_minutes: number;
  recipe_id?: string;
  next_preview: string;
}

export interface HabitLog {
  day_index: number;
  date: string;
  status: "done" | "skipped";
  reflection?: "easy" | "okay" | "hard";
}

export interface BadgeDef {
  id: string;
  emoji: string;
  title: string;
  description: string;
  earn_condition: string;
}

export interface ChallengeDef {
  id: string;
  title: string;
  duration_days: 3 | 7 | 21;
  category: "starter" | "seasonal" | "festival" | "family" | "recipe";
  target_path?: PathId;
  daily_structure: string[];     // headlines for each day
  badge_id: string;
  garden_unlock: string;         // species
  notification_example: string;
  next_recommended: string;
}

export interface ChallengeProgress {
  id: string;
  started_at: string;
  current_day: number;
  completed_at?: string;
}

export type PlantSpecies =
  | "tulsi"
  | "mint"
  | "lemon"
  | "mango"
  | "coconut"
  | "marigold"
  | "pomegranate"
  | "lotus"
  | "tree_family"
  | "jowar"
  | "spice";

export interface Plant {
  id: string;
  species: PlantSpecies;
  reason: string;       // "Day 1 — warm water" | "Summer Cooling Challenge"
  planted_at: string;
}

export interface GardenState {
  growth_state: 1 | 2 | 3;  // sparse / growing / lush
  season: Season;
  plants: Plant[];
  last_visited_at: string;
  rain_until?: string;       // soft return animation timer
}

export interface UserState {
  profile: UserProfile;
  quiz_answers: QuizAnswers;
  seeds: number;
  level: Level;
  rhythm_days_this_week: number;
  grace_used_this_week: boolean;
  last_active_at: string;
  habit_logs: HabitLog[];
  earned_badges: string[];
  active_challenges: ChallengeProgress[];
  completed_challenges: ChallengeProgress[];
  saved_recipes: string[];
  garden: GardenState;
}

export interface PathDef {
  id: PathId;
  name: string;
  emoji: string;
  tagline: string;
  rationale: string;
  emotional_tone: string;
  days: DailyHabit[];          // 7 days
  starter_badge: string;
  starter_plant: PlantSpecies;
  example_notification: string;
}
