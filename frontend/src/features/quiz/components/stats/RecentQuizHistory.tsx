import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";
import type { QuizSessionSummary } from "../../types/quiz";
import { formatDateTime } from "../../utils/quizUtils";

export interface RecentQuizHistoryProps {
  sessions: QuizSessionSummary[];
  onOpenSession?: (sessionId: string) => void;
  openingSessionId?: string | null;
}

export const RecentQuizHistory: React.FC<RecentQuizHistoryProps> = ({
  sessions,
  onOpenSession,
  openingSessionId,
}) => {
  if (!sessions.length) {
    return (
      <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5 text-sm font-medium text-slate-500">
          최근 완료한 개발 지식 퀴즈 기록이 없습니다.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-black text-slate-950">최근 퀴즈 히스토리</h3>
      </div>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {sessions.map((session) => {
            const total = Number(session.total_questions || session.question_count || 0);
            const score = Number(session.score || 0);
            const accuracy = total ? Math.round((score / total) * 100) : 0;
            const completedAt = session.completed_at || session.created_at;
            const title = `${formatDateTime(completedAt)} 퀴즈`;
            return (
              <button
                key={session.id}
                type="button"
                onClick={() => onOpenSession?.(session.id)}
                className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-[#fbfaf5] sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <div>
                  <p className="text-sm font-black text-slate-950">
                    {title}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {session.tag ? `${session.tag} · ` : ""}{total || "-"}문항 완료
                  </p>
                </div>
                <span className="text-sm font-bold text-slate-600">
                  {score.toFixed(1)} / {total || "-"}
                </span>
                <span className="flex items-center justify-end gap-2">
                  {openingSessionId === session.id && (
                    <HugeiconsIcon icon={Loading01Icon} className="h-4 w-4 animate-spin text-slate-400" />
                  )}
                  <span className="text-lg font-black text-slate-800">{accuracy}%</span>
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
