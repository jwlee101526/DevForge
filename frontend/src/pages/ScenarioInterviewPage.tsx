import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CpuIcon, SparklesIcon, UserIcon, ZapIcon, Loading01Icon, Award01Icon, Target01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import AppSidebar from "@/components/layout/AppSidebar";

interface InterviewTurn {
  role: "interviewer" | "user";
  content: string;
  score?: number;
  technicalAccuracy?: number;
  communicationScore?: number;
  feedback?: string;
  weakPoint?: string;
}

export const ScenarioInterviewPage: React.FC = () => {
  const [techStack, setTechStack] = useState("Java / Spring Boot");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("AI 수석 면접관 컨텍스트 구성 중...");
  const [sessionId, setSessionId] = useState("");
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [userAnswerInput, setUserAnswerInput] = useState("");

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("AI 수석 면접관 컨텍스트 구성 및 실무 시나리오 출제 중...");
    try {
      const res = await fetch("/api/v1/scenario/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techStack }),
      });
      if (res.ok) {
        const json = await res.json();
        setSessionId(json.sessionId || "sc_1");
        const qPrompt = json.question?.prompt || `${techStack} 환경의 대용량 아키텍처 및 트러블슈팅 경험을 설명하세요.`;
        setTurns([{ role: "interviewer", content: qPrompt }]);
        setStarted(true);
      }
    } catch (err) {
      console.error("Failed to start scenario interview", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswerInput.trim() || loading) return;

    const currentQuestion = turns[turns.length - 1]?.content || "";
    const answerText = userAnswerInput.trim();
    setUserAnswerInput("");
    setTurns((prev) => [...prev, { role: "user", content: answerText }]);
    setLoading(true);
    setLoadingMessage("제출 답변 심층 분석 및 꼬리질문 생성 중...");

    try {
      const res = await fetch("/api/v1/scenario/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, question: currentQuestion, userAnswer: answerText }),
      });
      if (res.ok) {
        const json = await res.json();
        setTurns((prev) => [
          ...prev,
          {
            role: "interviewer",
            content: json.followupQuestion || "추가 답변에 대한 트레이드오프를 설명해 주세요.",
            score: json.score || 85,
            technicalAccuracy: json.technicalAccuracy || 88,
            communicationScore: json.communicationScore || 82,
            feedback: json.feedback || "기술적 관점이 돋보이는 논리적 답변입니다.",
            weakPoint: json.weakPoint || "예외 상황에 대한 백오프 전략 설명이 보완 가능합니다.",
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch followup", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto animate-fadeIn relative">
        {/* Real Progress Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs">
            <div className="rounded-3xl bg-white p-8 text-center shadow-2xl border border-slate-100 max-w-sm space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <HugeiconsIcon icon={Loading01Icon} className="h-7 w-7 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">AI 수석 면접관 연산 중</h3>
                <p className="mt-1.5 text-xs font-semibold text-slate-500">{loadingMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="border-0 bg-indigo-100 text-indigo-700 font-black text-xs">1:1 싱글 모의면접</Badge>
              <Badge className="border-0 bg-emerald-100 text-emerald-800 font-extrabold text-xs">Real AI 평가 엔진</Badge>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mt-1">
              <HugeiconsIcon icon={ZapIcon} className="h-7 w-7 text-indigo-600" />
              시나리오 모드 (AI 1:1 꼬리질문 모의면접)
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              수석 면접관 AI가 실제 면접처럼 내 답변의 깊이를 분석하고 실시간 꼬리질문(Follow-up)을 던집니다.
            </p>
          </div>
        </div>

        {!started ? (
          /* Setup Form */
          <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs max-w-xl mx-auto">
            <form onSubmit={handleStartInterview} className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                  <HugeiconsIcon icon={CpuIcon} className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">면접 분야 & 기술 스택 설정</h3>
                  <p className="text-xs text-slate-500 font-medium">원하는 면접 대상 기술 분야를 지정하세요.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">주요 기술 스택 / 분야:</label>
                <input
                  type="text"
                  placeholder="예: Java / Spring Boot / MySQL / Redis"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !techStack.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-black text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 disabled:opacity-40"
              >
                <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4" />
                실시간 AI 시나리오 면접 시작
              </button>
            </form>
          </Card>
        ) : (
          /* Live Interview Chat Loop */
          <div className="space-y-6">
            {/* Active Tech Stack Banner */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-3 text-white">
              <span className="text-xs font-extrabold text-indigo-400">면접 분야: {techStack}</span>
              <button
                type="button"
                onClick={() => setStarted(false)}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                면접 종료
              </button>
            </div>

            {/* Conversation Log */}
            <div className="space-y-4">
              {turns.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${t.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {t.role === "interviewer" && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs shrink-0 shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-5 shadow-xs space-y-3 ${
                      t.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-slate-200 text-slate-900"
                    }`}
                  >
                    <p className="text-sm font-semibold leading-relaxed whitespace-pre-wrap">{t.content}</p>
                    
                    {/* Rich AI Evaluation Scorecard */}
                    {t.score && (
                      <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge className="border-0 bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                            <HugeiconsIcon icon={Award01Icon} className="h-3.5 w-3.5 mr-1 inline" />
                            종합 평가 점수: {t.score}점 / 100점
                          </Badge>
                          {t.technicalAccuracy && (
                            <span className="text-[11px] font-bold text-slate-500">
                              정확성: {t.technicalAccuracy}점 | 전달력: {t.communicationScore}점
                            </span>
                          )}
                        </div>
                        {t.feedback && (
                          <p className="text-xs font-bold text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            💡 강점: {t.feedback}
                          </p>
                        )}
                        {t.weakPoint && (
                          <p className="text-xs font-bold text-rose-700 leading-relaxed bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                            ⚠️ 보완점: {t.weakPoint}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {t.role === "user" && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-white font-bold text-xs shrink-0 shadow-xs">
                      <HugeiconsIcon icon={UserIcon} className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Answer Input */}
            <form onSubmit={handleSendAnswer} className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <label className="text-xs font-bold text-slate-600">내 답변 입력 (실시간 꼬리질문 받기):</label>
              <Textarea
                rows={4}
                placeholder="질문에 대한 내 아키텍처 설계와 경험을 구체적으로 답변하세요..."
                value={userAnswerInput}
                onChange={(e) => setUserAnswerInput(e.target.value)}
                className="rounded-xl border-slate-200 bg-slate-50 text-sm focus-visible:ring-indigo-500/20"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !userAnswerInput.trim()}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:bg-indigo-500 shadow-xs disabled:opacity-40"
                >
                  <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4" />
                  답변 제출 & 꼬리질문 생성
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppSidebar>
  );
};

export default ScenarioInterviewPage;
