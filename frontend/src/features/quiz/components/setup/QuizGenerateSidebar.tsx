import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface QuizGenerateSidebarProps {
  instruction: string;
  setGoalValue: (key: string, value: unknown) => void;
  selectedItemCount: number;
  totalQuestionCount: number;
  onGenerate: () => void;
  disabled?: boolean;
  loading?: boolean;
  hasUser: boolean;
}

export const QuizGenerateSidebar: React.FC<QuizGenerateSidebarProps> = ({
  instruction,
  setGoalValue,
  selectedItemCount,
  totalQuestionCount,
  onGenerate,
  disabled,
  loading = false,
  hasUser,
}) => {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="rounded-xl bg-slate-50/70 p-3.5">
        <p className="text-xs font-bold text-slate-500">선택된 개발 문제 수</p>
        <p className="mt-1.5 text-xl font-black text-slate-900">{selectedItemCount.toLocaleString()}개</p>
      </div>
      <label className="min-w-0 space-y-1.5">
        <span className="text-xs font-bold text-slate-600">(선택) AI 문제 생성 지시사항</span>
        <Textarea
          value={instruction}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setGoalValue("instruction", event.target.value)}
          placeholder="예: Spring Boot 및 JPA 실무 면접 질문 위주로 출제해줘."
          rows={4}
          maxLength={300}
          disabled={disabled}
          className="resize-none rounded-xl border-0 bg-slate-50/70 text-sm font-medium leading-6 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
        />
        <span className="block text-right text-[11px] font-medium text-slate-400">
          {(instruction || "").length} / 300
        </span>
      </label>
      <Button
        onClick={onGenerate}
        disabled={disabled || !hasUser || totalQuestionCount === 0}
        className="h-12 w-full rounded-full bg-indigo-600 text-base font-extrabold text-white shadow-sm hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 sm:w-48 sm:self-end"
      >
        {loading ? <HugeiconsIcon icon={Loading01Icon} className="h-4 w-4 animate-spin" /> : <HugeiconsIcon icon={Tick01Icon} className="h-4 w-4" />}
        {loading ? "생성 중..." : "퀴즈 시작"}
      </Button>
    </div>
  );
};
