import React from "react";
import { Calendar01Icon, Layers01Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import type { QuizGoal, QuizItem } from "../../types/quiz";
import { formatDate } from "../../utils/quizUtils";
import { ScopeRow } from "./ScopeRow";
import { SetupSection } from "./SetupSection";

export interface QuizScopeSectionProps {
  goal: QuizGoal;
  setGoalValue: (key: string, value: unknown) => void;
  totalItems: number;
  dueItems: QuizItem[];
  rangeItems: QuizItem[];
  selectedTags: string[];
  visibleLabels: string[];
  countByTag: (tag: string) => number;
  updateScope: (patch: Partial<QuizGoal>) => void;
  toggleTag: (label: string) => void;
  disabled?: boolean;
}

export const QuizScopeSection: React.FC<QuizScopeSectionProps> = ({
  goal,
  setGoalValue,
  totalItems,
  dueItems,
  rangeItems,
  selectedTags,
  visibleLabels,
  countByTag,
  updateScope,
  toggleTag,
  disabled,
}) => {
  return (
    <>
      <SetupSection icon={Layers01Icon} title="기본 범위" meta="선택 시 세부 범위는 비활성화됩니다">
        <ScopeRow
          checked={Boolean(goal.scope_all)}
          title="전체 개발 지식 랜덤"
          description="카테고리와 기간 제한 없이 전체 문제에서 출제"
          count={totalItems}
          onClick={() => updateScope({ scope_all: !goal.scope_all })}
          disabled={disabled}
        />
      </SetupSection>

      <SetupSection
        icon={Tag01Icon}
        title="기술 스택 / 태그별 선택"
        meta={selectedTags.length > 0 ? `${selectedTags.length}개 태그 선택` : "등록된 기술 태그에서 선택"}
      >
        {visibleLabels.length === 0 ? (
          <div className="px-3 py-4 text-sm font-medium text-slate-500">
            아직 등록된 기술 태그가 없습니다.
          </div>
        ) : (
          visibleLabels.map((label) => (
            <ScopeRow
              key={label}
              checked={selectedTags.includes(label)}
              title={label}
              description="해당 기술 스택에서 문제 출제"
              count={countByTag(label)}
              onClick={() => toggleTag(label)}
              disabled={disabled}
            />
          ))
        )}
      </SetupSection>

      <SetupSection
        icon={Calendar01Icon}
        title="복습 예정 및 추가 기간"
        meta={goal.scope_saved_date ? `${formatDate(goal.saved_from)} - ${formatDate(goal.saved_to)}` : "기간 기준 선택"}
      >
        <ScopeRow
          checked={Boolean(goal.scope_saved_date)}
          title="등록 기간으로 출제"
          description={`${formatDate(goal.saved_from)}부터 ${formatDate(goal.saved_to)}까지 등록/학습한 문제`}
          count={rangeItems.length}
          onClick={() => updateScope({ scope_saved_date: !goal.scope_saved_date })}
          disabled={disabled}
        />
        <div className="grid gap-3 rounded-md bg-slate-50/70 px-3 py-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500">시작일</span>
            <Input
              type="date"
              value={goal.saved_from}
              disabled={disabled}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateScope({ scope_saved_date: true });
                setGoalValue("saved_from", event.target.value);
              }}
              className="h-9 rounded-md border-slate-200 bg-white text-sm font-semibold focus-visible:ring-[#0f766e]"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500">종료일</span>
            <Input
              type="date"
              value={goal.saved_to}
              disabled={disabled}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateScope({ scope_saved_date: true });
                setGoalValue("saved_to", event.target.value);
              }}
              className="h-9 rounded-md border-slate-200 bg-white text-sm font-semibold focus-visible:ring-[#0f766e]"
            />
          </label>
        </div>
        <ScopeRow
          checked={Boolean(goal.scope_due)}
          title="오늘 복습 예정 문제"
          description="복습 주기가 도래하거나 오답이 있었던 개발 문제 포함"
          count={dueItems.length}
          onClick={() => updateScope({ scope_due: !goal.scope_due })}
          disabled={disabled}
        />
      </SetupSection>
    </>
  );
};
