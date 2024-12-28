"use client";

import React, { useState } from "react";
import OrdersTable from "./OrdersTable";
import OrdersForm from "./OrdersForm";
import OrdersDialog from "./OrdersDialog";

const Orders = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [initialData, setInitialData] = useState();

  return (
    <div className="py-5">
      <h1 className="text-xl font-semibold">Orders</h1>
      <OrdersDialog
        open={open}
        setOpen={setOpen}
        mode={mode}
        setMode={setMode}
        initialData={initialData}
        setInitialData={setInitialData}
      />
      <OrdersTable
        setOpen={setOpen}
        setMode={setMode}
        setInitialData={setInitialData}
      />
    </div>
  );
};

export default Orders;
