import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import CategoryForm, { CategorySchema } from "./CategoryForm";
import { z } from "zod";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "edit";
  setMode: (mode: "create" | "edit") => void;
  initialData?: z.infer<typeof CategorySchema>;
  setInitialData: (data: any) => void;
}

const CategoryDialog = ({
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
          {mode === "create" ? "Create" : "Update"} Category
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "create" ? "Add" : "Edit"} category for your products
          </p>
        </DialogTitle>
        <div>
          <CategoryForm
            mode={"create"}
            setOpen={setOpen}
            initialData={initialData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
