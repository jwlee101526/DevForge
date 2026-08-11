import { create } from "zustand";
import type { GradeResult, Question, QuizGoal, UserAnswer, UserAnswerSubmission } from "../types/quiz";
import { createInitialQuizGoal } from "../utils/quizUtils";

type SessionAnswers = Record<string, UserAnswer> | UserAnswerSubmission[] | null | undefined;

function normalizeAnswer(answer: UserAnswerSubmission): UserAnswer {
  return {
    choice_id: answer.choice_id || answer.choiceId || "",
    text_answer: answer.text_answer || answer.textAnswer || "",
  };
}

function normalizeSessionAnswers(answers: SessionAnswers): Record<string, UserAnswer> {
  if (!answers) return {};
  if (!Array.isArray(answers)) {
    return Object.entries(answers).reduce<Record<string, UserAnswer>>((acc, [questionId, answer]) => {
      acc[questionId] = normalizeAnswer(answer);
      return acc;
    }, {});
  }

  return answers.reduce<Record<string, UserAnswer>>((acc, answer) => {
    const questionId = answer.question_id || answer.questionId;
    if (!questionId) return acc;
    acc[questionId] = normalizeAnswer(answer);
    return acc;
  }, {});
}

export interface QuizStore {
  goal: QuizGoal;
  questions: Question[];
  answerToken: string;
  answers: Record<string, UserAnswer>;
  currentIndex: number;
  gradeResult: GradeResult | null;
  message: string;

  activeView: "practice" | "stats";
  setActiveView: (view: "practice" | "stats") => void;

  setGoalValue: (key: keyof QuizGoal | string, value: unknown) => void;
  chooseAnswer: (questionId: string, choiceId: string) => void;
  typeTextAnswer: (questionId: string, value: string) => void;
  setCurrentIndex: (value: number | ((prev: number) => number)) => void;
  setGeneratedQuestions: (questions: Question[], answerToken: string) => void;
  setGradeResult: (gradeResult: GradeResult | null) => void;
  setSessionData: (data: {
    questions?: Question[];
    answers?: SessionAnswers;
    grade_result?: GradeResult | null;
  }) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  goal: createInitialQuizGoal(),
  questions: [],
  answerToken: "",
  answers: {},
  currentIndex: 0,
  gradeResult: null,
  message: "",
  activeView: "practice",

  setActiveView: (view: "practice" | "stats") => set({ activeView: view }),

  setGoalValue: (key: string, value: unknown) =>
    set((state: QuizStore) => ({
      goal: { ...state.goal, [key]: value },
    })),

  chooseAnswer: (questionId: string, choiceId: string) => {
    const { gradeResult } = get();
    if (gradeResult) return;
    set((state: QuizStore) => ({
      answers: {
        ...state.answers,
        [questionId]: { choice_id: choiceId, text_answer: "" },
      },
    }));
  },

  typeTextAnswer: (questionId: string, value: string) => {
    const { gradeResult } = get();
    if (gradeResult) return;
    set((state: QuizStore) => ({
      answers: {
        ...state.answers,
        [questionId]: { choice_id: "", text_answer: value },
      },
    }));
  },

  setCurrentIndex: (value: number | ((prev: number) => number)) => {
    const { questions, currentIndex } = get();
    const maxIndex = Math.max((questions?.length || 1) - 1, 0);
    const nextIndex = typeof value === "function" ? value(currentIndex || 0) : value;
    set({ currentIndex: Math.min(Math.max(nextIndex, 0), maxIndex) });
  },

  setGeneratedQuestions: (questions: Question[], answerToken: string) =>
    set({
      questions: questions || [],
      answerToken: answerToken || "",
      answers: {},
      currentIndex: 0,
      gradeResult: null,
      message: questions?.length ? "" : "생성된 문제가 없습니다.",
    }),

  setGradeResult: (gradeResult: GradeResult | null) => set({ gradeResult, message: "" }),

  setSessionData: (data: {
    questions?: Question[];
    answers?: SessionAnswers;
    grade_result?: GradeResult | null;
  }) =>
    set({
      questions: data.questions || [],
      answers: normalizeSessionAnswers(data.answers),
      gradeResult: data.grade_result || null,
      answerToken: "",
      currentIndex: 0,
      message: "",
      activeView: "practice",
    }),

  resetQuiz: () =>
    set({
      questions: [],
      gradeResult: null,
      answers: {},
      currentIndex: 0,
      answerToken: "",
      message: "",
    }),
}));
