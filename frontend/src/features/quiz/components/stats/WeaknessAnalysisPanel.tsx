import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Target01Icon, ZapIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { defaultFetchWeaknessApi } from "../../api/quizApi";
import type { WeaknessAnalytics } from "../../types/quiz";

export interface WeaknessAnalysisPanelProps {
  onGenerateWeaknessQuiz?: (keywords: string[]) => void;
}

export const WeaknessAnalysisPanel: React.FC<WeaknessAnalysisPanelProps> = ({
  onGenerateWeaknessQuiz,
}) => {
  const [data, setData] = useState<WeaknessAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    defaultFetchWeaknessApi()
      .then((res) => setData(res))
      .catch((err) => console.error("Failed to fetch weakness analytics", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center border border-slate-100 shadow-xs">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        <p className="mt-3 text-xs font-bold text-slate-400">오답 및 약점 데이터를 분석하고 있습니다...</p>
      </div>
    );
  }

  if (!data || (data.frequentIncorrectConcepts.length === 0 && data.weakQuestionTypes.length === 0)) {
    return (
      <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
        <CardContent className="p-0 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <HugeiconsIcon icon={Target01Icon} className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-extrabold text-slate-900">아직 수집된 약점 데이터가 없습니다</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">
            퀴즈를 풀고 채점을 진행하면 틀린 문제 유형과 자주 틀리는 오답 개념이 자동으로 분석됩니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="border-0 bg-rose-500/20 text-rose-300 font-extrabold px-3 py-1 text-xs">
              AI 약점 분석
            </Badge>
            <span className="text-xs font-bold text-slate-400">
              총 {data.totalAttemptedCount}문제 중 {data.totalIncorrectCount}문제 오답
            </span>
          </div>
          <h3 className="mt-2 text-xl font-black tracking-tight">
            전체 오답률: <span className="text-rose-400">{(data.overallIncorrectRate * 100).toFixed(1)}%</span>
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            자주 틀린 키워드를 집중 학습하여 빠르게 학습 공백을 메울 수 있습니다.
          </p>
        </div>

        {onGenerateWeaknessQuiz && data.recommendedReviewKeywords.length > 0 && (
          <button
            type="button"
            onClick={() => onGenerateWeaknessQuiz(data.recommendedReviewKeywords)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap"
          >
            <HugeiconsIcon icon={ZapIcon} className="h-4 w-4" />
            약점 집중 맞춤 퀴즈 생성
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top 10 Weak Concepts */}
        <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={AlertCircleIcon} className="h-5 w-5 text-rose-500" />
              <h4 className="text-base font-extrabold text-slate-900">자주 틀리는 개념 키워드</h4>
            </div>
            <span className="text-xs font-bold text-slate-400">Top {data.frequentIncorrectConcepts.length}</span>
          </div>
          <div className="mt-4 space-y-3">
            {data.frequentIncorrectConcepts.map((item) => (
              <div
                key={item.word}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100/80"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900 truncate">{item.word}</span>
                    {item.tag && (
                      <Badge className="border-0 bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400 truncate">{item.korean}</p>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black text-rose-600">
                    오답 {item.incorrectCount}회 / 시도 {item.attemptCount}회
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    오답률 {(item.incorrectRate * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weak Question Types & Categories */}
        <Card className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Target01Icon} className="h-5 w-5 text-indigo-600" />
              <h4 className="text-base font-extrabold text-slate-900">취약 분야 & 문제 유형</h4>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {data.weakQuestionTypes.map((typeItem) => {
              const ratePct = Math.round(typeItem.incorrectRate * 100);
              return (
                <div key={typeItem.questionType} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{typeItem.label}</span>
                    <span className="font-black text-slate-600">
                      오답률 <strong className="text-rose-600 font-black">{ratePct}%</strong> ({typeItem.incorrectCount}/{typeItem.count})
                    </span>
                  </div>
                  <Progress value={ratePct} className="h-2 bg-slate-100" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WeaknessAnalysisPanel;
