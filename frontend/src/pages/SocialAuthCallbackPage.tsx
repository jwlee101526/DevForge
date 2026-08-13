import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "@/components/auth/AuthCard";
import { useAuthStore } from "@/lib/authStore";

export const SocialAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = params.get("token");
    const id = params.get("id");
    const email = params.get("email");
    const name = params.get("name");
    const provider = params.get("provider") || undefined;

    if (!token || !id || !email || !name) {
      navigate("/login", { replace: true });
      return;
    }

    setAuth(token, { id, email, name, provider });
    navigate("/quiz", { replace: true });
  }, [navigate, setAuth]);

  return (
    <AuthCard
      title="소셜 인증 처리 중"
      description="소셜 계정 정보를 확인하고 있습니다."
      activeMode="login"
      onModeChange={(mode) => navigate(mode === "signup" ? "/signup" : "/login")}
      onHome={() => navigate("/quiz")}
      privacyNotice="인증이 완료되면 학습 화면으로 이동합니다."
    >
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
        잠시만 기다려 주세요.
      </div>
    </AuthCard>
  );
};

export default SocialAuthCallbackPage;
