import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Flag01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface QuizPracticeHeaderProps {
  safeIndex: number;
  totalQuestions: number;
  progressPercent: number;
  answeredCount?: number;
  hasGradeResult: boolean;
  onResetQuiz: () => void;
}

export const QuizPracticeHeader: React.FC<QuizPracticeHeaderProps> = ({
  safeIndex,
  totalQuestions,
  progressPercent,
  answeredCount = 0,
  hasGradeResult,
  onResetQuiz,
}) => {
  return (
    <div className="flex flex-col gap-3 pb-4 pt-1 px-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-lg font-extrabold text-slate-900">
          문제 <span className="text-2xl text-indigo-600">{safeIndex + 1}</span> / {totalQuestions}
        </h2>
        <div className="flex items-center gap-2">
          <Progress value={progressPercent} className="h-2.5 w-36 sm:w-48 bg-slate-100" />
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
            {hasGradeResult
              ? `완료 (100%)`
              : `${answeredCount}/${totalQuestions} 풀음 (${progressPercent}%)`}
          </span>
        </div>
      </div>
      {hasGradeResult && (
        <Button
          type="button"
          onClick={onResetQuiz}
          className="h-10 rounded-full bg-indigo-600 px-5 text-sm font-extrabold text-white shadow-xs hover:bg-indigo-700"
        >
          <HugeiconsIcon icon={Flag01Icon} className="h-4 w-4" />
          새 퀴즈 만들기
        </Button>
      )}
    </div>
  );
};
