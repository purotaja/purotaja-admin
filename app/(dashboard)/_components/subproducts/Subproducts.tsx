"use client";

import React, { useState } from "react";
import SubcategoryTable from "./SubproductsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SubproductsForm from "./SubproductsForm";

const Subproducts = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [initialData, setInitialData] = useState();

  return (
    <>
      {!open ? (
        <div className="py-5">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-xl font-semibold">Sub Products</h1>
            <Button size={"sm"} onClick={() => setOpen(true)}>
              <Plus />
              Add Subproducts
            </Button>
          </div>
          <SubcategoryTable
            setOpen={setOpen}
            setMode={setMode}
            setInitialData={setInitialData}
          />
        </div>
      ) : (
        <SubproductsForm
          open={open}
          mode={mode}
          setOpen={setOpen}
          setMode={setMode}
          initialData={initialData}
          setInitialData={setInitialData}
        />
      )}
    </>
  );
};

export default Subproducts;
