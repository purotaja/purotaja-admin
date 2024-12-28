"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", revenue: 186, mobile: 80 },
  { month: "February", revenue: 305, mobile: 200 },
  { month: "March", revenue: 237, mobile: 120 },
  { month: "April", revenue: 73, mobile: 190 },
  { month: "May", revenue: 209, mobile: 130 },
  { month: "June", revenue: 214, mobile: 140 },
];

const chartConfig = {
  revenue: {
    label: "₹ Revenue by Month",
    color: "#151515",
  },
} satisfies ChartConfig;

export function DashboardChart() {
  return (
    <ChartContainer config={chartConfig} className="border rounded-lg p-4">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
