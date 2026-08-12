import React from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Bookmark02Icon,
  ChartHistogramIcon,
  CodeIcon,
  RefreshIcon,
  SparklesIcon,
  UserIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/authStore";

export const LandingPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-black text-xl text-white shadow-lg shadow-indigo-600/30">
              ⚡
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white leading-none">DevForge</span>
              <span className="block text-[10px] font-bold text-indigo-400 tracking-widest">AI DEV QUIZ</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <HugeiconsIcon icon={CodeIcon} className="h-4 w-4 text-indigo-400" />
              API 명세 (Scalar)
            </a>
            {user ? (
              <Link
                to="/quiz"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
              >
                대시보드로 이동 ➔
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-indigo-500 shadow-sm"
                >
                  <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5" />
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8">
        <Badge className="border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-extrabold px-4 py-1.5 rounded-full">
          ⚡ 백엔드 & 풀스택 개발자를 위한 AI 역량 검증 솔루션
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          실무 소스코드 지문부터 <br className="hidden sm:block" />
          실시간 AI 면접 꼬리질문까지.
        </h1>

        <p className="text-base sm:text-lg font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed">
          DevForge는 단순 암기 퀴즈를 넘어 Java 21, Spring Boot 3, DB 튜닝, 시스템 아키텍처 실무 문제를 AI로 출제하고 약점을 집중 피드백합니다.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/quiz"
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-black text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <HugeiconsIcon icon={SparklesIcon} className="h-5 w-5" />
            무료로 퀴즈 시작하기
          </Link>
          <Link
            to="/interview"
            className="flex items-center gap-2 rounded-2xl bg-slate-800 border border-slate-700 px-7 py-4 text-sm font-bold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <HugeiconsIcon icon={ZapIcon} className="h-5 w-5 text-indigo-400" />
            시나리오 모의면접 체험
          </Link>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">주요 기능 안내</h2>
          <p className="mt-2 text-xs sm:text-sm font-medium text-slate-400">개발자 학습 효율을 cực대화하는 6가지 실무 모드</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-800/60 p-6 border border-slate-800 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <HugeiconsIcon icon={SparklesIcon} className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-white">AI 난이도 & 태그 맞춤 퀴즈</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ⭐1 입문부터 ⭐5 전문가 난이도까지, Java, Spring, DB 등 선택한 기술스택 맞춤 문제 출제.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-6 border border-slate-800 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <HugeiconsIcon icon={ZapIcon} className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-white">시나리오 모의면접 (꼬리질문)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              내 답변에 따라 AI 기술 면접관이 실시간으로 날카로운 연속 꼬리질문을 던지는 실전 모드.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-6 border border-slate-800 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <HugeiconsIcon icon={Book02Icon} className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-white">엄선 문제집 & LLM 꼬기 옵션</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              JVM, Spring, SQL 등 표준 엄선 문제집 제공. LLM 꼬기 모드 켜기 시 보기를 교묘하게 변형.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-6 border border-slate-800 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <HugeiconsIcon icon={Bookmark02Icon} className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-white">책갈피 폴더 GUI 관리</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              중요하거나 자주 보는 문제들을 커스텀 책갈피 폴더로 분류하고 한눈에 모아보는 기능.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-6 border border-slate-800 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <HugeiconsIcon icon={RefreshIcon} className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-white">오답 다시 풀기 보관함</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              과거 풀이 중 틀렸던 개념과 문제를 한데 모아 완벽히 정복할 때까지 재시험 수행.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800/60 p-6 border border-slate-800 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <HugeiconsIcon icon={ChartHistogramIcon} className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-white">약점 리포트 & F~S 랭크</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              취약 개념 자동 분석 및 XP 누적 기반 F~S 랭크 시스템으로 지속적인 동기부여 제공.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500 font-medium">
        <p>© 2026 DevForge. All rights reserved. Built for Engineers by DevForge Team.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
