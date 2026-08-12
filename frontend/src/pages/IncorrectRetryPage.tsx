import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Tick01Icon, RefreshIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AppSidebar from "@/components/layout/AppSidebar";
import CodePassage from "@/features/quiz/components/practice/CodePassage";
import { defaultFetchQuestionsApi } from "@/features/quiz/api/quizApi";
import type { QuizItem } from "@/features/quiz/types/quiz";

export const IncorrectRetryPage: React.FC = () => {
  const [incorrectItems, setIncorrectItems] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<QuizItem | null>(null);
  const [userInput, setUserInput] = useState("");
  const [retryResult, setRetryResult] = useState<{ correct: boolean; explanation: string } | null>(null);

  useEffect(() => {
    defaultFetchQuestionsApi()
      .then((res) => {
        const missed = (res.words || []).filter((item) => Number(item.incorrect_count || 0) > 0);
        setIncorrectItems(missed);
        if (missed.length > 0) setActiveItem(missed[0]);
      })
      .catch((err) => console.error("Failed to load incorrect questions", err))
      .finally(() => setLoading(false));
  }, []);

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    const targetWord = (activeItem.word || "").trim().toLowerCase();
    const isCorrect = userInput.trim().toLowerCase() === targetWord;
    setRetryResult({
      correct: isCorrect,
      explanation: isCorrect
        ? `정답입니다! '${activeItem.word}' 개념을 정확히 파악하셨습니다.`
        : `아쉽네요. 정답은 '${activeItem.word}' 입니다. (${activeItem.korean || ""})`,
    });
  };

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <HugeiconsIcon icon={RefreshIcon} className="h-7 w-7 text-rose-500" />
              오답 노트 & 다시 풀기 모드
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              과거 실수가 있었던 오답 문제들을 다시 풀며 확실한 정복을 달성하세요.
            </p>
          </div>
          <Badge className="border-0 bg-rose-50 text-rose-600 font-extrabold px-3 py-1 text-xs self-start sm:self-auto">
            오답 항목 총 {incorrectItems.length}개
          </Badge>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-slate-100 shadow-xs">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
            <p className="mt-3 text-xs font-bold text-slate-400">오답 데이터를 불러오는 중입니다...</p>
          </div>
        ) : incorrectItems.length === 0 ? (
          <Card className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xs">
            <CardContent className="p-0">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <HugeiconsIcon icon={Tick01Icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-lg font-black text-slate-900">현재 오답 항목이 없습니다!</h3>
              <p className="mt-1 text-xs text-slate-500">모든 개발 문제를 훌륭하게 완풀하셨습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Incorrect List Sidebar */}
            <Card className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 px-2">
                오답 목록 ({incorrectItems.length})
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {incorrectItems.map((item) => {
                  const isSelected = activeItem?.id === item.id;
                  const wordStr = String(item.word || "오답 문제");
                  const koreanStr = String(item.korean || "");
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveItem(item);
                        setUserInput("");
                        setRetryResult(null);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all border ${
                        isSelected
                          ? "bg-rose-50 border-rose-200 text-rose-950 font-black shadow-2xs"
                          : "bg-slate-50/70 border-slate-100 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-bold">{wordStr}</span>
                        <Badge className="border-0 bg-rose-100 text-rose-600 text-[10px] font-extrabold">
                          오답 {item.incorrect_count}회
                        </Badge>
                      </div>
                      {koreanStr && <p className="mt-1 truncate text-xs text-slate-500 font-medium">{koreanStr}</p>}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Active Question Retry Workspace */}
            {activeItem && (
              <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="border-0 bg-rose-50 text-rose-600 font-extrabold text-xs">
                      오답 다시 풀기
                    </Badge>
                    <span className="text-xs font-bold text-slate-400">태그: {String(activeItem.tag || "공통")}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 leading-snug">
                    아래 기술 개념이나 예제 지문의 정답 키워드를 입력하세요.
                  </h2>
                </div>

                {Boolean(activeItem.example) && (
                  <CodePassage passage={String(activeItem.example)} isCodeType />
                )}

                <form onSubmit={handleTestSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600">정답 키워드 입력:</label>
                    <input
                      type="text"
                      placeholder="정답 키워드 입력..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-base font-mono font-bold focus:bg-white focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!userInput.trim()}
                    className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-rose-500 disabled:opacity-40 transition-all shadow-md shadow-rose-600/20"
                  >
                    <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4" />
                    채점 및 해설 확인
                  </button>
                </form>

                {retryResult && (
                  <div
                    className={`rounded-2xl p-5 border ${
                      retryResult.correct
                        ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                        : "bg-rose-50 border-rose-200 text-rose-950"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-base">
                      <HugeiconsIcon
                        icon={retryResult.correct ? Tick01Icon : AlertCircleIcon}
                        className="h-5 w-5"
                      />
                      {retryResult.correct ? "정답입니다!" : "오답입니다"}
                    </div>
                    <p className="mt-2 text-sm font-medium leading-relaxed">{retryResult.explanation}</p>
                    {Boolean(activeItem.korean) && (
                      <p className="mt-2 text-xs font-bold text-slate-600">개념 뜻: {String(activeItem.korean)}</p>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </AppSidebar>
  );
};

export default IncorrectRetryPage;
