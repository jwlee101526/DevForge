import React, { useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const SparringPage: React.FC = () => {
  const [matching, setMatching] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [role, setRole] = useState<"INTERVIEWER" | "CANDIDATE">("CANDIDATE");
  const [currentRound] = useState(1);
  const [question, setQuestion] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [selectedFollowUp, setSelectedFollowUp] = useState<string | null>(null);
  const [scorecard, setScorecard] = useState<{ score: number; feedback: string } | null>(null);

  const startMatching = () => {
    setMatching(true);
    // Simulate WebSocket STOMP handshake and room assignment
    setTimeout(() => {
      setMatching(false);
      setInRoom(true);
      setRoomId("room_" + Math.random().toString(36).substring(2, 9));
      setRole("INTERVIEWER");
      setQuestion("Java의 ConcurrentHashMap과 Hashtable의 동기화 방식 차이에 대해 설명해 주세요.");
    }, 1500);
  };

  const submitAnswer = () => {
    if (!answerInput.trim()) return;
    setAnswers((prev) => [...prev, answerInput]);
    const userAns = answerInput;
    setAnswerInput("");

    // Simulate server AI 3 tail-question recommendations
    setTimeout(() => {
      setFollowUps([
        `"${userAns.substring(0, 15)}..." 답변에서 언급하신 예외 처리 및 성능 튜닝 시 구체적인 기준은 무엇인가요?`,
        "해당 로직에서 분산 환경 대용량 트래픽 발생 시 발생할 수 있는 병목 포인트와 해결책은?",
        "유닛 테스트 및 모킹(Mocking) 시 이 구조의 테스트 용이성을 향상시키려면 어떻게 설계해야 하나요?"
      ]);
    }, 800);
  };

  const selectFollowUp = (q: string) => {
    setSelectedFollowUp(q);
    // Simulate AI Scorecard Evaluation
    setTimeout(() => {
      setScorecard({
        score: 94,
        feedback: "✅ 핵심 기술 개념을 정확히 이해하고 계시며, 꼬리질문 대응도 뛰어납니다. (스코어: 94점 / A+)",
      });
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AppSidebar />

      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              ⚔️ 1:1 라이브 면접 스파링 (Mock Interview Sparring)
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              WebSocket 실시간 대결: 두 개발자가 면접관과 면접자 역할을 번갈아 맡고 AI가 꼬리질문 및 채점을 중계합니다.
            </p>
          </div>
          <Badge className="bg-indigo-600 text-white font-bold px-3 py-1 text-xs">
            {inRoom ? `대결 진행 중 (${roomId})` : "매칭 대기 상태"}
          </Badge>
        </div>

        {!inRoom ? (
          <Card className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-md">
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-4xl mb-6 shadow-inner">
                🎙️
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                1:1 실시간 기술 면접 대결을 시작하세요
              </h2>
              <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                상대방 개발자와 실시간 라이브로 접속하여 면접관/면접자 꼬리질문 대결을 진행합니다.
              </p>
              <button
                onClick={startMatching}
                disabled={matching}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-500 transition-all shadow-md disabled:opacity-50"
              >
                {matching ? "⏳ 상대방 매칭 중..." : "🚀 1:1 라이브 매칭 시작하기"}
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question & Answer Main View */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 shadow-lg">
                <div className="flex items-center justify-between border-b border-indigo-700/50 pb-4 mb-4">
                  <span className="text-xs font-bold text-indigo-300">ROUND {currentRound} · 메인 기술 질문</span>
                  <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30">
                    역할: {role === "INTERVIEWER" ? "면접관 (Interviewer)" : "면접자 (Candidate)"}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold leading-snug">{question}</h3>
              </Card>

              {/* Answer Stream */}
              <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  💬 실시간 답변 내역
                </h4>

                {answers.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center italic">
                    아직 제출된 답변이 없습니다. 아래 입력창에 답변을 작성해 주세요.
                  </p>
                ) : (
                  answers.map((ans, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-medium leading-relaxed">
                      <span className="font-extrabold text-indigo-600 mr-2">면접자:</span> {ans}
                    </div>
                  ))
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Input
                    type="text"
                    placeholder="면접 답변을 입력하세요 (텍스트 / 음성 지원)"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                    className="rounded-xl border-slate-200 text-xs font-semibold h-11"
                  />
                  <button
                    onClick={submitAnswer}
                    className="h-11 px-5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-500 transition-colors whitespace-nowrap"
                  >
                    답변 제출
                  </button>
                </div>
              </Card>
            </div>

            {/* AI Follow-up & Evaluation Side Panel */}
            <div className="space-y-6">
              {/* AI Tail Question Recommendations */}
              <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
                <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
                  🤖 AI 추천 꼬리질문 (Tail Questions)
                </h4>

                {followUps.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">답변 제출 후 AI가 추천 꼬리질문 3개를 생성합니다.</p>
                ) : (
                  <div className="space-y-2">
                    {followUps.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectFollowUp(q)}
                        className={`w-full text-left p-3 rounded-2xl text-xs font-semibold border transition-all ${
                          selectedFollowUp === q
                            ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                            : "border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        ⚡ {q}
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              {/* Scorecard */}
              {scorecard && (
                <Card className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-800">Round 평가 스코어카드</span>
                    <span className="text-xl font-black text-emerald-600">{scorecard.score}점</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
                    {scorecard.feedback}
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SparringPage;
