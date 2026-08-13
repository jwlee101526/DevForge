import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Bookmark02Icon,
  BookBookmark01Icon,
  ChartHistogramIcon,
  DeveloperIcon,
  Menu01Icon,
  RefreshIcon,
  SparklesIcon,
  UserIcon,
  ZapIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/lib/authStore";
import { cn } from "@/lib/utils";

export const AppSidebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "퀴즈 생성 & 풀이", path: "/quiz", icon: SparklesIcon },
    { label: "유형별 문제 모아보기", path: "/questions", icon: Book02Icon },
    { label: "책갈피 관리", path: "/bookmarks", icon: Bookmark02Icon },
    { label: "오답 다시 풀기", path: "/retry", icon: RefreshIcon },
    { label: "엄선 개발 문제집", path: "/workbook", icon: BookBookmark01Icon },
    { label: "시나리오 모의면접", path: "/interview", icon: UserIcon },
    { label: "1:1 라이브 면접 스파링", path: "/sparring", icon: ZapIcon },
    { label: "약점 & 학습 리포트", path: "/stats", icon: ChartHistogramIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 bg-slate-900 border-r border-slate-800 text-slate-100 shadow-xl">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 font-black text-xl text-white shadow-lg shadow-indigo-600/30">
            <HugeiconsIcon icon={DeveloperIcon} className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">DevForge</h1>
            <span className="text-[10px] font-bold text-indigo-400 tracking-wider">AI QUIZ PLATFORM</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-400")}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
          {user ? (
            <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-bold text-xs text-white">
                  {user.name ? user.name[0] : "U"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-200">{user.name}</p>
                  <p className="truncate text-[10px] text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] font-extrabold text-slate-400 hover:text-rose-400 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-500 shadow-md"
            >
              <HugeiconsIcon icon={UserIcon} className="h-4 w-4" />
              로그인 / 회원가입
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between bg-slate-900 px-4 py-3 text-white border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg bg-slate-800 p-2 text-slate-200"
          >
            <HugeiconsIcon icon={mobileOpen ? Cancel01Icon : Menu01Icon} className="h-5 w-5" />
          </button>
          <span className="font-black text-base">DevForge</span>
        </div>
        {user ? (
          <span className="text-xs font-bold text-indigo-400">{user.name}님</span>
        ) : (
          <Link to="/login" className="text-xs font-bold text-indigo-400">로그인</Link>
        )}
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-xs bg-slate-900 p-4 text-slate-100 flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="font-black text-lg text-white">DevForge 메뉴</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>
            <nav className="flex-1 space-y-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800"
                >
                  <HugeiconsIcon icon={item.icon} className="h-4 w-4 text-indigo-400" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-64 pt-14 lg:pt-0 w-full min-w-0">
        {children}
      </div>
    </div>
  );
};

export default AppSidebar;
