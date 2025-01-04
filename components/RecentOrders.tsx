"use client";

import React, { useEffect } from "react";
import SalesCard from "./SalesCard";
import { ScrollArea } from "./ui/scroll-area";
import { usePathname } from "next/navigation";
import useOrders from "@/hooks/use-orders";
import { LucideLoader } from "lucide-react";

const RecentOrders = () => {
  const pathname = usePathname();
  const { loading, fetchOrders, orders } = useOrders(pathname.split("/")[1]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex flex-col border rounded-lg p-4">
        <h1 className="font-semibold">Recent Orders</h1>
        <div className="flex flex-row justify-center items-center py-4 w-full">
          <LucideLoader className="animate-spin w-6 h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border rounded-lg p-4">
      <h1 className="font-semibold">Recent Orders</h1>
      <ScrollArea className="overflow-hidden overflow-y-scroll max-h-96">
        <SalesCard datas={orders} />
      </ScrollArea>
    </div>
  );
};

export default RecentOrders;
