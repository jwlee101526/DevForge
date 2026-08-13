import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, Loading01Icon } from "@hugeicons/core-free-icons";
import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/lib/authStore";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setPasswordConfirmError("");
    setStatusError("");

    let isValid = true;

    if (!trimmedName) {
      setNameError("이름(닉네임)을 입력해 주세요.");
      isValid = false;
    }
    if (!trimmedEmail) {
      setEmailError("이메일을 입력해 주세요.");
      isValid = false;
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setEmailError("올바른 이메일 형식을 입력해 주세요.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해 주세요.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
      isValid = false;
    }
    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const data = await signupApi(trimmedEmail, password, trimmedName);
      setAuth(data.token, data.user);
      navigate("/quiz", { replace: true });
    } catch (err) {
      setStatusError((err as Error).message || "회원가입 요청 실패. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="회원가입"
      description="계정을 생성하고 나만의 단어장과 AI 퀴즈 학습 환경을 시작하세요."
      activeMode="signup"
      onModeChange={(mode) => mode === "login" && navigate("/login")}
      onHome={() => navigate("/quiz")}
      privacyNotice="가입 시 개인 개념 단어장 및 퀴즈 저장공간이 생성됩니다."
      footer={
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/login")}
          disabled={loading}
          className="w-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          이미 계정이 있으신가요? <span className="font-bold text-indigo-600 ml-1">로그인</span>
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="signup-name" className="text-xs font-bold text-slate-700">
            이름 / 닉네임
          </label>
          <Input
            id="signup-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            disabled={loading}
            placeholder="홍길동"
            className={`border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500/20 ${
              nameError ? "border-rose-400 focus-visible:ring-rose-200" : ""
            }`}
          />
          {nameError && <p className="text-xs font-medium text-rose-600">{nameError}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="text-xs font-bold text-slate-700">
            이메일 주소
          </label>
          <Input
            id="signup-email"
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
          <label htmlFor="signup-password" className="text-xs font-bold text-slate-700">
            비밀번호
          </label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              disabled={loading}
              placeholder="최소 6자 이상"
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

        <div className="space-y-1.5">
          <label htmlFor="signup-password-confirm" className="text-xs font-bold text-slate-700">
            비밀번호 확인
          </label>
          <Input
            id="signup-password-confirm"
            type={showPassword ? "text" : "password"}
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
              setPasswordConfirmError("");
            }}
            disabled={loading}
            placeholder="비밀번호 재입력"
            className={`border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500/20 ${
              passwordConfirmError ? "border-rose-400 focus-visible:ring-rose-200" : ""
            }`}
          />
          {passwordConfirmError && <p className="text-xs font-medium text-rose-600">{passwordConfirmError}</p>}
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
              <HugeiconsIcon icon={Loading01Icon} className="h-4 w-4 animate-spin" /> 가입 진행 중...
            </span>
          ) : (
            "회원가입 완료"
          )}
        </Button>
      </form>
    </AuthCard>
  );
};

export default SignupPage;
