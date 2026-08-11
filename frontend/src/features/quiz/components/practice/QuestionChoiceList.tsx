import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { Choice, QuestionResult, UserAnswer } from "../../types/quiz";

export interface QuestionChoiceListProps {
  questionId: string;
  choices: Choice[];
  answer: UserAnswer;
  result: QuestionResult | null;
  hasGradeResult: boolean;
  chooseAnswer: (questionId: string, choiceId: string) => void;
}

export const QuestionChoiceList: React.FC<QuestionChoiceListProps> = ({
  questionId,
  choices,
  answer,
  result,
  hasGradeResult,
  chooseAnswer,
}) => {
  return (
    <div className="space-y-3">
      {choices.map((choice) => {
        const isSelected = answer.choice_id === choice.id;
        const isCorrectChoice = result?.correct_choice_id === choice.id;
        const isWrongSelected = result && isSelected && !isCorrectChoice;
        return (
          <button
            key={choice.id}
            type="button"
            onClick={() => chooseAnswer(questionId, choice.id)}
            disabled={hasGradeResult}
            className={cn(
              "grid min-h-14 w-full grid-cols-[36px_1fr_auto] items-center gap-3 rounded-md border px-4 py-3 text-left transition",
              "border-slate-200 bg-white text-slate-900 hover:border-[#14532d] hover:bg-[#f7faf5]",
              isSelected && "border-[#14532d] bg-[#f3fbf6] ring-1 ring-[#14532d]/20",
              isCorrectChoice && "border-emerald-500 bg-emerald-50",
              isWrongSelected && "border-rose-500 bg-rose-50 animate-shake",
              hasGradeResult && "cursor-default",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-black",
                isSelected
                  ? "border-[#14532d] bg-[#14532d] text-white"
                  : "border-slate-300 bg-white text-slate-700",
                isWrongSelected && "border-rose-600 bg-rose-600",
                isCorrectChoice && "border-emerald-600 bg-emerald-600",
              )}
            >
              {choice.id}
            </span>
            <span className="text-base font-semibold">{choice.text}</span>
            {isCorrectChoice ? (
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-5 w-5 text-emerald-600" />
            ) : isWrongSelected ? (
              <HugeiconsIcon icon={CancelCircleIcon} className="h-5 w-5 text-rose-600" />
            ) : isSelected ? (
              <HugeiconsIcon icon={Tick01Icon} className="h-5 w-5 text-[#14532d]" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
