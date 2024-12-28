import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import ProductForm, { InitialDataType, ProductsSchema } from "./ProductsForm";
import { z } from "zod";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "create" | "edit";
  setMode: (mode: "create" | "edit") => void;
  initialData?: InitialDataType;
  setInitialData: (initialData: any) => void;
}

const ProductsDialog = ({
  open,
  setOpen,
  mode = "create",
  setMode,
  initialData,
  setInitialData,
}: Props) => {
  return (
    open && (
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setMode("create");
          setInitialData(undefined);
        }}
      >
        <DialogContent className="max-w-screen-2xl">
          <DialogTitle>
            {mode === "create" ? "Create" : "Update"} Product
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "create" ? "Add" : "Edit"} your products
            </p>
          </DialogTitle>
          <div>
            <ProductForm
              mode={mode}
              setOpen={setOpen}
              initialData={initialData}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};

export default ProductsDialog;
