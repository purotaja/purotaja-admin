"use client";

import React, { useState } from "react";
import CategoryDialog from "./CategoryDialog";
import CategoryTable from "./CategoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Category = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [initialData, setInitialData] = useState();

  return (
    <>
      <div className="py-5">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-semibold">Categories</h1>
          <Button size={"sm"} onClick={() => setOpen(true)}>
            <Plus />
            Add Category
          </Button>
        </div>
        <CategoryTable setOpen={setOpen} setMode={setMode} setInitialData={setInitialData} />
      </div>
      <CategoryDialog open={open} setOpen={setOpen} mode={mode} setMode={setMode} initialData={initialData} setInitialData={setInitialData} />
    </>
  );
};

export default Category;
