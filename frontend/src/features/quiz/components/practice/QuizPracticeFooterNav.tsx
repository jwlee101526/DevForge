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
    <div className="mt-6 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="outline"
        disabled={!canGoPrev}
        onClick={onPrev}
        className="h-12 rounded-md border-slate-300 px-6 text-base font-black"
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
            className="h-12 rounded-md bg-[#064e1f] px-10 text-base font-black text-white hover:bg-[#053f19] disabled:bg-slate-200 disabled:text-slate-500"
          >
            <HugeiconsIcon icon={Flag01Icon} className="h-4 w-4" />
            {gradeLoading ? "채점 중..." : "답안 제출"}
          </Button>
        ) : (
          <Button
            type="button"
            variant={hasGradeResult ? "outline" : "default"}
            disabled={!canGoNext}
            onClick={onNext}
            className={cn(
              "h-12 rounded-md px-8 text-base font-black",
              hasGradeResult
                ? "border-slate-300"
                : "bg-[#064e1f] text-white hover:bg-[#053f19]",
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
