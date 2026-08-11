import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QuizContainer } from "@/features/quiz";
import type { GradeResult, Question, QuizGoal, QuizStatsData } from "@/features/quiz/types/quiz";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock API Functions for quick testing in DevForge
const mockFetchCategories = async () => ({
  labels: ["Java", "Spring Boot", "React", "TypeScript", "Database", "CS 기초"],
});

const mockFetchQuestions = async () => ({
  words: [
    { id: "1", word: "JVM Memory Structure", tag: "Java", created_at: "2026-08-01", next_review: "2026-08-10" },
    { id: "2", word: "Spring IoC / DI", tag: "Spring Boot", created_at: "2026-08-02", next_review: "2026-08-09" },
    { id: "3", word: "React UseEffect Hook", tag: "React", created_at: "2026-08-05", next_review: "2026-08-12" },
    { id: "4", word: "Database Indexing (B-Tree)", tag: "Database", created_at: "2026-08-03", next_review: "2026-08-08" },
  ],
});

const mockFetchStats = async (): Promise<QuizStatsData> => ({
  summary: { attempt_count: 12 },
  word_stats: [
    { word: "JVM Heap vs Stack", attempt_count: 5, incorrect_count: 3, incorrect_rate: 0.6, accuracy: 0.4 },
    { word: "Spring Transaction Isolation", attempt_count: 4, incorrect_count: 2, incorrect_rate: 0.5, accuracy: 0.5 },
    { word: "React Virtual DOM", attempt_count: 3, incorrect_count: 1, incorrect_rate: 0.33, accuracy: 0.67 },
  ],
  recent_sessions: [
    { id: "sess_01", total_questions: 10, score: 8, tag: "Java", completed_at: "2026-08-09T14:20:00Z" },
    { id: "sess_02", total_questions: 5, score: 3, tag: "Database", completed_at: "2026-08-08T10:15:00Z" },
  ],
});

const mockGenerateQuiz = async (goal: QuizGoal) => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (!goal) return { questions: [], answer_token: "" };

  const mockQuestions: Question[] = [
    {
      id: "q1",
      question_type: "meaning_choice",
      difficulty: "medium",
      prompt: "다음 중 Java 가비지 컬렉션(Garbage Collection)의 G1 GC(Garbage-First GC)에 관한 설명으로 가장 올바른 것은?",
      passage: "G1 GC divide the heap into equal sized heap regions, each a contiguous range of virtual memory.",
      target_word: "G1 GC",
      answer_format: "choice",
      choices: [
        { id: "A", text: "힙 메모리를 고정 크기의 Region 단위로 분할하여 관리한다." },
        { id: "B", text: "Eden 영역이 가득 찼을 때만 힙 전체 중단(Full STW)을 유발한다." },
        { id: "C", text: "Young Generation 영역만 독립적으로 청소하며 Old 영역은 다루지 않는다." },
        { id: "D", text: "Java 8 이전 버전의 기본 가비지 컬렉터이다." },
      ],
    },
    {
      id: "q2",
      question_type: "context_choice",
      difficulty: "hard",
      prompt: "Spring Framework의 트랜잭션 관리 격리 수준(Isolation Level) 중, 다른 트랜잭션이 커밋하지 않은 수정 데이터를 읽을 수 있는 수준은?",
      passage: "@Transactional(isolation = Isolation.________)",
      target_word: "Isolation",
      answer_format: "choice",
      choices: [
        { id: "A", text: "READ_COMMITTED" },
        { id: "B", text: "READ_UNCOMMITTED" },
        { id: "C", text: "REPEATABLE_READ" },
        { id: "D", text: "SERIALIZABLE" },
      ],
    },
    {
      id: "q3",
      question_type: "short_answer",
      difficulty: "medium",
      prompt: "React에서 컴포넌트의 렌더링 성능을 최적화하기 위해 이전 렌더링 연산 결과를 재사용하도록 해주는 Hook의 이름은?",
      answer_format: "text",
      choices: [],
    },
  ];

  return {
    questions: mockQuestions,
    answer_token: "token_mock_test_12345",
  };
};

const mockGradeQuiz = async (answerToken: string, answers: unknown[]): Promise<GradeResult> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (!answerToken || !answers) return { score: 0 };

  return {
    session_id: "sess_test_999",
    score: 2,
    type_stats: {
      meaning_choice: { accuracy: 1.0, count: 1 },
      context_choice: { accuracy: 1.0, count: 1 },
      short_answer: { accuracy: 0.0, count: 1 },
    },
    results: [
      {
        question_id: "q1",
        status: "correct",
        correct_choice_id: "A",
        explanation: "G1 GC는 힙을 동일한 크기의 Region 영역으로 나누어 정리를 수행하는 방식입니다.",
      },
      {
        question_id: "q2",
        status: "correct",
        correct_choice_id: "B",
        explanation: "READ_UNCOMMITTED 수준에서는 Dirty Read 현상이 발생할 수 있습니다.",
      },
      {
        question_id: "q3",
        status: "incorrect",
        correct_text: "useMemo",
        explanation: "연산 결과값을 캐싱하는 React Hook은 useMemo입니다.",
        can_add_to_wordbook: true,
        suggested_word: "useMemo",
        suggested_korean: "React 최적화 연산 결과 캐싱 Hook",
      },
    ],
  };
};

export const QuizTestPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="text-xl font-black text-slate-900">DevForge 개발 지식 퀴즈 테스트 뷰</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Zustand + TanStack Query 연동 퀴즈 모듈 테스트 페이지입니다.
          </p>
        </header>
        <main className="mx-auto max-w-6xl py-6">
          <QuizContainer
            fetchCategoriesApi={mockFetchCategories}
            fetchQuestionsApi={mockFetchQuestions}
            fetchQuizStatsApi={mockFetchStats}
            generateQuizApi={mockGenerateQuiz}
            gradeQuizApi={mockGradeQuiz}
          />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default QuizTestPage;
