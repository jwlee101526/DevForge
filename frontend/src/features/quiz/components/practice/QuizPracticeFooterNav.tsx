import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Flag01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuizPracticeFooterNavProps {
  canGoPrev: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  canSubmit: boolean;
  hasGradeResult: boolean;
  gradeLoading?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGrade: () => void;
}

export const QuizPracticeFooterNav: React.FC<QuizPracticeFooterNavProps> = ({
  canGoPrev,
  canGoNext,
  isLastQuestion,
  canSubmit,
  hasGradeResult,
  gradeLoading,
  onPrev,
  onNext,
  onGrade,
}) => {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="ghost"
        disabled={!canGoPrev}
        onClick={onPrev}
        className="h-12 rounded-xl px-6 text-base font-extrabold text-slate-700 hover:bg-white"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
        이전 문제
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {!hasGradeResult && isLastQuestion ? (
          <Button
            type="button"
            onClick={onGrade}
            disabled={!canSubmit || gradeLoading}
            className="h-12 rounded-full bg-indigo-600 px-10 text-base font-extrabold text-white shadow-xs hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400"
          >
            <HugeiconsIcon icon={Flag01Icon} className="h-4 w-4" />
            {gradeLoading ? "채점 중..." : "답안 제출"}
          </Button>
        ) : (
          <Button
            type="button"
            variant={hasGradeResult ? "ghost" : "default"}
            disabled={!canGoNext}
            onClick={onNext}
            className={cn(
              "h-12 rounded-full px-8 text-base font-extrabold shadow-xs",
              hasGradeResult
                ? "text-slate-700 hover:bg-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700",
            )}
          >
            다음 문제
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
