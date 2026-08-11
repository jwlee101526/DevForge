import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export interface QuizLoadingOverlayProps {
  activeStep?: number;
  totalQuestionCount?: number;
  elapsedSeconds?: number;
}

const GENERATION_STEPS = [
  "학습 문제 범위를 확인하고 있어요",
  "문항 유형을 배분하고 있어요",
  "AI가 문제를 생성하고 있어요",
  "코드 및 정답 품질 검사를 진행하고 있어요",
  "조금 더 걸리고 있어요",
];

export const QuizLoadingOverlay: React.FC<QuizLoadingOverlayProps> = ({
  activeStep = 0,
  totalQuestionCount = 0,
  elapsedSeconds = 0,
}) => {
  const safeStep = Math.min(activeStep, GENERATION_STEPS.length - 1);
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-md bg-white p-5 text-center shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
        <HugeiconsIcon icon={Loading01Icon} className="mx-auto h-7 w-7 animate-spin text-brand-700" />
        <div className="mt-4 min-w-0">
          <p className="text-base font-black text-slate-950">
            {GENERATION_STEPS[safeStep]}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-400">
            생성 시작 후 {elapsedSeconds.toLocaleString()}초
          </p>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            {safeStep >= 4
              ? "품질 검사를 통과하지 못한 문제는 다시 생성할 수 있어요."
              : totalQuestionCount >= 5
              ? "문항이 많을수록 시간이 더 걸릴 수 있어요. 화면을 닫지 말고 기다려 주세요."
              : "AI가 개발 지식 퀴즈를 만드는 동안 잠시만 기다려 주세요."}
          </p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {GENERATION_STEPS.map((step, index) => (
              <div
                key={step}
                className={cn(
                  "h-1.5 rounded-full transition",
                  index <= safeStep ? "bg-brand-600" : "bg-slate-100",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
