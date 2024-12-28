import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import React from "react";
import OrdersForm from "./OrdersForm";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "create" | "edit";
  setMode: (mode: "create" | "edit") => void;
  initialData?: any;
  setInitialData: (initialData: any) => void;
}

const OrdersDialog = ({
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
        <DialogContent>
          <DialogHeader className="text-xl font-semibold">
            Edit Order
          </DialogHeader>
          <OrdersForm mode={mode} initialData={initialData} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    )
  );
};

export default OrdersDialog;
