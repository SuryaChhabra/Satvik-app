"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  AggregatedInsights,
  AnalysisResult,
  BotFlow,
  BrandSettings,
  FAQ,
  Gap,
  InsightReport,
  Question,
  Template,
} from "./types";
import { buildSampleAnalyses, buildSampleQuestions, DEFAULT_SETTINGS } from "./sample-data";

export interface RunRecord {
  id: string;
  ran_at: string;
  total_questions: number;
  source: "openai" | "mock";
}

export interface StoreData {
  questions: Question[];
  analyses: AnalysisResult[];
  insights: AggregatedInsights | null;
  faqs: FAQ[];
  templates: Template[];
  gaps: Gap[];
  bot_flows: BotFlow[];
  reports: InsightReport[];
  settings: BrandSettings;
  runs: RunRecord[];
}

const STORAGE_KEY = "satvic-ri:v1";

function seed(): StoreData {
  const questions = buildSampleQuestions();
  const analyses = buildSampleAnalyses(questions);
  return {
    questions,
    analyses,
    insights: null,
    faqs: [],
    templates: [],
    gaps: [],
    bot_flows: [],
    reports: [],
    settings: DEFAULT_SETTINGS,
    runs: [
      {
        id: "run_seed",
        ran_at: new Date().toISOString(),
        total_questions: analyses.length,
        source: "mock",
      },
    ],
  };
}

function load(): StoreData {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as StoreData;
  } catch {
    return seed();
  }
}

function persist(data: StoreData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

type Listener = (data: StoreData) => void;
const listeners = new Set<Listener>();
let cache: StoreData | null = null;

function getData(): StoreData {
  if (cache) return cache;
  cache = load();
  return cache;
}

function setData(updater: (prev: StoreData) => StoreData) {
  const next = updater(getData());
  cache = next;
  persist(next);
  listeners.forEach((l) => l(next));
}

export function useStore(): [StoreData, {
  setQuestions: (q: Question[]) => void;
  addQuestions: (q: Question[]) => void;
  setAnalyses: (a: AnalysisResult[]) => void;
  appendAnalyses: (a: AnalysisResult[]) => void;
  setInsights: (i: AggregatedInsights | null) => void;
  addRun: (r: RunRecord) => void;
  saveFaqs: (f: FAQ[]) => void;
  upsertFaq: (f: FAQ) => void;
  deleteFaq: (id: string) => void;
  saveTemplates: (t: Template[]) => void;
  saveGaps: (g: Gap[]) => void;
  saveFlows: (f: BotFlow[]) => void;
  saveReport: (r: InsightReport) => void;
  saveSettings: (s: BrandSettings) => void;
  reset: () => void;
}] {
  const [data, setState] = useState<StoreData>(() => getData());

  useEffect(() => {
    const l: Listener = (d) => setState(d);
    listeners.add(l);
    setState(getData());
    return () => {
      listeners.delete(l);
    };
  }, []);

  const setQuestions = useCallback((q: Question[]) => setData((p) => ({ ...p, questions: q })), []);
  const addQuestions = useCallback(
    (q: Question[]) => setData((p) => ({ ...p, questions: [...q, ...p.questions] })),
    [],
  );
  const setAnalyses = useCallback((a: AnalysisResult[]) => setData((p) => ({ ...p, analyses: a })), []);
  const appendAnalyses = useCallback(
    (a: AnalysisResult[]) => setData((p) => ({ ...p, analyses: [...a, ...p.analyses] })),
    [],
  );
  const setInsights = useCallback((i: AggregatedInsights | null) => setData((p) => ({ ...p, insights: i })), []);
  const addRun = useCallback((r: RunRecord) => setData((p) => ({ ...p, runs: [r, ...p.runs] })), []);

  const saveFaqs = useCallback((f: FAQ[]) => setData((p) => ({ ...p, faqs: f })), []);
  const upsertFaq = useCallback(
    (f: FAQ) =>
      setData((p) => {
        const exists = p.faqs.some((x) => x.id === f.id);
        return { ...p, faqs: exists ? p.faqs.map((x) => (x.id === f.id ? f : x)) : [f, ...p.faqs] };
      }),
    [],
  );
  const deleteFaq = useCallback(
    (id: string) => setData((p) => ({ ...p, faqs: p.faqs.filter((f) => f.id !== id) })),
    [],
  );
  const saveTemplates = useCallback((t: Template[]) => setData((p) => ({ ...p, templates: t })), []);
  const saveGaps = useCallback((g: Gap[]) => setData((p) => ({ ...p, gaps: g })), []);
  const saveFlows = useCallback((f: BotFlow[]) => setData((p) => ({ ...p, bot_flows: f })), []);
  const saveReport = useCallback(
    (r: InsightReport) => setData((p) => ({ ...p, reports: [r, ...p.reports] })),
    [],
  );
  const saveSettings = useCallback((s: BrandSettings) => setData((p) => ({ ...p, settings: s })), []);
  const reset = useCallback(() => setData(() => seed()), []);

  return [
    data,
    {
      setQuestions,
      addQuestions,
      setAnalyses,
      appendAnalyses,
      setInsights,
      addRun,
      saveFaqs,
      upsertFaq,
      deleteFaq,
      saveTemplates,
      saveGaps,
      saveFlows,
      saveReport,
      saveSettings,
      reset,
    },
  ];
}
