import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CpuIcon, StarIcon, Add01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { QuizGoal } from "../../types/quiz";
import { SetupSection } from "./SetupSection";

export interface TechStackDifficultySectionProps {
  goal: QuizGoal;
  setGoalValue: (key: string, value: unknown) => void;
  disabled?: boolean;
}

const PRESET_TECH_STACKS = [
  "Java",
  "Spring Boot",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "백엔드",
  "프론트엔드",
  "DB / SQL",
  "OS / 시스템",
  "자료구조 / 알고리즘",
  "네트워크 / HTTP",
];

const DIFFICULTY_LEVELS = [
  { key: "beginner", stars: 1, label: "초급 (기초 용어)" },
  { key: "easy", stars: 2, label: "쉬움 (기본 구현)" },
  { key: "medium", stars: 3, label: "중급 (실무 응용)" },
  { key: "hard", stars: 4, label: "고급 (심화 / 디버깅)" },
  { key: "expert", stars: 5, label: "전문가 (아키텍처)" },
];

export const TechStackDifficultySection: React.FC<TechStackDifficultySectionProps> = ({
  goal,
  setGoalValue,
  disabled,
}) => {
  const [customStackInput, setCustomStackInput] = useState("");
  const selectedTechStacks: string[] = goal.tech_stacks || [];
  const currentDifficulty = goal.difficulty || "medium";

  const toggleTechStack = (stack: string) => {
    if (disabled) return;
    const exists = selectedTechStacks.includes(stack);
    const updated = exists
      ? selectedTechStacks.filter((s) => s !== stack)
      : [...selectedTechStacks, stack];
    setGoalValue("tech_stacks", updated);
  };

  const handleAddCustomStack = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customStackInput.trim();
    if (trimmed && !selectedTechStacks.includes(trimmed)) {
      setGoalValue("tech_stacks", [...selectedTechStacks, trimmed]);
      setCustomStackInput("");
    }
  };

  return (
    <div className="space-y-6">
      {/* 5-Star Difficulty Selection */}
      <SetupSection icon={StarIcon} title="목표 문제 난이도 (1 ~ 5 별점)">
        <div className="grid gap-2.5 sm:grid-cols-5">
          {DIFFICULTY_LEVELS.map((lvl) => {
            const isSelected = currentDifficulty === lvl.key;
            return (
              <button
                key={lvl.key}
                type="button"
                disabled={disabled}
                onClick={() => setGoalValue("difficulty", lvl.key)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all border",
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-900"
                    : "border-slate-100 bg-slate-50/80 text-slate-700 hover:bg-slate-100",
                )}
              >
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <HugeiconsIcon
                      key={idx}
                      icon={StarIcon}
                      className={cn(
                        "h-3.5 w-3.5",
                        idx < lvl.stars
                          ? isSelected
                            ? "fill-amber-400 text-amber-400"
                            : "fill-amber-400/70 text-amber-400/70"
                          : "fill-slate-200 text-slate-200",
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold">{lvl.label}</span>
              </button>
            );
          })}
        </div>
      </SetupSection>

      {/* Tech Stack & Tag Selection */}
      <SetupSection
        icon={CpuIcon}
        title="기술 스택 / 분야 선택"
        meta={selectedTechStacks.length > 0 ? `${selectedTechStacks.length}개 선택됨` : "선택 안 함 (전체)"}
      >
        <div className="space-y-3 p-1">
          <p className="text-xs font-semibold text-slate-500">
            출제받고 싶은 기술 스택이나 카테고리를 선택하세요. 선택된 기술 중심으로 AI가 문제를 생성합니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_TECH_STACKS.map((stack) => {
              const active = selectedTechStacks.includes(stack);
              return (
                <button
                  key={stack}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleTechStack(stack)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all border",
                    active
                      ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {stack}
                  {active && <span className="ml-1 font-extrabold text-xs">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Custom Input */}
          <form onSubmit={handleAddCustomStack} className="flex items-center gap-2 pt-2">
            <Input
              type="text"
              placeholder="기타 기술 스택 직접 입력 (예: Docker, GraphQL...)"
              value={customStackInput}
              disabled={disabled}
              onChange={(e) => setCustomStackInput(e.target.value)}
              className="h-9 max-w-sm rounded-lg border-slate-200 text-xs font-medium focus-visible:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={disabled || !customStackInput.trim()}
              className="flex h-9 items-center gap-1 rounded-lg bg-indigo-50 px-3 text-xs font-bold text-indigo-600 hover:bg-indigo-100 disabled:opacity-40"
            >
              <HugeiconsIcon icon={Add01Icon} className="h-3.5 w-3.5" />
              추가
            </button>
          </form>

          {/* Custom added stacks */}
          {selectedTechStacks.filter((s) => !PRESET_TECH_STACKS.includes(s)).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="text-xs font-bold text-slate-400 self-center">직접 추가:</span>
              {selectedTechStacks
                .filter((s) => !PRESET_TECH_STACKS.includes(s))
                .map((stack) => (
                  <Badge
                    key={stack}
                    className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs text-white"
                  >
                    {stack}
                    <button
                      type="button"
                      onClick={() => toggleTechStack(stack)}
                      className="ml-1 text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
            </div>
          )}
        </div>
      </SetupSection>
    </div>
  );
};

export default TechStackDifficultySection;
