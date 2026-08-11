import type { QuestionTypeCounts, QuizGoal, QuizItem } from "../types/quiz";

export const DEFAULT_QUESTION_TYPE_COUNTS: QuestionTypeCounts = {
  meaning_choice: 2,
  context_choice: 2,
  collocation_choice: 2,
  usage_choice: 2,
  short_answer: 1,
  sentence_answer: 1,
};

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayMinus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatLocalDate(date);
}

export function todayString(): string {
  return formatLocalDate(new Date());
}

export function createInitialQuizGoal(): QuizGoal {
  return {
    mode: "random",
    tag: "",
    scope_all: true,
    scope_tags: [],
    scope_saved_date: false,
    scope_due: false,
    saved_from: todayMinus(30),
    saved_to: todayString(),
    instruction: "",
    question_count: 10,
    question_type_counts: { ...DEFAULT_QUESTION_TYPE_COUNTS },
  };
}

export function safeDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isDue(item: QuizItem): boolean {
  const date = safeDate(item?.next_review);
  if (!date) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
}

export function isInSavedRange(item: QuizItem, fromValue?: string, toValue?: string): boolean {
  const date = safeDate(item?.created_at);
  if (!date) return false;
  const from = safeDate(fromValue);
  const to = safeDate(toValue);
  if (from) {
    from.setHours(0, 0, 0, 0);
    if (date < from) return false;
  }
  if (to) {
    to.setHours(23, 59, 59, 999);
    if (date > to) return false;
  }
  return true;
}

export function formatDate(value?: string | null): string {
  if (!value) return "-";
  return value.replaceAll("-", ".");
}

export function countByTag(items: QuizItem[], tag: string): number {
  return items.filter((item) => (item.tag || "미지정") === tag).length;
}

export function percent(value: number | string | undefined | null): number {
  return Math.round(Number(value || 0) * 100);
}

export function formatPercent(value: number | string | undefined | null): string {
  return `${percent(value)}%`;
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16).replace("T", " ");
  return `${date.toISOString().slice(0, 10)} ${date.toTimeString().slice(0, 5)}`;
}
