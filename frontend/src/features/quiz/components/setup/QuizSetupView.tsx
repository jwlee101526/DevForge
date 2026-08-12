import React from "react";
import { Tick01Icon } from "@hugeicons/core-free-icons";
import { Card, CardContent } from "@/components/ui/card";
import type { QuizGoal, QuizItem, UserInfo } from "../../types/quiz";
import { QuizGenerateSidebar } from "./QuizGenerateSidebar";
import { QuizLoadingOverlay } from "./QuizLoadingOverlay";
import { QuizScopeSection } from "./QuizScopeSection";
import { QuizTypeOptionSection } from "./QuizTypeOptionSection";
import { SetupSection } from "./SetupSection";
import { useQuizSetupState } from "../../hooks/useQuizSetupState";

export interface QuizSetupViewProps {
  goal: QuizGoal;
  setGoalValue: (key: string, value: unknown) => void;
  labels?: string[];
  words?: QuizItem[];
  onGenerate: () => void;
  disabled?: boolean;
  loading?: boolean;
  generationStep?: number;
  generationElapsedSeconds?: number;
  user?: UserInfo | null;
}

const MAX_QUESTION_COUNT = 10;

export const QuizSetupView: React.FC<QuizSetupViewProps> = ({
  goal,
  setGoalValue,
  labels = [],
  words = [],
  onGenerate,
  disabled,
  loading = false,
  generationStep = 0,
  generationElapsedSeconds = 0,
  user,
}) => {
  const {
    totalItems,
    dueItems,
    rangeItems,
    selectedTags,
    selectedItemCount,
    visibleLabels,
    updateScope,
    toggleTag,
    questionTypeCounts,
    totalQuestionCount,
    setQuestionTypeCount,
    countByTag,
  } = useQuizSetupState({ goal, setGoalValue, labels, words });

  const controlsDisabled = Boolean(disabled || loading);

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">개발 지식 퀴즈 설정</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          학습 범위(기술 카테고리)와 문항 수를 선택하면 AI가 맞춤형 개발 퀴즈를 생성합니다.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50/60 p-2 sm:p-4">
        <Card className="rounded-xl border-0 bg-transparent shadow-none">
          <CardContent className="space-y-6 p-2 sm:p-4">
            <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">학습 범위</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  퀴즈에 포함할 개발 문제 범위를 선택하세요.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="block text-xs font-bold text-slate-400">선택된 항목 수</span>
                <strong className="text-2xl font-black text-indigo-600">
                  {selectedItemCount.toLocaleString()}개
                </strong>
                <span className="ml-1 text-sm font-bold text-slate-400">/ {totalItems.toLocaleString()}개</span>
              </div>
            </div>

            <QuizScopeSection
              goal={goal}
              setGoalValue={setGoalValue}
              totalItems={totalItems}
              dueItems={dueItems}
              rangeItems={rangeItems}
              selectedTags={selectedTags}
              visibleLabels={visibleLabels}
              countByTag={countByTag}
              updateScope={updateScope}
              toggleTag={toggleTag}
              disabled={controlsDisabled}
            />

            <SetupSection icon={Tick01Icon} title="문제 생성 옵션">
              <div className="relative grid gap-5 p-2 lg:grid-cols-[minmax(0,1fr)_320px]">
                {loading && (
                  <QuizLoadingOverlay
                    activeStep={generationStep}
                    totalQuestionCount={totalQuestionCount}
                    elapsedSeconds={generationElapsedSeconds}
                  />
                )}
                <QuizTypeOptionSection
                  questionTypeCounts={questionTypeCounts}
                  totalQuestionCount={totalQuestionCount}
                  maxQuestionCount={MAX_QUESTION_COUNT}
                  setQuestionTypeCount={setQuestionTypeCount}
                  disabled={controlsDisabled}
                />
                <QuizGenerateSidebar
                  instruction={goal.instruction}
                  setGoalValue={setGoalValue}
                  selectedItemCount={selectedItemCount}
                  totalQuestionCount={totalQuestionCount}
                  onGenerate={onGenerate}
                  disabled={controlsDisabled}
                  loading={loading}
                  hasUser={Boolean(user)}
                />
              </div>
            </SetupSection>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizSetupView;
