"use client";

import React, { useState } from "react";
import ProductsTable from "./ProductsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProduct } from "@/hooks/use-products";
import { usePathname } from "next/navigation";
import ProductsForm from "./ProductsForm";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [initialData, setInitialData] = useState();

  return (
    <>
      {!open ? (
        <div className="py-5">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-xl font-semibold">Products</h1>
            <Button
              size={"sm"}
              onClick={() => {
                setOpen(true);
              }}
            >
              <Plus />
              Add Products
            </Button>
          </div>
          <ProductsTable
            setOpen={setOpen}
            setMode={setMode}
            setInitialData={setInitialData}
          />
        </div>
      ) : (
        <ProductsForm
          setOpen={setOpen}
          mode={mode}
          setMode={setMode}
          initialData={initialData}
          setInitialData={setInitialData}
        />
      )}
    </>
  );
};

export default Products;
