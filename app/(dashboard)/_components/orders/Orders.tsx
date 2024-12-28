"use client";

import React, { useState } from "react";
import OrdersTable from "./OrdersTable";

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [initialData, setInitialData] = useState();

  return (
    <div className="py-5">
      <h1 className="text-xl font-semibold">Orders</h1>
      <OrdersTable
        setOpen={setOpen}
        setMode={setMode}
        setInitialData={setInitialData}
      />
    </div>
  );
};

export default Orders;
