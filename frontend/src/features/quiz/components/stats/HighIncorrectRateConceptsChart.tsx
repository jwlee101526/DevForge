import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

export interface HighIncorrectRateItem {
  word: string;
  attempts: number;
  incorrect: number;
  incorrectRate: number;
}

export interface HighIncorrectRateConceptsChartProps {
  data: HighIncorrectRateItem[];
}

const chartConfig = {
  incorrectRate: {
    label: "오답률",
    color: "#f59e0b",
  },
};

export const HighIncorrectRateConceptsChart: React.FC<HighIncorrectRateConceptsChartProps> = ({ data }) => {
  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 18, left: 14, bottom: 0 }}>
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <YAxis
            type="category"
            dataKey="word"
            width={110}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#334155" }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0]?.payload as HighIncorrectRateItem;
              return (
                <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                  <p className="font-black text-slate-900">{item.word}</p>
                  <p className="mt-1 font-medium text-slate-500">오답률 {item.incorrectRate}%</p>
                  <p className="font-medium text-slate-500">풀이 {item.attempts}회 · 오답 {item.incorrect}회</p>
                </div>
              );
            }}
          />
          <Bar dataKey="incorrectRate" name="오답률" fill="#f59e0b" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
