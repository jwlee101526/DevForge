import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { QuestionResult } from "../../types/quiz";

export interface ResultExplanationProps {
  result: QuestionResult;
}

const CHOICE_IDS = ["A", "B", "C", "D"];

const STATUS_LABELS: Record<string, string> = {
  correct: "정답",
  partial: "부분 정답",
  incorrect: "오답",
};

function resultTone(status: string): string {
  if (status === "correct") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "partial") return "border-amber-200 bg-amber-50 text-amber-800";
  if (status === "incorrect") return "border-rose-200 bg-rose-50 text-rose-800";
  return "border-slate-200 bg-white text-slate-600";
}

function formatAcceptableAnswers(answers: string[] = []): string {
  return answers.filter(Boolean).join(" 또는 ");
}

export const ResultExplanation: React.FC<ResultExplanationProps> = ({ result }) => {
  const choiceExplanationEntries = result.choice_explanations
    ? CHOICE_IDS.map((choiceId) => [choiceId, result.choice_explanations![choiceId]]).filter(
        ([, text]) => Boolean(text),
      )
    : [];

  return (
    <div className={cn("space-y-3 rounded-md border p-4", resultTone(result.status))}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={cn("rounded-md border px-2 py-1 text-xs font-black", resultTone(result.status))}>
          {STATUS_LABELS[result.status] || result.status}
        </Badge>
        {(result.correct_text || (result.acceptable_answers && result.acceptable_answers.length > 0)) && (
          <p className="text-sm font-black text-slate-950">
            정답: {result.correct_choice_id ? `${result.correct_choice_id}. ` : ""}
            {result.correct_text || formatAcceptableAnswers(result.acceptable_answers)}
          </p>
        )}
      </div>
      {(result.answer_explanation || result.explanation) && (
        <p className="text-sm font-medium leading-7 text-slate-700">
          {result.answer_explanation || result.explanation}
        </p>
      )}
      {choiceExplanationEntries.length > 0 && (
        <div className="space-y-1.5 border-t border-current/10 pt-3">
          <p className="text-xs font-black text-slate-700">선택지 해설</p>
          {choiceExplanationEntries.map(([choiceId, text]) => (
            <p key={choiceId} className="text-xs font-medium leading-6 text-slate-600">
              <span className="font-black text-slate-900">{choiceId}.</span> {text}
            </p>
          ))}
        </div>
      )}
      {result.study_note && (
        <div className="rounded-md bg-white/70 p-3 text-sm font-semibold leading-7 text-slate-700">
          {result.study_note}
        </div>
      )}
    </div>
  );
};
