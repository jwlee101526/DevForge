import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";

export interface QuizLoadingOverlayProps {
  activeStep?: number;
  totalQuestionCount?: number;
  elapsedSeconds?: number;
}

const REAL_PROGRESS_STEPS = [
  { label: "학습 범위 및 선택 태그 분석 중", estSec: 2 },
  { label: "문항 유형 및 난이도 프롬프트 구성 중", estSec: 5 },
  { label: "AI 모델이 개발 퀴즈 및 정답 생성 중", estSec: 15 },
  { label: "코드 및 정답 검증, JSON 파싱 진행 중", estSec: 25 },
  { label: "세션 저장 및 시험지 구성 완료 중", estSec: 35 },
];

export const QuizLoadingOverlay: React.FC<QuizLoadingOverlayProps> = ({
  activeStep = 0,
  totalQuestionCount = 0,
  elapsedSeconds = 0,
}) => {
  // Determine current active step dynamically from real elapsed seconds or passed step
  let currentStepIdx = activeStep;
  if (elapsedSeconds > 0) {
    if (elapsedSeconds >= 25) currentStepIdx = 4;
    else if (elapsedSeconds >= 15) currentStepIdx = 3;
    else if (elapsedSeconds >= 5) currentStepIdx = 2;
    else if (elapsedSeconds >= 2) currentStepIdx = 1;
    else currentStepIdx = 0;
  }

  const safeStep = Math.min(currentStepIdx, REAL_PROGRESS_STEPS.length - 1);
  const calculatedPercent = Math.min(98, Math.max(5, Math.round((elapsedSeconds / 25) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl border border-slate-100">
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <HugeiconsIcon icon={Loading01Icon} className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
        <div className="mt-4 min-w-0">
          <Badge className="mb-2 border-0 bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 text-xs">
            실시간 AI 생성 진행 중 ({calculatedPercent}%)
          </Badge>
          <p className="text-lg font-black text-slate-900">
            {REAL_PROGRESS_STEPS[safeStep].label}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-400">
            경과 시간: <span className="text-indigo-600 font-extrabold">{elapsedSeconds.toLocaleString()}초</span>
          </p>

          {/* Real Progress Bar */}
          <div className="mt-4 space-y-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ease-out"
                style={{ width: `${calculatedPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>퀴즈 세팅</span>
              <span>AI 생성</span>
              <span>완료</span>
            </div>
          </div>

          <p className="mt-4 text-xs font-medium leading-5 text-slate-500 bg-slate-50 p-3 rounded-xl">
            {safeStep >= 3
              ? "검증 단계를 진행하고 있습니다. 잠시만 기다려 주세요."
              : totalQuestionCount >= 5
              ? `총 ${totalQuestionCount}개 문항을 세밀하게 생성하고 있습니다.`
              : "개발 지식 퀴즈 생성이 거의 완료되었습니다."}
          </p>
        </div>
      </div>
    </div>
  );
};
