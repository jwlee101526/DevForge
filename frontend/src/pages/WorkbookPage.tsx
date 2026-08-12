import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AppSidebar from "@/components/layout/AppSidebar";
import CodePassage from "@/features/quiz/components/practice/CodePassage";

interface WorkbookItem {
  id: string;
  title: string;
  description: string;
  category: string;
  questionCount: number;
  difficulty: string;
}

export const WorkbookPage: React.FC = () => {
  const [workbooks, setWorkbooks] = useState<WorkbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkbook, setActiveWorkbook] = useState<WorkbookItem | null>(null);
  const [tweakWithLlm, setTweakWithLlm] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);

  useEffect(() => {
    fetch("/api/workbooks")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setWorkbooks(data))
      .catch((err) => console.error("Failed to load workbooks", err))
      .finally(() => setLoading(false));
  }, []);

  const loadQuestions = async (wb: WorkbookItem, tweak: boolean) => {
    setActiveWorkbook(wb);
    setFetchingQuestions(true);
    try {
      const res = await fetch(`/api/workbooks/${wb.id}/questions?tweakWithLlm=${tweak}`);
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
              AI 무작위 생성 대신 정제된 정답 표준 문제집을 풀 수 있습니다. (LLM 꼬기 변형 옵션 제공)
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
                    className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-extrabold text-white hover:bg-indigo-500 transition-colors shadow-xs"
                  >
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

              {/* LLM Tweak Toggle */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <HugeiconsIcon icon={SparklesIcon} className="h-5 w-5 text-amber-500" />
                <div>
                  <span className="block text-xs font-extrabold text-slate-900">LLM 문제 꼬기/변형 옵션</span>
                  <span className="block text-[10px] text-slate-500">AI가 보기 순서와 문맥을 교묘하게 꼬아 출제</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !tweakWithLlm;
                    setTweakWithLlm(next);
                    loadQuestions(activeWorkbook, next);
                  }}
                  className={`ml-2 flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                    tweakWithLlm ? "bg-indigo-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      tweakWithLlm ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {fetchingQuestions ? (
              <div className="p-8 text-center">
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="mt-2 text-xs font-bold text-slate-400">
                  {tweakWithLlm ? "AI가 보기를 교묘하게 꼬아서 변형 문제를 만드는 중..." : "문제집을 불러오는 중..."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="rounded-2xl bg-slate-50/80 p-5 border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-extrabold text-xs text-white">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-indigo-600">[{q.question_type || "유형"}]</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-relaxed">{q.prompt}</h3>
                    {q.passage && <CodePassage passage={q.passage} isCodeType />}

                    {q.choices && q.choices.length > 0 && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.choices.map((c: any) => (
                          <div key={c.id} className="rounded-xl bg-white p-3 border border-slate-200 text-xs font-bold text-slate-800">
                            <span className="text-indigo-600 font-black mr-2">{c.id}.</span>
                            {c.text}
                          </div>
                        ))}
                      </div>
                    )}
                    {q.explanation && (
                      <div className="mt-2 text-xs font-medium text-slate-500 bg-white p-3 rounded-xl border border-slate-100">
                        💡 해설: {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </AppSidebar>
  );
};

export default WorkbookPage;
