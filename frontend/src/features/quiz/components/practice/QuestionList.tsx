import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CancelCircleIcon,
  Tick01Icon,
  CircleDotIcon,
  CircleIcon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { Question, QuestionResult, UserAnswer } from "../../types/quiz";

export interface QuestionListProps {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  resultByQuestion: Record<string, QuestionResult>;
  currentIndex: number;
  onSelect: (index: number) => void;
}

const TYPE_LABELS: Record<string, string> = {
  meaning_choice: "개념/용어",
  context_choice: "코드 빈칸",
  collocation_choice: "키워드/구문",
  usage_choice: "코드/로직",
  short_answer: "단답형",
  sentence_answer: "코드/서술형",
};

const STATUS_LABELS: Record<string, string> = {
  correct: "정답",
  partial: "부분 정답",
  incorrect: "오답",
};

function hasAnswer(answer?: UserAnswer): boolean {
  return Boolean(answer?.choice_id) || Boolean((answer?.text_answer || "").trim());
}

function questionTypeLabel(type: string): string {
  const norm = type === "grammar_blank_choice" ? "context_choice" : type;
  return TYPE_LABELS[norm] || type;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  answers,
  resultByQuestion,
  currentIndex,
  onSelect,
}) => {
  return (
    <aside className="rounded-2xl bg-slate-50/60 p-4">
      <div className="flex items-center justify-between pb-3 px-1">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">문제 목록</h3>
          <p className="mt-0.5 text-xs text-slate-400">번호를 눌러 이동합니다.</p>
        </div>
        <HugeiconsIcon icon={Task01Icon} className="h-4.5 w-4.5 text-slate-400" />
      </div>

      <div className="space-y-1">
        {questions.map((question, index) => {
          const answer = answers[question.id] || {};
          const result = resultByQuestion[question.id];
          const active = currentIndex === index;
          const answered = hasAnswer(answer);
          const status = result?.status;

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                "grid w-full grid-cols-[28px_1fr_auto] items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                active ? "bg-white shadow-2xs font-bold" : "hover:bg-white/60",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold transition-colors",
                  active && "bg-indigo-600 text-white",
                  !active && !result && answered && "bg-emerald-600 text-white",
                  !active && !result && !answered && "bg-slate-200/70 text-slate-500",
                  status === "correct" && "bg-emerald-600 text-white",
                  status === "partial" && "bg-amber-500 text-white",
                  status === "incorrect" && "bg-rose-600 text-white",
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold text-slate-800">
                  {questionTypeLabel(question.question_type)}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
                  {status ? STATUS_LABELS[status] || status : answered ? "답변 완료" : active ? "현재" : "미답"}
                </span>
              </span>
              {status === "correct" ? (
                <HugeiconsIcon icon={Tick01Icon} className="h-4 w-4 text-emerald-600" />
              ) : status === "incorrect" ? (
                <HugeiconsIcon icon={CancelCircleIcon} className="h-4 w-4 text-rose-600" />
              ) : answered ? (
                <HugeiconsIcon icon={CircleDotIcon} className="h-4 w-4 text-emerald-600" />
              ) : (
                <HugeiconsIcon icon={CircleIcon} className="h-4 w-4 text-slate-300" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-4 mt-2 border-t border-slate-200/60 px-1 text-xs font-bold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
          정답/완료
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
          오답
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          현재
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          미답
        </span>
      </div>
    </aside>
  );
};
