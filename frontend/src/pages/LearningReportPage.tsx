import React, { useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import QuizStatsPanel from "@/features/quiz/components/stats/QuizStatsPanel";
import { defaultFetchQuizStatsApi, defaultFetchSessionApi } from "@/features/quiz/api/quizApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { StatsRange } from "@/features/quiz/types/quiz";
import { todayMinus, todayString } from "@/features/quiz/utils/quizUtils";
import { useQuizStore } from "@/features/quiz/model/useQuizStore";
import { useNavigate } from "react-router-dom";

export const LearningReportPage: React.FC = () => {
  const navigate = useNavigate();
  const setSessionData = useQuizStore((s) => s.setSessionData);

  const [statsRange, setStatsRange] = useState<StatsRange>(() => ({
    preset: "week",
    startDate: todayMinus(6),
    endDate: todayString(),
  }));

  const statsQuery = useQuery({
    queryKey: ["quiz-stats", statsRange.startDate, statsRange.endDate],
    queryFn: () => defaultFetchQuizStatsApi({ startDate: statsRange.startDate, endDate: statsRange.endDate }),
    staleTime: 10_000,
  });

  const openSessionMutation = useMutation({
    mutationFn: (sessionId: string) => defaultFetchSessionApi(sessionId),
    onSuccess: (data) => {
      if (data && data.questions) {
        setSessionData(data);
        navigate("/quiz");
      }
    },
  });

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <QuizStatsPanel
          statsQuery={statsQuery}
          range={statsRange}
          onRangeChange={setStatsRange}
          onOpenSession={(sessionId) => openSessionMutation.mutate(sessionId)}
          openingSessionId={openSessionMutation.isPending ? (openSessionMutation.variables as string) : null}
        />
      </div>
    </AppSidebar>
  );
};

export default LearningReportPage;
