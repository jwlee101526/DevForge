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
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {QUESTION_TYPE_OPTIONS.map((option) => {
            const currentVal = questionTypeCounts[option.key] ?? 0;
            return (
              <div
                key={option.key}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50/90 p-3.5 border border-slate-100"
              >
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-900">{option.label}</span>
                  <span className="mt-0.5 block truncate text-xs font-medium text-slate-400">
                    {option.description}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-2xs border border-slate-200/80">
                  <button
                    type="button"
                    disabled={disabled || currentVal <= 0}
                    onClick={() => setQuestionTypeCount(option.key, Math.max(0, currentVal - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-base font-bold text-slate-700 hover:bg-slate-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-transform"
                    aria-label={`${option.label} 1개 감소`}
                  >
                    -
                  </button>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={currentVal === 0 ? "0" : currentVal}
                    disabled={disabled}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setQuestionTypeCount(option.key, event.target.value)
                    }
                    className="h-8 w-10 border-0 p-0 text-center text-sm font-extrabold text-slate-900 focus-visible:ring-0 focus-visible:bg-indigo-50/50 rounded"
                    aria-label={`${option.label} 문항 수`}
                  />
                  <button
                    type="button"
                    disabled={disabled || totalQuestionCount >= maxQuestionCount}
                    onClick={() => setQuestionTypeCount(option.key, currentVal + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50 text-base font-bold text-indigo-600 hover:bg-indigo-100 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-transform"
                    aria-label={`${option.label} 1개 증가`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2.5 text-xs text-slate-400">
          최대 {maxQuestionCount}문항까지 생성할 수 있습니다.
        </p>
      </div>
    </div>
  );
};
