"use client";

import React, { useState } from "react";
import SubcategoryDialog from "./SubcategoryDialog";
import SubcategoryTable from "./SubcategoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SubproductsTable from "../subproducts/SubproductsTable";
import SubproductsDialog from "../subproducts/SubproductsDialog";

const Subcategory = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [initialData, setInitialData] = useState();

  return (
    <>
      <div className="py-5">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-semibold">Sub categories</h1>
          <Button size={"sm"} onClick={() => setOpen(true)}>
            <Plus />
            Add Subcategory
          </Button>
        </div>
        <SubproductsTable
          setOpen={setOpen}
          setMode={setMode}
          setInitialData={setInitialData}
        />
      </div>
      <SubproductsDialog
        open={open}
        mode={mode}
        setOpen={setOpen}
        setMode={setMode}
        initialData={initialData}
        setInitialData={setInitialData}
      />
    </>
  );
};

export default Subcategory;
