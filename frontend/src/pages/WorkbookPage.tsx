import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, SparklesIcon, CheckmarkCircle01Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AppSidebar from "@/components/layout/AppSidebar";
import CodePassage from "@/features/quiz/components/practice/CodePassage";
import { useQuizStore } from "@/features/quiz/model/useQuizStore";
import type { Question } from "@/features/quiz/types/quiz";
import { cn } from "@/lib/utils";

interface WorkbookItem {
  id: string;
  title: string;
  description: string;
  category: string;
  questionCount: number;
  difficulty: string;
}

interface QuestionChoice {
  id: string;
  text: string;
}

interface QuestionItem {
  id?: string;
  prompt?: string;
  passage?: string;
  choices?: QuestionChoice[];
  correct_choice_id?: string;
  correctChoiceId?: string;
  correct_text?: string;
  explanation?: string;
  question_type?: string;
}

export const WorkbookPage: React.FC = () => {
  const navigate = useNavigate();
  const setGeneratedQuestions = useQuizStore((s) => s.setGeneratedQuestions);

  const [workbooks, setWorkbooks] = useState<WorkbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkbook, setActiveWorkbook] = useState<WorkbookItem | null>(null);
  const [tweakWithLlm, setTweakWithLlm] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);

  // Interactive local answer state for inline practice
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/v1/workbooks")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setWorkbooks(data))
      .catch((err) => console.error("Failed to load workbooks", err))
      .finally(() => setLoading(false));
  }, []);

  const loadQuestions = async (wb: WorkbookItem, tweak: boolean) => {
    setActiveWorkbook(wb);
    setFetchingQuestions(true);
    setUserAnswers({});
    setShowResults({});
    try {
      const res = await fetch(`/api/v1/workbooks/${wb.id}/questions?tweakWithLlm=${tweak}`);
      if (res.ok) {
        const json = await res.json();
        setQuestions(json.questions || []);
      }
    } catch (err) {
      console.error("Failed to fetch workbook questions", err);
    } finally {
      setFetchingQuestions(false);
    }
  };

  const startQuizPracticeSession = () => {
    if (!questions || questions.length === 0) return;
    const formattedQuestions: Question[] = questions.map((q, idx) => ({
      id: q.id || `q-${idx}`,
      question_type: q.question_type || "multiple_choice",
      difficulty: "medium",
      prompt: q.prompt || "",
      passage: q.passage,
      answer_format: q.choices && q.choices.length > 0 ? "choice" : "text",
      choices: (q.choices || []).map((c) => ({ id: c.id, text: c.text })),
    }));
    setGeneratedQuestions(formattedQuestions, "workbook_" + (activeWorkbook?.id || "custom"));
    navigate("/quiz");
  };

  const handleSelectChoice = (questionId: string, choiceId: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleTypeAnswer = (questionId: string, text: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const toggleCheckResult = (questionId: string) => {
    setShowResults((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <HugeiconsIcon icon={Book02Icon} className="h-7 w-7 text-indigo-600" />
              엄선 개발 문제집 모드
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              AI 무작위 생성 대신 정제된 정답 표준 문제집을 직접 풀고 연습할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Workbooks Grid */}
        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-slate-100 shadow-xs">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-xs font-bold text-slate-400">문제집 목록을 불러오고 있습니다...</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workbooks.map((wb) => {
              const isSelected = activeWorkbook?.id === wb.id;
              return (
                <Card
                  key={wb.id}
                  className={`rounded-2xl border p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                      : "border-slate-100 bg-white hover:bg-slate-50"
                  }`}
                  onClick={() => loadQuestions(wb, tweakWithLlm)}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge className="border-0 bg-indigo-100 text-indigo-700 font-extrabold text-xs">
                        {wb.category}
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-400">{wb.questionCount}개 문항</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 leading-snug">{wb.title}</h3>
                    <p className="mt-1.5 text-xs font-medium text-slate-600 line-clamp-2">{wb.description}</p>
                  </div>

                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-extrabold text-white hover:bg-indigo-500 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <HugeiconsIcon icon={PlayIcon} className="h-4 w-4" />
                    문제집 풀기
                  </button>
                </Card>
              );
            })}
          </div>
        )}

        {/* Selected Workbook Workspace */}
        {activeWorkbook && (
          <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <Badge className="border-0 bg-indigo-50 text-indigo-600 font-extrabold text-xs mb-1">
                  선택 문제집: {activeWorkbook.category}
                </Badge>
                <h2 className="text-xl font-black text-slate-900">{activeWorkbook.title}</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* LLM Tweak Toggle */}
                <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="block text-xs font-extrabold text-slate-900">LLM 문제 꼬기 변형</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !tweakWithLlm;
                      setTweakWithLlm(next);
                      loadQuestions(activeWorkbook, next);
                    }}
                    className={`ml-1 flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                      tweakWithLlm ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-white transition-transform ${
                        tweakWithLlm ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Main Quiz Practice Mode Launcher */}
                <button
                  type="button"
                  onClick={startQuizPracticeSession}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 text-xs font-black text-white hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-md shadow-indigo-600/20"
                >
                  <HugeiconsIcon icon={PlayIcon} className="h-4 w-4" />
                  전용 퀴즈 풀기 모드로 시작 (채점 지원)
                </button>
              </div>
            </div>

            {fetchingQuestions ? (
              <div className="p-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="mt-3 text-xs font-bold text-slate-400">
                  {tweakWithLlm ? "AI가 보기를 교묘하게 꼬아서 변형 문제를 출제하고 있습니다..." : "문제집을 준비하고 있습니다..."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const qId = q.id || `q-${idx}`;
                  const selectedUserAnswer = userAnswers[qId] || "";
                  const isRevealed = showResults[qId] === true;
                  const isChoiceType = q.choices && q.choices.length > 0;
                  const correctChoiceId = q.correct_choice_id || q.correctChoiceId || "A";
                  const isCorrect = isChoiceType
                    ? selectedUserAnswer.toUpperCase() === correctChoiceId.toUpperCase()
                    : selectedUserAnswer.trim().length > 0;

                  return (
                    <div key={qId} className="rounded-2xl bg-slate-50/80 p-5 border border-slate-200/80 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-extrabold text-xs text-white">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-indigo-600">[{q.question_type || "유형"}]</span>
                        </div>
                        {isRevealed && (
                          <Badge className={cn("border-0 text-xs font-black px-2.5 py-0.5", isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800")}>
                            {isCorrect ? "✓ 정답 확인" : "✕ 정답 확인"}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 leading-relaxed">{q.prompt}</h3>
                      {q.passage && <CodePassage passage={q.passage} isCodeType />}

                      {/* Choices or Text Answer Input */}
                      {isChoiceType ? (
                        <div className="grid gap-2.5 sm:grid-cols-2">
                          {q.choices?.map((c) => {
                            const isSelectedChoice = selectedUserAnswer === c.id;
                            const isAnswerKeyChoice = isRevealed && c.id.toUpperCase() === correctChoiceId.toUpperCase();
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => handleSelectChoice(qId, c.id)}
                                className={cn(
                                  "flex items-start gap-2.5 rounded-xl p-3.5 text-left text-xs font-bold transition-all border cursor-pointer",
                                  isAnswerKeyChoice
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20"
                                    : isSelectedChoice
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-500/20"
                                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100/80"
                                )}
                              >
                                <span className={cn("font-black rounded-lg px-2 py-0.5 text-xs shrink-0", isAnswerKeyChoice ? "bg-emerald-600 text-white" : isSelectedChoice ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700")}>
                                  {c.id}
                                </span>
                                <span className="leading-5">{c.text}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="정답 텍스트를 입력해 보세요..."
                            value={selectedUserAnswer}
                            onChange={(e) => handleTypeAnswer(qId, e.target.value)}
                            className="w-full h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-medium focus:border-indigo-500 outline-none"
                          />
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => toggleCheckResult(qId)}
                          className="flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-700"
                        >
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4" />
                          {isRevealed ? "해설 숨기기" : "정답 및 해설 확인하기"}
                        </button>
                      </div>

                      {/* Answer Explanation Box */}
                      {isRevealed && (
                        <div className="rounded-xl bg-white p-4 border border-slate-200 space-y-2 text-xs">
                          <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>💡 정답 근거 & 해설</span>
                            {isChoiceType && <span className="text-indigo-600">(정답: {correctChoiceId}번)</span>}
                          </div>
                          <p className="text-slate-600 leading-relaxed font-medium">{q.explanation || "정제된 공식 문제집 해설입니다."}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </AppSidebar>
  );
};

export default WorkbookPage;
