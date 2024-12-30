"use client";

import { DashboardChart } from "@/components/DashboardChart";
import RecentOrders from "@/components/RecentOrders";
import useOrders from "@/hooks/use-orders";
import { useProduct } from "@/hooks/use-products";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo } from "react";

const Header = () => {
  const pathname = usePathname();
  // Extract storeId once and memoize it
  const storeId = useMemo(() => pathname.split("/")[1], [pathname]);

  const { fetchOrders, orders } = useOrders(storeId);
  const { fetchProducts, products } = useProduct({ storeId });

  // Combine both effects into one
  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([fetchOrders(), fetchProducts()]);
    };

    initializeDashboard();
  }, [storeId]); // Only re-run if storeId changes

  // Calculate derived values outside of render
  const totalRevenue = useMemo(
    () => orders.reduce((acc, order) => acc + parseFloat(order.amount), 0) || 0,
    [orders]
  );
  
  const deliveredOrdersRevenue = useMemo(
    () =>
      orders.reduce(
        (acc, order) => acc + (order.status === "DELIVERED" ? parseFloat(order.amount) : 0),
        0
      ) || 0,
    [orders]
  );
  
  return (
    <div className="flex flex-col py-3 gap-4 h-full">
      <h1 className="text-2xl font-semibold flex-1">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="flex flex-col gap-5 col-span-2 p-4 border rounded-lg">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-medium font-semibold">Total Revenue</h1>
            <h1 className="text-xl font-semibold">₹</h1>
          </div>
          <h1 className="text-xl ">{deliveredOrdersRevenue.toFixed(2)}</h1>
        </div>
        <div className="flex flex-col gap-5 col-span-1 p-4 border rounded-lg">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-medium font-semibold">Orders</h1>
            <h1 className="text-xl font-semibold">₹</h1>
          </div>
          <h1 className="text-xl ">{totalRevenue.toFixed(2)}</h1>
        </div>
        <div className="flex flex-col gap-5 col-span-1 p-4 border rounded-lg">
          <h1 className="text-medium font-semibold">Products</h1>
          <h1 className="text-xl ">{products.length || 0}</h1>
        </div>
      </div>
      <div className="grid grid-rows-4 md:grid-cols-4 grid-flow-row gap-5 h-full">
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
