import React from "react";
import { Input } from "@/components/ui/input";

export interface QuizTypeOptionSectionProps {
  questionTypeCounts: Record<string, number>;
  totalQuestionCount: number;
  maxQuestionCount: number;
  setQuestionTypeCount: (key: string, value: unknown) => void;
  disabled?: boolean;
}

const QUESTION_TYPE_OPTIONS = [
  {
    key: "meaning_choice",
    label: "개념 정의 사지선다",
    description: "용어 뜻 맞히기",
  },
  {
    key: "context_choice",
    label: "코드 빈칸 사지선다",
    description: "문맥에 맞는 개념 채우기",
  },
  {
    key: "collocation_choice",
    label: "키워드/조합 사지선다",
    description: "함께 쓰이는 관련 기술/개념 조합",
  },
  {
    key: "usage_choice",
    label: "실무 활용 사지선다",
    description: "실제 구현 방식 및 사용법 선택",
  },
  {
    key: "short_answer",
    label: "단답형 주관식",
    description: "명령어/키워드 직접 입력",
  },
  {
    key: "sentence_answer",
    label: "코드/서술형 주관식",
    description: "로직/기술 설명 서술",
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
            <p className="text-xs font-bold text-slate-600">출제 유형</p>
            <p className="mt-0.5 text-xs text-slate-400">유형별 문항 수를 직접 정합니다.</p>
          </div>
          <p className="text-sm font-extrabold text-indigo-600">
            총 {totalQuestionCount.toLocaleString()}문항
          </p>
        </div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {QUESTION_TYPE_OPTIONS.map((option) => (
            <label key={option.key} className="grid grid-cols-[minmax(0,1fr)_68px] items-center gap-3 rounded-xl bg-slate-50/70 p-3.5">
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-900">{option.label}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-400">
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
                className="h-10 rounded-lg border-0 bg-white text-center text-sm font-extrabold shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                aria-label={`${option.label} 문항 수`}
              />
            </label>
          ))}
        </div>
        <p className="mt-2.5 text-xs text-slate-400">
          최대 {maxQuestionCount}문항까지 생성할 수 있습니다.
        </p>
      </div>
    </div>
  );
};
