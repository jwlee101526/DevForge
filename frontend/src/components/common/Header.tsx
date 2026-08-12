import React from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DeveloperIcon,
  Logout01Icon,
  Login01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/authStore";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo - Pure & Borderless */}
        <div
          onClick={() => navigate("/quiz")}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <HugeiconsIcon icon={DeveloperIcon} className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-black tracking-tight text-slate-900">DevForge</span>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden flex-col text-right sm:flex">
                <span className="text-xs font-bold text-slate-900">{user.name}</span>
                <span className="text-[11px] text-slate-400">{user.email}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <HugeiconsIcon icon={Logout01Icon} className="mr-1.5 h-4 w-4" />
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="text-slate-700 hover:bg-slate-100 font-semibold"
              >
                <HugeiconsIcon icon={Login01Icon} className="mr-1.5 h-4 w-4 text-indigo-600" />
                로그인
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => navigate("/signup")}
                className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-full px-4"
              >
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
