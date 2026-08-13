import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, CodeIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AppSidebar from "@/components/layout/AppSidebar";

import { fetchApi } from "@/lib/apiClient";

export const CustomQuestionCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [korean, setKorean] = useState("");
  const [example, setExample] = useState("");
  const [tag, setTag] = useState("React");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || loading) return;
    setLoading(true);
    setSuccessMsg("");

    try {
      await fetchApi("/questions/custom", {
        method: "POST",
        body: JSON.stringify({ word: word.trim(), korean: korean.trim(), example: example.trim(), tag: tag.trim() }),
      });
      setSuccessMsg("자작 문제/개념이 성공적으로 생성되었습니다!");
      setTimeout(() => navigate("/questions"), 1200);
    } catch (err) {
      console.error("Failed to create custom question", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto animate-fadeIn">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <HugeiconsIcon icon={Add01Icon} className="h-7 w-7 text-indigo-600" />
            자작 퀴즈 문제 직접 만들기
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            내가 직접 기술 키워드, 정답 설명, 예제 코드 지문을 작성하여 나만의 문제 은행에 등록합니다.
          </p>
        </div>

        <Card className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">개념 키워드 / 문제 제목 (필수)</label>
              <Input
                type="text"
                placeholder="예: Spring Security @EnableWebSecurity"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="h-11 rounded-xl border-slate-200 text-sm font-bold focus-visible:ring-indigo-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">기술 태그 / 분야</label>
              <Input
                type="text"
                placeholder="예: Spring, Java, React, SQL"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="h-11 rounded-xl border-slate-200 text-sm font-semibold focus-visible:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">개념 설명 / 정답 해설</label>
              <Textarea
                rows={3}
                placeholder="개념의 핵심 동작 원리와 설명..."
                value={korean}
                onChange={(e) => setKorean(e.target.value)}
                className="rounded-xl border-slate-200 text-sm focus-visible:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <HugeiconsIcon icon={CodeIcon} className="h-4 w-4 text-indigo-600" />
                예제 코드 지문 (선택)
              </label>
              <Textarea
                rows={6}
                placeholder="```java&#10;@Configuration&#10;public class SecurityConfig { ... }&#10;```"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                className="font-mono text-xs rounded-xl border-slate-200 bg-slate-900 text-slate-100 focus-visible:ring-indigo-500/20 p-4"
              />
            </div>

            {successMsg && (
              <div className="rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 border border-emerald-200">
                ✅ {successMsg}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate("/questions")}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading || !word.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 disabled:opacity-40"
              >
                <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4" />
                {loading ? "등록 중..." : "자작 문제 저장"}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </AppSidebar>
  );
};

export default CustomQuestionCreatePage;
