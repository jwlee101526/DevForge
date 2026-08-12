import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, Loading01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { StatsRange } from "../../types/quiz";
import { todayString } from "../../utils/quizUtils";

export interface ReportHeaderProps {
  range: StatsRange;
  onRangeChange?: (range: StatsRange) => void;
  loading?: boolean;
}

const RANGE_OPTIONS = [
  { value: "week", label: "1주", days: 7 },
  { value: "month", label: "1달", days: 30 },
  { value: "quarter", label: "3달", days: 90 },
];

function parseDateOnly(value?: string): Date | null {
  const [year, month, day] = String(value || "").slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatRangeText(range?: StatsRange): string {
  const start = String(range?.startDate || "").replaceAll("-", ".");
  const end = String(range?.endDate || "").replaceAll("-", ".");
  const preset = RANGE_OPTIONS.find((item) => item.value === range?.preset);
  return `${start || "-"}  ~  ${end || "-"}${preset ? `  (${preset.label})` : ""}`;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ range, onRangeChange, loading }) => {
  const applyQuickRange = (option: (typeof RANGE_OPTIONS)[number]) => {
    const end = parseDateOnly(range?.endDate) || parseDateOnly(todayString()) || new Date();
    onRangeChange?.({
      preset: option.value,
      startDate: formatDateOnly(addDays(end, -(option.days - 1))),
      endDate: formatDateOnly(end),
    });
  };

  const setDate = (key: "startDate" | "endDate", value: string) => {
    onRangeChange?.({
      ...range,
      preset: "custom",
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="text-2xl font-black tracking-normal text-slate-950">개발 지식 학습 리포트</h2>
        <p className="mt-2 text-sm font-medium text-slate-600">
          개발 기술 문제풀이 성과와 오답 복습이 필요한 항목을 확인하세요.
        </p>
        <p className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-slate-500">
          <HugeiconsIcon icon={Calendar01Icon} className="h-4 w-4" />
          {formatRangeText(range)}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border border-slate-200 bg-white p-1">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => applyQuickRange(option)}
              className={cn(
                "h-8 rounded-md px-3 text-xs font-bold transition-all",
                range?.preset === option.value ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100/70",
              )}
            >
              {option.label}
            </button>
          ))}
          {range?.preset === "custom" && (
            <span className="inline-flex h-8 items-center rounded bg-slate-100 px-3 text-xs font-bold text-slate-600">
              사용자 지정
            </span>
          )}
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
          시작일
          <Input
            type="date"
            value={range?.startDate || ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDate("startDate", event.target.value)}
            className="h-10 w-40"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
          종료일
          <Input
            type="date"
            value={range?.endDate || ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDate("endDate", event.target.value)}
            className="h-10 w-40"
          />
        </label>
        {loading && <HugeiconsIcon icon={Loading01Icon} className="h-4 w-4 animate-spin text-slate-400" />}
      </div>
    </div>
  );
};
