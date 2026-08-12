import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SecurityCheckIcon, DeveloperIcon } from "@hugeicons/core-free-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  activeMode?: "login" | "signup";
  onModeChange?: (mode: "login" | "signup") => void;
  onHome?: () => void;
  privacyNotice?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  children,
  footer,
  activeMode,
  onModeChange,
  onHome,
  privacyNotice,
}) => {
  const showModeTabs = Boolean(activeMode && onModeChange);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden rounded-3xl border-0 bg-white text-slate-900 shadow-xl shadow-slate-200/50">
          <CardHeader className="space-y-5 p-8 pb-4">
            <div className="flex items-start justify-center">
              <button
                type="button"
                onClick={onHome}
                className="flex items-center gap-2.5 outline-none transition-opacity hover:opacity-80"
                aria-label="홈으로 이동"
              >
                <HugeiconsIcon icon={DeveloperIcon} className="h-7 w-7 text-indigo-600" />
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  DevForge
                </span>
              </button>
            </div>

            {showModeTabs && (
              <div className="grid grid-cols-2 overflow-hidden rounded-full bg-slate-100 p-1">
                {[
                  { id: "login" as const, label: "로그인" },
                  { id: "signup" as const, label: "회원가입" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onModeChange?.(item.id)}
                    className={cn(
                      "h-9 rounded-full text-sm font-bold transition-all",
                      activeMode === item.id
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <div>
              <CardTitle className="text-xl font-extrabold text-slate-900">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1 text-sm text-slate-500">
                  {description}
                </CardDescription>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-6">{children}</CardContent>

          {privacyNotice && (
            <div className="mx-8 border-t border-slate-100 py-4">
              <div className="flex items-start gap-2.5 rounded-2xl bg-indigo-50/50 px-4 py-3 text-xs text-indigo-900">
                <HugeiconsIcon icon={SecurityCheckIcon} className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <p className="leading-5">{privacyNotice}</p>
              </div>
            </div>
          )}

          {footer && (
            <CardFooter className="bg-slate-50/50 px-8 py-4">
              {footer}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthCard;
