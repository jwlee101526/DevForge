import type { User } from "@/lib/authStore";
import { API_V1_BASE } from "@/lib/apiClient";

const API_BASE = API_V1_BASE;

export interface AuthApiResponse {
  token: string;
  user: User;
}

export async function loginApi(email: string, password: string): Promise<AuthApiResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return res.json();
}

export async function signupApi(email: string, password: string, name: string): Promise<AuthApiResponse> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "회원가입 요청에 실패했습니다.");
  }
  return res.json();
}

export async function getCurrentUserApi(token: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("인증 세션이 만료되었습니다.");
  }
  return res.json();
}

export async function socialLoginApi(
  provider: string,
  code?: string,
  redirectUri?: string,
  email?: string,
  name?: string,
  providerId?: string
): Promise<AuthApiResponse> {
  const res = await fetch(`${API_BASE}/auth/social/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, code, redirectUri, email, name, providerId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "소셜 로그인 연동에 실패했습니다.");
  }
  return res.json();
}
