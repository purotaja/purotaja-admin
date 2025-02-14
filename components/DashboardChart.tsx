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
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import useOrders from "@/hooks/use-orders";
import { getMonthlyOrders } from "@/lib/utils";

const chartConfig = {
  revenue: {
    label: "₹ Revenue by Month",
    color: "#73549B",
  },
} satisfies ChartConfig;

export function DashboardChart() {
  const pathname = usePathname();
  const storeId = useMemo(() => pathname.split("/")[1], [pathname]);

  const { fetchOrders, orders } = useOrders(storeId);

  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([fetchOrders()]);
    };

    initializeDashboard();
  }, [storeId]);

  const chartData = getMonthlyOrders(orders);
  
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
