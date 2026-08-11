import { useState } from "react";
import { useQuizStore } from "../model/useQuizStore";
import type { QuestionResult, StatsRange, UserInfo } from "../types/quiz";
import { todayMinus, todayString } from "../utils/quizUtils";
import { useQuizMutations, type UseQuizMutationsOptions } from "./useQuizMutations";
import { useQuizQueries, type UseQuizQueriesOptions } from "./useQuizQueries";
import { useQuizTimer } from "./useQuizTimer";

export interface UseQuizOptions
  extends Omit<UseQuizQueriesOptions, "activeView" | "hasQuiz" | "startDate" | "endDate">,
    UseQuizMutationsOptions {
  user?: UserInfo | null;
}

function createInitialStatsRange(): StatsRange {
  return {
    preset: "week",
    startDate: todayMinus(6),
    endDate: todayString(),
  };
}

export function useQuiz(options: UseQuizOptions = {}) {
  const user = options.user ?? { id: 1, name: "Developer" };
  const [statsRange, setStatsRange] = useState<StatsRange>(createInitialStatsRange);

  // Zustand Store Selectors
  const activeView = useQuizStore((s) => s.activeView);
  const setActiveView = useQuizStore((s) => s.setActiveView);
  const goal = useQuizStore((s) => s.goal);
  const setGoalValue = useQuizStore((s) => s.setGoalValue);
  const questions = useQuizStore((s) => s.questions);
  const answerToken = useQuizStore((s) => s.answerToken);
  const answers = useQuizStore((s) => s.answers);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const setCurrentIndex = useQuizStore((s) => s.setCurrentIndex);
  const gradeResult = useQuizStore((s) => s.gradeResult);
  const message = useQuizStore((s) => s.message);
  const chooseAnswer = useQuizStore((s) => s.chooseAnswer);
  const typeTextAnswer = useQuizStore((s) => s.typeTextAnswer);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  const hasQuiz = questions.length > 0;

  // Sub-Hooks Composition
  const { labels, words, statsQuery } = useQuizQueries({
    ...options,
    user,
    activeView,
    hasQuiz,
    startDate: statsRange.startDate,
    endDate: statsRange.endDate,
  });

  const {
    generateMutation,
    gradeMutation,
    saveSuggestedConceptMutation,
    openSessionMutation,
    savedSuggestedWords,
    generationStartedAt,
    setGenerationStartedAt,
  } = useQuizMutations(options);

  const genLoading = generateMutation.isPending;
  const gradeLoading = gradeMutation.isPending;

  const { generationStep, generationElapsedSeconds } = useQuizTimer(genLoading, generationStartedAt);

  const resultByQuestion = Object.fromEntries(
    (gradeResult?.results || []).map((result) => [result.question_id, result]),
  ) as Record<string, QuestionResult>;

  const generate = () => {
    if (genLoading || gradeLoading || !user) return;
    setGenerationStartedAt(Date.now());
    generateMutation.mutate();
  };

  const grade = () => {
    if (genLoading || gradeLoading || !answerToken || !hasQuiz) return;
    gradeMutation.mutate();
  };

  const errorMessage =
    ((generateMutation.error || gradeMutation.error || openSessionMutation.error) as Error)?.message || "";

  return {
    activeView,
    setActiveView,
    goal,
    setGoalValue,
    questions,
    answers,
    chooseAnswer,
    typeTextAnswer,
    gradeResult,
    resultByQuestion,
    currentIndex: currentIndex || 0,
    setCurrentIndex,
    labels,
    words,
    statsQuery,
    statsRange,
    setStatsRange,
    generate,
    grade,
    genLoading,
    gradeLoading,
    generationStep,
    generationElapsedSeconds,
    resetQuiz,
    openSessionMutation,
    saveSuggestedConceptMutation,
    savedSuggestedWords,
    errorMessage,
    message,
    hasQuiz,
    user,
  };
}
