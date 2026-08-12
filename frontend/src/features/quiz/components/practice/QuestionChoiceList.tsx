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
    <div className="space-y-2.5">
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
              "grid min-h-14 w-full grid-cols-[36px_1fr_auto] items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all",
              "bg-slate-50/80 text-slate-900 hover:bg-indigo-50/50",
              isSelected && "bg-indigo-50 text-indigo-950 font-bold shadow-xs",
              isCorrectChoice && "bg-emerald-50 text-emerald-950 font-bold",
              isWrongSelected && "bg-rose-50 text-rose-950 font-bold animate-shake",
              hasGradeResult && "cursor-default",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold transition-colors",
                isSelected
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-700 shadow-2xs",
                isWrongSelected && "bg-rose-600 text-white",
                isCorrectChoice && "bg-emerald-600 text-white",
              )}
            >
              {choice.id}
            </span>
            <span className="text-base font-medium text-slate-900 leading-snug">{choice.text}</span>
            {isCorrectChoice ? (
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-5 w-5 text-emerald-600" />
            ) : isWrongSelected ? (
              <HugeiconsIcon icon={CancelCircleIcon} className="h-5 w-5 text-rose-600" />
            ) : isSelected ? (
              <HugeiconsIcon icon={Tick01Icon} className="h-5 w-5 text-indigo-600" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
