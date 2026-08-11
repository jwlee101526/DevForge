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
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export interface MostMissedConceptsChartProps {
  data: { word: string; incorrect: number }[];
}

const chartConfig = {
  incorrect: {
    label: "오답",
    color: "#e11d48",
  },
};

export const MostMissedConceptsChart: React.FC<MostMissedConceptsChartProps> = ({ data }) => {
  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 18, left: 14, bottom: 0 }}>
          <CartesianGrid stroke="#e5e7eb" vertical={false} />
          <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
          <YAxis type="category" dataKey="word" width={110} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#334155" }} />
          <Tooltip content={<ChartTooltipContent formatter={(value) => `${Number(value || 0).toLocaleString()}회`} />} />
          <Bar dataKey="incorrect" name="오답" fill="#e11d48" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
