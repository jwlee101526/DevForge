import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  defaultFetchSessionApi,
  defaultGenerateQuizApi,
  defaultGradeQuizApi,
  defaultSaveConceptApi,
} from "../api/quizApi";
import { useQuizStore } from "../model/useQuizStore";
import type {
  GradeResult,
  Question,
  QuestionResult,
  QuizGoal,
  UserAnswer,
  UserAnswerSubmission,
} from "../types/quiz";
import { DEFAULT_QUESTION_TYPE_COUNTS } from "../utils/quizUtils";

export interface UseQuizMutationsOptions {
  generateQuizApi?: (goal: QuizGoal) => Promise<{ questions: Question[]; answer_token: string }>;
  gradeQuizApi?: (
    answerToken: string,
    gradePayload: { question_id: string; choice_id: string; text_answer: string }[],
  ) => Promise<GradeResult>;
  saveConceptApi?: (result: QuestionResult) => Promise<{ success: boolean }>;
  fetchSessionApi?: (sessionId: string) => Promise<{
    questions?: Question[];
    answers?: Record<string, UserAnswer> | UserAnswerSubmission[];
    grade_result?: GradeResult | null;
  }>;
}

export function useQuizMutations({
  generateQuizApi = defaultGenerateQuizApi,
  gradeQuizApi = defaultGradeQuizApi,
  saveConceptApi = defaultSaveConceptApi,
  fetchSessionApi = defaultFetchSessionApi,
}: UseQuizMutationsOptions) {
  const queryClient = useQueryClient();
  const [savedSuggestedWords, setSavedSuggestedWords] = useState<Set<string>>(() => new Set());
  const [generationStartedAt, setGenerationStartedAt] = useState<number | null>(null);

  const goal = useQuizStore((s) => s.goal);
  const answers = useQuizStore((s) => s.answers);
  const answerToken = useQuizStore((s) => s.answerToken);
  const setGeneratedQuestions = useQuizStore((s) => s.setGeneratedQuestions);
  const setGradeResult = useQuizStore((s) => s.setGradeResult);
  const setSessionData = useQuizStore((s) => s.setSessionData);

  const generateMutation = useMutation({
    mutationFn: () => {
      const counts = Object.keys(goal.question_type_counts || {}).length
        ? goal.question_type_counts
        : DEFAULT_QUESTION_TYPE_COUNTS;
      const questionCount = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0);
      return generateQuizApi({
        ...goal,
        question_type_counts: counts,
        question_count: questionCount,
      });
    },
    onSuccess: (data) => {
      setGeneratedQuestions(data.questions, data.answer_token);
      setSavedSuggestedWords(new Set());
    },
    onSettled: () => {
      setGenerationStartedAt(null);
    },
  });

  const gradePayload = Object.entries(answers).map(([questionId, value]) => ({
    question_id: questionId,
    choice_id: value?.choice_id || "",
    text_answer: value?.text_answer || "",
  }));

  const gradeMutation = useMutation({
    mutationFn: () => gradeQuizApi(answerToken, gradePayload),
    onSuccess: (data) => {
      setGradeResult(data);
      setSavedSuggestedWords(new Set());
      queryClient.invalidateQueries({ queryKey: ["quiz-stats"] });
    },
  });

  const saveSuggestedConceptMutation = useMutation({
    mutationFn: (result: QuestionResult) => saveConceptApi(result),
    onSuccess: (_data, result) => {
      if (result.suggested_word) {
        setSavedSuggestedWords((prev) => {
          const next = new Set(prev);
          next.add(result.suggested_word!);
          return next;
        });
      }
      queryClient.invalidateQueries({ queryKey: ["quiz-items"] });
    },
  });

  const openSessionMutation = useMutation({
    mutationFn: (sessionId: string) => fetchSessionApi(sessionId),
    onSuccess: (data) => {
      setSessionData(data);
    },
  });

  return {
    generateMutation,
    gradeMutation,
    saveSuggestedConceptMutation,
    openSessionMutation,
    savedSuggestedWords,
    generationStartedAt,
    setGenerationStartedAt,
  };
}
