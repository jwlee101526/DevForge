import { useState } from "react";
import type { Question, QuestionResult, UserAnswer } from "../types/quiz";

export interface UseQuizPracticeStateProps {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  resultByQuestion: Record<string, QuestionResult>;
  currentIndex?: number;
  setCurrentIndex?: (value: number | ((prev: number) => number)) => void;
  hasGradeResult: boolean;
}

function hasAnswer(answer?: UserAnswer): boolean {
  return Boolean(answer?.choice_id) || Boolean((answer?.text_answer || "").trim());
}

export function useQuizPracticeState({
  questions,
  answers,
  resultByQuestion,
  currentIndex = 0,
  setCurrentIndex,
  hasGradeResult,
}: UseQuizPracticeStateProps) {
  const [localIndex, setLocalIndex] = useState(currentIndex || 0);
  const activeIndex = setCurrentIndex ? currentIndex : localIndex;
  const safeIndex = Math.min(Math.max(activeIndex || 0, 0), Math.max(questions.length - 1, 0));
  const question = questions[safeIndex];
  const answer = question ? answers[question.id] || {} : {};
  const result = question ? resultByQuestion[question.id] : null;

  const answeredCount = questions.filter((item) => hasAnswer(answers[item.id])).length;
  const progressPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const canGoPrev = safeIndex > 0;
  const canGoNext = safeIndex < questions.length - 1;
  const isLastQuestion = safeIndex === questions.length - 1;
  const canSubmit = answeredCount > 0 && !hasGradeResult;

  const setIndex = (value: number | ((prev: number) => number)) => {
    const nextIndex = typeof value === "function" ? value(safeIndex) : value;
    const bounded = Math.min(Math.max(nextIndex, 0), Math.max(questions.length - 1, 0));
    if (setCurrentIndex) setCurrentIndex(bounded);
    else setLocalIndex(bounded);
  };

  return {
    safeIndex,
    question,
    answer,
    result,
    progressPercent,
    canGoPrev,
    canGoNext,
    isLastQuestion,
    canSubmit,
    setIndex,
  };
}
