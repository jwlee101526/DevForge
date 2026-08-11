import React from "react";
import { Input } from "@/components/ui/input";
import type { QuestionTypeCounts } from "../../types/quiz";

export interface QuizTypeOptionSectionProps {
  questionTypeCounts: QuestionTypeCounts;
  totalQuestionCount: number;
  maxQuestionCount: number;
  setQuestionTypeCount: (key: string, value: string | number) => void;
  disabled?: boolean;
}

const QUESTION_TYPE_OPTIONS = [
  {
    key: "meaning_choice",
    label: "개념/용어 객관식",
    description: "개발 핵심 개념과 의미를 고르는 문제",
  },
  {
    key: "context_choice",
    label: "코드/문맥 빈칸 객관식",
    description: "코드 조각 빈칸에 들어갈 키워드 선택",
  },
  {
    key: "collocation_choice",
    label: "키워드/구문 조합",
    description: "올바른 메서드 및 라이브러리 구문 선택",
  },
  {
    key: "usage_choice",
    label: "올바른 코드/로직 객관식",
    description: "문맥에 적절한 실행 코드 선택",
  },
  {
    key: "short_answer",
    label: "단답형",
    description: "핵심 키워드/명령어를 직접 입력",
  },
  {
    key: "sentence_answer",
    label: "코드 작성/서술형",
    description: "목표 기술 개념을 적용한 코드/설명 작성",
  },
];

export const QuizTypeOptionSection: React.FC<QuizTypeOptionSectionProps> = ({
  questionTypeCounts,
  totalQuestionCount,
  maxQuestionCount,
  setQuestionTypeCount,
  disabled,
}) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold text-slate-600">출제 유형</p>
            <p className="mt-1 text-xs font-medium text-slate-500">유형별 문항 수를 직접 정합니다.</p>
          </div>
          <p className="text-sm font-black text-[#0f766e]">
            총 {totalQuestionCount.toLocaleString()}문항
          </p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {QUESTION_TYPE_OPTIONS.map((option) => (
            <label key={option.key} className="grid grid-cols-[minmax(0,1fr)_72px] items-center gap-3 rounded-md bg-white p-3 border border-slate-100">
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-slate-900">{option.label}</span>
                <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
                  {option.description}
                </span>
              </span>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                max={maxQuestionCount}
                value={questionTypeCounts[option.key] ?? 0}
                disabled={disabled}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuestionTypeCount(option.key, event.target.value)}
                className="h-10 rounded-md border-slate-200 bg-white text-center text-sm font-black focus-visible:ring-[#0f766e]"
                aria-label={`${option.label} 문항 수`}
              />
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs font-medium text-slate-500">
          최대 {maxQuestionCount}문항까지 생성할 수 있습니다.
        </p>
      </div>
    </div>
  );
};
