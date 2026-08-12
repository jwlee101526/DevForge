import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookBookmark01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuestionResult } from "../../types/quiz";

export interface SuggestedConceptInlineProps {
  result: QuestionResult;
  questionNumber: number;
  onSaveSuggestedWord?: (result: QuestionResult) => void;
  savingWord?: string;
  savedWords?: Set<string>;
}

export const SuggestedConceptInline: React.FC<SuggestedConceptInlineProps> = ({
  result,
  questionNumber,
  onSaveSuggestedWord,
  savingWord,
  savedWords,
}) => {
  if (!result?.can_add_to_wordbook || !result?.suggested_word) return null;

  const item = result.suggested_word;
  const saved = savedWords?.has(item);
  return (
    <div className="mt-3 rounded-xl border border-indigo-200/80 bg-indigo-50/40 p-3.5">
      <div className="mb-2 flex items-center gap-2">
        <HugeiconsIcon icon={BookBookmark01Icon} className="h-4.5 w-4.5 text-indigo-600" />
        <h3 className="text-sm font-extrabold text-slate-900">복습 오답 노트 저장</h3>
        <Badge className="rounded-md bg-white text-indigo-600 hover:bg-white border border-indigo-100">
          문제 {questionNumber}
        </Badge>
      </div>
      <div className="grid gap-3 rounded-lg bg-white p-3 border border-slate-200/80 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-slate-900">{item}</p>
          <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
            {result.suggested_korean || result.target_word || "관련 기술 핵심 개념"}
          </p>
          {result.source_word && (
            <p className="mt-1 text-[11px] font-semibold text-slate-500">
              원래 문제 개념: {result.source_word}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant={saved ? "outline" : "default"}
          disabled={saved || savingWord === item}
          onClick={() => onSaveSuggestedWord?.(result)}
          className={cn(
            "h-9 rounded-lg px-4 text-xs font-extrabold shadow-xs",
            saved
              ? "border-slate-200 text-slate-500"
              : "bg-indigo-600 text-white hover:bg-indigo-700",
          )}
        >
          {saved ? "저장됨" : savingWord === item ? "저장 중..." : "오답노트 추가"}
        </Button>
      </div>
    </div>
  );
};
