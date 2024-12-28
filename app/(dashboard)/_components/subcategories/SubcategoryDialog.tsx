import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import SubCategoryForm, { SubcategorySchema } from "./SubcategoryForm";
import { z } from "zod";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "create" | "edit";
  setMode: (mode: "create" | "edit") => void;
  initialData?: z.infer<typeof SubcategorySchema>;
  setInitialData: (data: any) => void;
}

const SubcategoryDialog = ({
  open,
  setOpen,
  mode = "create",
  setMode,
  initialData,
  setInitialData,
}: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setMode("create");
        setInitialData(null);
      }}
    >
      <DialogContent>
        <DialogTitle>
          {mode === "create" ? "Create" : "Update"} Subcategory
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "create" ? "Add" : "Edit"} subcategory for your products
          </p>
        </DialogTitle>
        <div>
          <SubCategoryForm
            mode={mode}
            setOpen={setOpen}
            initialData={initialData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryDialog;
