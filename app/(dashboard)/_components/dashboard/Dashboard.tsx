"use client";

import { DashboardChart } from "@/components/DashboardChart";
import RecentOrders from "@/components/RecentOrders";
import React from "react";

const Header = () => {
  return (
    <div className="flex flex-col py-3 gap-4 h-full">
      <h1 className="text-2xl font-semibold flex-1">Dashboard</h1>
      <div className="grid grid-cols-4 gap-5">
        <div className="flex flex-col gap-5 col-span-2 p-4 border rounded-lg">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-medium font-semibold">Total Revenue</h1>
            <h1 className="text-xl font-semibold">₹</h1>
          </div>
          <h1 className="text-xl ">0</h1>
        </div>
        <div className="flex flex-col gap-5 col-span-1 p-4 border rounded-lg">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-medium font-semibold">Orders</h1>
            <h1 className="text-xl font-semibold">₹</h1>
          </div>
          <h1 className="text-xl ">0</h1>
        </div>
        <div className="flex flex-col gap-5 col-span-1 p-4 border rounded-lg">
          <h1 className="text-medium font-semibold">Products</h1>
          <h1 className="text-xl ">0</h1>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5 h-full">
        <div className="col-span-2">
          <DashboardChart />
        </div>
        <div className="col-span-2">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
};

export default Header;
