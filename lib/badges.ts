import type { BadgeDef } from "./types";

export const BADGES: BadgeDef[] = [
  { id: "gentle_starter",       emoji: "🌱", title: "Gentle Starter",       description: "Completed your very first Satvic habit.",                earn_condition: "Complete Day 1." },
  { id: "first_sip",            emoji: "💧", title: "First Sip",            description: "Your first warm-water habit.",                          earn_condition: "Complete a hydration habit." },
  { id: "early_dinner_explorer",emoji: "🌙", title: "Early Dinner Explorer",description: "Three early dinners in a row.",                         earn_condition: "Three early dinners." },
  { id: "mindful_eater",        emoji: "🍃", title: "Mindful Eater",        description: "A week of slow, awareness-led eating.",                  earn_condition: "Seven mindful-eating habits." },
  { id: "hydration_hero",       emoji: "💧", title: "Hydration Hero",       description: "Seven days of intentional hydration.",                   earn_condition: "Seven hydration habits." },
  { id: "family_wellness_starter", emoji: "👨‍👩‍👧", title: "Family Wellness Starter", description: "Your first Satvic family swap.",          earn_condition: "Complete a family habit." },
  { id: "seasonal_eater",       emoji: "☀️", title: "Seasonal Eater",       description: "Tuned in to the current ritu.",                          earn_condition: "Complete a seasonal habit." },
  { id: "recipe_explorer",      emoji: "🍲", title: "Recipe Explorer",      description: "Tried five Satvic recipes.",                             earn_condition: "Five recipes tried." },
  { id: "seven_day_rhythm",     emoji: "🌳", title: "7-Day Satvic Rhythm",  description: "Completed your first 7-day journey.",                    earn_condition: "Finish 7-day path." },
  { id: "sangha_seedling",      emoji: "🌿", title: "Sangha Seedling",      description: "Shared a Satvic tip with someone.",                      earn_condition: "Invite or share." },
  { id: "quiet_returner",       emoji: "🌾", title: "Quiet Returner",       description: "Came back after a soft pause. No judgement.",            earn_condition: "Return after 5+ days." },
];

export const BADGE_MAP: Record<string, BadgeDef> = Object.fromEntries(BADGES.map((b) => [b.id, b]));
