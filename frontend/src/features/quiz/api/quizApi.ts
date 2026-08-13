import type {
  GradeResult,
  Question,
  QuizGoal,
  QuizItem,
  QuizStatsData,
  UserAnswer,
  UserAnswerSubmission,
} from "../types/quiz";

import { useAuthStore } from "@/lib/authStore";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const { token } = useAuthStore.getState();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = body || res.statusText;
    try {
      const parsed = JSON.parse(body) as { message?: string; code?: string };
      message = parsed.message || parsed.code || message;
    } catch {
      // JSON이 아닌 오류 응답은 원문을 그대로 보여준다.
    }
    throw new Error(`API Error ${res.status}: ${message}`);
  }
  return res.json();
}

// === Real API implementations ===

export const defaultFetchCategoriesApi = async (): Promise<{ labels: string[] }> =>
  apiFetch("/quiz/categories");

export const defaultFetchQuestionsApi = async (): Promise<{ words: QuizItem[] }> =>
  apiFetch("/quiz/concepts");

export const defaultFetchQuizStatsApi = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): Promise<QuizStatsData> =>
  apiFetch(`/quiz/stats?start=${startDate}&end=${endDate}`);

export const defaultGenerateQuizApi = async (
  goal: QuizGoal,
): Promise<{ questions: Question[]; answer_token: string }> =>
  apiFetch("/quiz/generate", {
    method: "POST",
    body: JSON.stringify(goal),
  });

export const defaultGradeQuizApi = async (
  answerToken: string,
  gradePayload: { question_id: string; choice_id: string; text_answer: string }[],
): Promise<GradeResult> =>
  apiFetch("/quiz/grade", {
    method: "POST",
    body: JSON.stringify({
      answer_token: answerToken,
      answers: gradePayload,
    }),
  });

export const defaultSaveConceptApi = async (
  result: { suggested_word?: string; suggested_korean?: string; suggested_english_def?: string; suggested_example?: string; suggested_tag?: string },
): Promise<{ success: boolean }> =>
  apiFetch("/quiz/concepts/save", {
    method: "POST",
    body: JSON.stringify(result),
  });

export const defaultFetchSessionApi = async (
  sessionId: string,
): Promise<{
  questions?: Question[];
  answers?: Record<string, UserAnswer> | UserAnswerSubmission[];
  grade_result?: GradeResult | null;
}> => apiFetch(`/quiz/sessions/${sessionId}`);

export const defaultFetchWeaknessApi = async (): Promise<import("../types/quiz").WeaknessAnalytics> =>
  apiFetch("/quiz/weaknesses");
