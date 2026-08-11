import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { QuizStatsData, StatsRange } from "../../types/quiz";
import { percent } from "../../utils/quizUtils";
import { HighIncorrectRateConceptsChart } from "./HighIncorrectRateConceptsChart";
import { MostMissedConceptsChart } from "./MostMissedConceptsChart";
import { RecentQuizHistory } from "./RecentQuizHistory";
import { ReportHeader } from "./ReportHeader";

export interface QuizStatsPanelProps {
  statsQuery?: {
    data?: QuizStatsData;
    isPending?: boolean;
    isFetching?: boolean;
    error?: Error | null;
  };
  range: StatsRange;
  onRangeChange?: (range: StatsRange) => void;
  onOpenSession?: (sessionId: string) => void;
  openingSessionId?: string | null;
}

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description, children }) => (
  <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4">
      <h3 className="text-base font-black text-slate-950">{title}</h3>
      {description && <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>}
    </div>
    <CardContent className="p-5">{children}</CardContent>
  </Card>
);

export const QuizStatsPanel: React.FC<QuizStatsPanelProps> = ({
  statsQuery,
  range,
  onRangeChange,
  onOpenSession,
  openingSessionId,
}) => {
  const data = statsQuery?.data || {};
  const summary = data.summary || {};
  const wordStats = data.word_stats || [];
  const recentSessions = data.recent_sessions || [];
  const hasStats = Number(summary.attempt_count || 0) > 0;

  if (statsQuery?.isPending) {
    return (
      <div className="animate-fadeIn space-y-5">
        <ReportHeader range={range} onRangeChange={onRangeChange} loading />
        <div className="flex justify-center rounded-lg border border-slate-200 bg-white p-8">
          <span className="text-sm font-medium text-slate-500">학습 통계를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (statsQuery?.error) {
    return (
      <div className="animate-fadeIn space-y-5">
        <ReportHeader range={range} onRangeChange={onRangeChange} loading={statsQuery.isFetching} />
        <div className="rounded-lg border border-rose-200 bg-rose-50/70 px-4 py-3 text-xs font-semibold text-rose-700">
          {statsQuery.error.message}
        </div>
      </div>
    );
  }

  if (!hasStats) {
    return (
      <div className="animate-fadeIn space-y-5">
        <ReportHeader range={range} onRangeChange={onRangeChange} loading={statsQuery?.isFetching} />
        <Card className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <h3 className="text-base font-black text-slate-900">선택한 기간의 학습 통계가 없습니다</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">기간을 넓히거나 퀴즈를 풀고 채점하면 풀이 데이터를 볼 수 있습니다.</p>
        </Card>
      </div>
    );
  }

  const priorityConcepts = [...wordStats]
    .filter((item) => Number(item.attempt_count || 0) > 0)
    .sort((a, b) => {
      const aIncorrect = Number(a.incorrect_count || 0);
      const bIncorrect = Number(b.incorrect_count || 0);
      if (bIncorrect !== aIncorrect) return bIncorrect - aIncorrect;
      return Number(a.accuracy || 0) - Number(b.accuracy || 0);
    });

  const missedConceptChartData = priorityConcepts
    .filter((item) => Number(item.incorrect_count || 0) > 0)
    .slice(0, 8)
    .map((item) => ({
      word: item.word || item.concept || "-",
      incorrect: Number(item.incorrect_count || 0),
    }));

  const highIncorrectRateData = [...wordStats]
    .filter((item) => Number(item.attempt_count || 0) > 0 && Number(item.incorrect_count || 0) > 0)
    .sort((a, b) => Number(b.incorrect_rate || 0) - Number(a.incorrect_rate || 0))
    .slice(0, 12)
    .map((item) => ({
      word: item.word || item.concept || "-",
      attempts: Number(item.attempt_count || 0),
      incorrect: Number(item.incorrect_count || 0),
      incorrectRate: percent(item.incorrect_rate),
    }));

  return (
    <div className="animate-fadeIn space-y-5">
      <ReportHeader range={range} onRangeChange={onRangeChange} loading={statsQuery?.isFetching} />

      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="가장 많이 틀린 기술 개념" description="오답 횟수가 높은 기술 문제 항목입니다.">
          <MostMissedConceptsChart data={missedConceptChartData} />
        </ChartCard>
        <ChartCard title="오답률 높은 개념 항목" description="풀이 횟수 대비 자주 틀리는 문제 항목입니다.">
          <HighIncorrectRateConceptsChart data={highIncorrectRateData} />
        </ChartCard>
      </div>

      <RecentQuizHistory
        sessions={recentSessions}
        onOpenSession={onOpenSession}
        openingSessionId={openingSessionId}
      />
    </div>
  );
};
export default QuizStatsPanel;
