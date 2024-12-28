import React from "react";
import SalesCard from "./SalesCard";
import { ScrollArea } from "./ui/scroll-area";

const RecentOrders = () => {
  return (
    <ScrollArea className="flex flex-col border rounded-lg p-4">
      <h1 className="font-semibold">Recent Orders</h1>
      <SalesCard datas={[]} />
    </ScrollArea>
  );
};

export default RecentOrders;
