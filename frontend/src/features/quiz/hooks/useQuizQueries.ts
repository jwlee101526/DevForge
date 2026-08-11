import { useQuery } from "@tanstack/react-query";
import {
  defaultFetchCategoriesApi,
  defaultFetchQuestionsApi,
  defaultFetchQuizStatsApi,
} from "../api/quizApi";
import type { QuizItem, QuizStatsData, UserInfo } from "../types/quiz";

export interface UseQuizQueriesOptions {
  fetchCategoriesApi?: () => Promise<{ labels: string[] }>;
  fetchQuestionsApi?: () => Promise<{ words: QuizItem[] }>;
  fetchQuizStatsApi?: (params: { startDate: string; endDate: string }) => Promise<QuizStatsData>;
  user?: UserInfo | null;
  activeView: "practice" | "stats";
  hasQuiz: boolean;
  startDate: string;
  endDate: string;
}

export function useQuizQueries({
  fetchCategoriesApi = defaultFetchCategoriesApi,
  fetchQuestionsApi = defaultFetchQuestionsApi,
  fetchQuizStatsApi = defaultFetchQuizStatsApi,
  user,
  activeView,
  hasQuiz,
  startDate,
  endDate,
}: UseQuizQueriesOptions) {
  const labelsQuery = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: fetchCategoriesApi,
    enabled: Boolean(user),
    staleTime: 5 * 60_000,
  });

  const wordsQuery = useQuery({
    queryKey: ["quiz-items"],
    queryFn: fetchQuestionsApi,
    enabled: Boolean(user) && activeView === "practice" && !hasQuiz,
    staleTime: 30_000,
  });

  const statsQuery = useQuery({
    queryKey: ["quiz-stats", startDate, endDate],
    queryFn: () => fetchQuizStatsApi({ startDate, endDate }),
    enabled: Boolean(user) && activeView === "stats",
    staleTime: 30_000,
  });

  return {
    labels: labelsQuery.data?.labels || [],
    words: wordsQuery.data?.words || [],
    statsQuery,
  };
}
