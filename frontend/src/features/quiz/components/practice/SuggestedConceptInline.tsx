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
    <div className="mt-3 rounded-md border border-brand-200 bg-brand-50/70 p-3">
      <div className="mb-2 flex items-center gap-2">
        <HugeiconsIcon icon={BookBookmark01Icon} className="h-4.5 w-4.5 text-brand-700" />
        <h3 className="text-sm font-black text-slate-950">복습 오답 노트 저장</h3>
        <Badge className="rounded-md bg-white text-brand-700 hover:bg-white">
          문제 {questionNumber}
        </Badge>
      </div>
      <div className="grid gap-3 rounded-md bg-white p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">{item}</p>
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
            "h-9 rounded-md px-4 text-xs font-black",
            saved
              ? "border-slate-200 text-slate-500"
              : "bg-[#0f766e] text-white hover:bg-[#0b5f59]",
          )}
        >
          {saved ? "저장됨" : savingWord === item ? "저장 중..." : "오답노트 추가"}
        </Button>
      </div>
    </div>
  );
};
