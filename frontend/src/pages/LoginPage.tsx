import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, Loading01Icon } from "@hugeicons/core-free-icons";
import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { loginApi, socialLoginApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/lib/authStore";

const REMEMBERED_EMAIL_KEY = "devforge.rememberedEmail";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(Boolean(rememberedEmail));
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedEmail = email.trim();
    setEmailError("");
    setPasswordError("");
    setStatusError("");

    if (!trimmedEmail) {
      setEmailError("이메일을 입력해 주세요.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setEmailError("올바른 이메일 형식을 입력해 주세요.");
      return;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi(trimmedEmail, password);
      if (rememberEmail) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, trimmedEmail);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
      setAuth(data.token, data.user);
      navigate("/quiz", { replace: true });
    } catch (err: any) {
      setStatusError(err.message || "로그인 요청 실패. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="로그인"
      description="개발 개념 단어장과 AI 퀴즈 플랫폼에 오신 것을 환영합니다."
      activeMode="login"
      onModeChange={(mode) => mode === "signup" && navigate("/signup")}
      onHome={() => navigate("/quiz")}
      privacyNotice="DevForge는 사용자의 학습 데이터를 안전하게 유지합니다."
      footer={
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/signup")}
          disabled={loading}
          className="w-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          계정이 없으신가요? <span className="font-bold text-indigo-600 ml-1">회원가입</span>
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-xs font-bold text-slate-700">
            이메일
          </label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            disabled={loading}
            placeholder="developer@example.com"
            className={`border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500/20 ${
              emailError ? "border-rose-400 focus-visible:ring-rose-200" : ""
            }`}
          />
          {emailError && <p className="text-xs font-medium text-rose-600">{emailError}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="login-password" className="text-xs font-bold text-slate-700">
            비밀번호
          </label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              disabled={loading}
              placeholder="••••••••"
              className={`pr-10 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500/20 ${
                passwordError ? "border-rose-400 focus-visible:ring-rose-200" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} className="h-4 w-4" />
            </button>
          </div>
          {passwordError && <p className="text-xs font-medium text-rose-600">{passwordError}</p>}
        </div>

        <div className="flex items-center gap-2 py-1">
          <Checkbox
            id="remember-email"
            checked={rememberEmail}
            onCheckedChange={(checked) => setRememberEmail(checked === true)}
            className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
          />
          <label htmlFor="remember-email" className="text-xs text-slate-600 cursor-pointer select-none">
            이메일 기억하기
          </label>
        </div>

        {statusError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
            {statusError}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-indigo-600 font-bold text-white hover:bg-indigo-700 shadow-xs"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={Loading01Icon} className="h-4 w-4 animate-spin" /> 로그인 중...
            </span>
          ) : (
            "로그인"
          )}
        </Button>

        {/* Social Login Divider & Buttons */}
        <div className="pt-3 pb-1">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200"></div>
            <span className="absolute bg-white px-3 text-[11px] font-semibold text-slate-400">
              간편 소셜 로그인
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const data = await socialLoginApi("GITHUB", "demo_code", window.location.origin, "developer@github.com", "GitHub Developer", "gh-1001");
                  setAuth(data.token, data.user);
                  navigate("/quiz", { replace: true });
                } catch (err: any) {
                  setStatusError(err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <span>GitHub</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const data = await socialLoginApi("GOOGLE", "demo_code", window.location.origin, "developer@google.com", "Google Developer", "gg-2002");
                  setAuth(data.token, data.user);
                  navigate("/quiz", { replace: true });
                } catch (err: any) {
                  setStatusError(err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <span className="text-blue-500 font-bold">G</span>oogle
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const data = await socialLoginApi("KAKAO", "demo_code", window.location.origin, "kakao_user@kakao.com", "카카오 개발자", "kk-3003");
                  setAuth(data.token, data.user);
                  navigate("/quiz", { replace: true });
                } catch (err: any) {
                  setStatusError(err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-yellow-300 bg-[#FEE500] text-slate-900 text-xs font-semibold hover:bg-[#FDD800] transition-colors shadow-xs cursor-pointer"
            >
              <span>Kakao</span>
            </button>
          </div>
        </div>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
