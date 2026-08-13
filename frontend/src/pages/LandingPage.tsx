import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Bookmark02Icon,
  ChartHistogramIcon,
  DeveloperIcon,
  RefreshIcon,
  SparklesIcon,
  UserIcon,
  ZapIcon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/authStore";

const HERO_DEMO_QUESTION = {
  id: "hero-demo-1",
  questionType: "context_choice",
  title: "Virtual Thread Pinning 과 동시성 락",
  prompt: "Java 21 Virtual Thread 사용 중, synchronized 블록 내부에서 I/O 작업을 수행할 때 발생하는 심각한 성능 목목 현상의 명칭은?",
  passage: `synchronized(lock) {\n    // DB / Network I/O 수행 중 Carrier Thread 점유\n    fileInputStream.read();\n}`,
  choices: [
    { id: "A", text: "Virtual Thread Pinning (캐리어 스레드 고정 현상)", correct: true },
    { id: "B", text: "Deadlock (교착 상태)", correct: false },
    { id: "C", text: "OutOfMemoryError (힙 메모리 고갈)", correct: false },
    { id: "D", text: "Context Switching Overhead (컨텍스트 스위칭 과부하)", correct: false },
  ],
  explanation: "synchronized 블록 및 native 메서드 내에서 I/O 대기가 발생하면 가상 스레드가 플랫폼 스레드(Carrier)에 고정(Pinning)되어 다른 가상 스레드의 스케줄링을 방해합니다. ReentrantLock 사용으로 해결할 수 있습니다.",
};

const TECH_STACK_TAGS = [
  "Java 21", "Spring Boot 3", "JPA / Hibernate", "PostgreSQL", "MySQL",
  "Redis", "Kafka", "Docker", "Kubernetes", "React", "TypeScript", "시스템 아키텍처"
];

export const LandingPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedDemoChoice, setSelectedDemoChoice] = useState<string | null>(null);
  const [showDemoExplanation, setShowDemoExplanation] = useState(false);

  const handleSelectDemo = (choiceId: string) => {
    setSelectedDemoChoice(choiceId);
    setShowDemoExplanation(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Brand Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 font-black text-white shadow-lg shadow-indigo-600/30">
              <HugeiconsIcon icon={DeveloperIcon} className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white leading-none">DevForge</span>
              <span className="block text-[10px] font-bold text-indigo-400 tracking-widest">AI DEV QUIZ PLATFORM</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
            <Link to="/quiz" className="hover:text-white transition-colors">퀴즈 생성 & 풀이</Link>
            <Link to="/interview" className="hover:text-white transition-colors">시나리오 모의면접</Link>
            <Link to="/workbook" className="hover:text-white transition-colors">엄선 개발 문제집</Link>
            <Link to="/stats" className="hover:text-white transition-colors font-semibold text-indigo-400">학습 리포트</Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/quiz"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
              >
                학습 대시보드 ➔
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4.5 py-2.5 text-xs font-black text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all"
                >
                  <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5" />
                  무료 회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative pt-16 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid gap-12 lg:grid-cols-12 lg:items-center relative z-10">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-extrabold text-indigo-300">
              <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4 text-indigo-400" />
              개발자 실무 역량 검증 & AI 학습 엔진 2.0
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              단순 용어 암기를 넘어 <br />
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-white bg-clip-text text-transparent">
                실무 코드 지문과 AI 꼬리질문으로.
              </span>
            </h1>

            <p className="text-base font-medium text-slate-400 leading-relaxed max-w-xl">
              DevForge는 Java 21, Spring Boot 3, DB 튜닝, 분산 아키텍처 실무 문제를 AI로 맞춤 출제하고, 1:1 수석 면접관 AI가 실시간 꼬리질문을 던져 약점을 완벽히 정복하도록 돕습니다.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/quiz"
                className="flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-7 py-4 text-sm font-black text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <HugeiconsIcon icon={SparklesIcon} className="h-5 w-5" />
                지금 무료로 퀴즈 풀기
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
              </Link>

              <Link
                to="/interview"
                className="flex items-center gap-2 rounded-2xl bg-slate-900 border border-slate-800 px-6 py-4 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                <HugeiconsIcon icon={ZapIcon} className="h-5 w-5 text-indigo-400" />
                AI 모의면접 체험
              </Link>
            </div>

            {/* Tech Stack Pills */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider">지원 실무 기술 스택:</span>
              <div className="flex flex-wrap gap-1.5">
                {TECH_STACK_TAGS.slice(0, 7).map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-400 border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Interactive Quiz Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl space-y-4 text-left relative overflow-hidden backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-mono text-xs font-bold text-slate-400">DevForge Live Preview</span>
                </div>
                <Badge className="border-0 bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] px-2.5 py-0.5">
                  직접 체험 가능
                </Badge>
              </div>

              {/* Question Header */}
              <div>
                <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider">Q1. {HERO_DEMO_QUESTION.title}</span>
                <h3 className="text-sm font-extrabold text-white mt-1 leading-snug">{HERO_DEMO_QUESTION.prompt}</h3>
              </div>

              {/* Code Snippet Window */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
                <div className="text-[10px] text-slate-500 mb-1 border-b border-slate-800 pb-1">Snippet.java</div>
                <pre>{HERO_DEMO_QUESTION.passage}</pre>
              </div>

              {/* Choice List */}
              <div className="grid gap-2">
                {HERO_DEMO_QUESTION.choices.map((c) => {
                  const isSelected = selectedDemoChoice === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectDemo(c.id)}
                      className={`flex items-center gap-3 rounded-xl p-3 text-xs font-bold text-left transition-all border ${
                        isSelected
                          ? c.correct
                            ? "border-emerald-500 bg-emerald-950/40 text-emerald-300"
                            : "border-rose-500 bg-rose-950/40 text-rose-300"
                          : "border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800/80"
                      }`}
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-lg font-black text-[11px] ${
                        isSelected ? (c.correct ? "bg-emerald-600 text-white" : "bg-rose-600 text-white") : "bg-slate-800 text-slate-400"
                      }`}>
                        {c.id}
                      </span>
                      <span className="flex-1">{c.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Feedback */}
              {showDemoExplanation && (
                <div className="rounded-xl bg-indigo-950/50 border border-indigo-500/30 p-3.5 text-xs text-indigo-200 space-y-1 animate-fadeIn">
                  <div className="font-extrabold flex items-center gap-1.5 text-indigo-300">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-4 w-4 text-emerald-400" />
                    정답 해설 & 트레이드오프 분석
                  </div>
                  <p className="leading-relaxed text-[11px] font-medium text-slate-300">{HERO_DEMO_QUESTION.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge className="border-0 bg-indigo-500/10 text-indigo-400 font-extrabold text-xs px-3.5 py-1">
            CORE FEATURES
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            개발자 학습 생산성을 극대화하는 6가지 특화 기능
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            실무 중심 문제 출제부터 약점 통계 분석까지 체계적인 학습 루프를 제공합니다.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-3xl bg-slate-900/60 p-7 border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <HugeiconsIcon icon={SparklesIcon} className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-white">AI 난이도 & 태그 맞춤 퀴즈</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              ⭐1 입문 기초 용어부터 ⭐5 전문가 아키텍처 난이도까지. Java, Spring, DB 등 선택한 기술 스택 중심 4지선다 및 서술형 자동 생성.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-3xl bg-slate-900/60 p-7 border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <HugeiconsIcon icon={ZapIcon} className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-white">시나리오 모의면접 (꼬리질문)</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              수석 면접관 AI가 사용자의 답변을 심층 평가하고, 언급된 키워드와 허점에 대해 실시간 연속 꼬리질문(Follow-up)을 던집니다.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-3xl bg-slate-900/60 p-7 border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <HugeiconsIcon icon={Book02Icon} className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-white">엄선 문제집 & LLM 꼬기 옵션</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              JVM, Spring, SQL 성능 튜닝 등 엄선된 정답 표준 문제집 제공. LLM 꼬기 옵션을 켜면 AI가 보기를 교묘하게 변형 출제합니다.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group rounded-3xl bg-slate-900/60 p-7 border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <HugeiconsIcon icon={Bookmark02Icon} className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-white">책갈피 폴더 GUI 관리</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              중요하거나 다시 복습하고 싶은 핵심 문제들을 커스텀 책갈피 폴더로 분류하고, 언제든 한눈에 모아보며 복습할 수 있습니다.
            </p>
          </div>

          {/* Card 5 */}
          <div className="group rounded-3xl bg-slate-900/60 p-7 border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <HugeiconsIcon icon={RefreshIcon} className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-white">오답 다시 풀기 보관함</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              과거 풀이 중 틀렸던 문제와 개념들을 오답 전용 보관함에 수집하여 완벽히 이해할 때까지 반복 재시험을 수행할 수 있습니다.
            </p>
          </div>

          {/* Card 6 */}
          <div className="group rounded-3xl bg-slate-900/60 p-7 border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <HugeiconsIcon icon={ChartHistogramIcon} className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-black text-white">약점 분석 & F~S 랭크 시스템</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              자주 틀리는 오답 키워드 top 10 및 문제 유형별 오답률 자동 산출. 누적 경험치(XP) 기반 독립 F~S 랭크 시스템 제공.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-10 sm:p-14 text-center border border-indigo-500/30 shadow-2xl space-y-6 relative overflow-hidden">
          <Badge className="border-0 bg-indigo-500/30 text-indigo-200 font-extrabold text-xs px-4 py-1">
            START NOW
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            지금 DevForge에서 백엔드 역량을 검증해 보세요.
          </h2>
          <p className="text-sm font-medium text-slate-300 max-w-xl mx-auto">
            별도의 복잡한 설치 없이 브라우저에서 바로 실무 퀴즈와 AI 모의면접을 시작할 수 있습니다.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/quiz"
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-black text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5"
            >
              <HugeiconsIcon icon={SparklesIcon} className="h-5 w-5" />
              무료 퀴즈 생성 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500 font-medium">
        <p>© 2026 DevForge. All rights reserved. Built with Precision for Engineers.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
