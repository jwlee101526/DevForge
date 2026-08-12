import { useAuthStore } from "@/lib/authStore";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const { token } = useAuthStore.getState();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = body || res.statusText;
    try {
      const parsed = JSON.parse(body) as { message?: string; code?: string };
      message = parsed.message || parsed.code || message;
    } catch {
      // JSON이 아닌 오류 응답은 원문을 그대로 보여준다.
    }
    throw new Error(`API Error ${res.status}: ${message}`);
  }
  return res.json();
}
