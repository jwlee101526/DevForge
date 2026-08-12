import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Book02Icon, FilterIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AppSidebar from "@/components/layout/AppSidebar";
import CodePassage from "@/features/quiz/components/practice/CodePassage";
import { defaultFetchQuestionsApi } from "@/features/quiz/api/quizApi";
import type { QuizItem } from "@/features/quiz/types/quiz";

const QUESTION_TYPE_LABELS: Record<string, string> = {
  all: "전체 유형",
  meaning_choice: "개념/용어 사지선다",
  context_choice: "코드 빈칸 사지선다",
  collocation_choice: "키워드/조합",
  usage_choice: "실무 활용 코드",
  short_answer: "단답형 주관식",
  sentence_answer: "코드/서술형",
};

export const QuestionExplorerPage: React.FC = () => {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    defaultFetchQuestionsApi()
      .then((res) => setItems(res.words || []))
      .catch((err) => console.error("Failed to load questions", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      (item.word || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tag || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <HugeiconsIcon icon={Book02Icon} className="h-7 w-7 text-indigo-600" />
              유형별 생성 문제 탐색기
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              생성된 모든 퀴즈 문제와 개념 단어를 문제 유형 및 기술 스택별로 탐색할 수 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/questions/create"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-black text-white hover:bg-indigo-500 shadow-xs"
            >
              <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
              자작 문제 직접 작성
            </Link>
            <Badge className="border-0 bg-indigo-50 text-indigo-600 font-extrabold px-3 py-2 text-xs">
              총 {filteredItems.length}개
            </Badge>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="개념명, 키워드, 태그로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl border-slate-200 text-xs font-medium focus-visible:ring-indigo-500/20"
              />
            </div>

            {/* Type Chips */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <HugeiconsIcon icon={FilterIcon} className="h-4 w-4 text-slate-400 mr-1" />
              {Object.entries(QUESTION_TYPE_LABELS).map(([typeKey, label]) => (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setSelectedType(typeKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedType === typeKey
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Questions Grid */}
        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-slate-100 shadow-xs">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-xs font-bold text-slate-400">생성된 문제를 불러오고 있습니다...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xs">
            <CardContent className="p-0">
              <p className="text-base font-extrabold text-slate-900">검색 조건에 맞는 문제가 없습니다</p>
              <p className="mt-1 text-xs text-slate-500">다른 검색어를 입력하거나 필터를 변경해 보세요.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, idx) => (
              <Card
                key={item.id || idx}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge className="border-0 bg-indigo-50 text-indigo-600 font-extrabold text-xs">
                      {String(item.tag || "공통")}
                    </Badge>
                    <span className="text-[11px] font-bold text-slate-400">
                      시도 {item.attempt_count || 0}회 / 오답 {item.incorrect_count || 0}회
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 leading-snug">{String(item.word || "개념 문제")}</h3>
                  {Boolean(item.korean) && (
                    <p className="mt-1 text-xs font-medium text-slate-600 line-clamp-3 leading-relaxed">
                      {String(item.korean)}
                    </p>
                  )}
                  {Boolean(item.example) && (
                    <div className="mt-2">
                      <CodePassage passage={String(item.example)} targetWord={String(item.word || "")} isCodeType />
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>정답률: {Math.round((item.accuracy || 0) * 100)}%</span>
                  {item.created_at && <span>{item.created_at}</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppSidebar>
  );
};

export default QuestionExplorerPage;
