import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Level, Season } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
}

export function levelFromSeeds(seeds: number): Level {
  if (seeds >= 5000) return "Guide";
  if (seeds >= 3000) return "Radiance";
  if (seeds >= 1800) return "Fruit";
  if (seeds >= 1000) return "Bloom";
  if (seeds >= 600)  return "Leaf";
  if (seeds >= 300)  return "Sapling";
  if (seeds >= 100)  return "Sprout";
  return "Seed";
}

export function growthStateFromSeeds(seeds: number): 1 | 2 | 3 {
  if (seeds < 80) return 1;
  if (seeds < 250) return 2;
  return 3;
}

export function seasonForDate(date = new Date()): Season {
  const m = date.getMonth(); // 0..11
  if (m >= 2 && m <= 3)   return "spring";  // Mar–Apr
  if (m >= 4 && m <= 5)   return "summer";  // May–Jun
  if (m >= 6 && m <= 8)   return "monsoon"; // Jul–Sep
  if (m >= 9 && m <= 10)  return "autumn";  // Oct–Nov
  return "winter";                          // Dec–Feb
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(aIso: string, bIso: string): number {
  const a = new Date(aIso); a.setHours(0, 0, 0, 0);
  const b = new Date(bIso); b.setHours(0, 0, 0, 0);
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000);
}
