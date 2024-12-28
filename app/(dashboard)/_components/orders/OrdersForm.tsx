import React, { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/utils";
import { ClientUploadedFileData } from "uploadthing/types";
import { toast } from "sonner";
import { LucideLoader, X } from "lucide-react";
import { deleteUploadthingFiles } from "@/lib/server/uploadthing";
import useOrders from "@/hooks/use-orders";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export const CategorySchema = z.object({
  status: z.string(),
  addressId: z.string(),
});

interface Props {
  mode?: "create" | "edit";
  initialData?: any;
  setOpen: (open: boolean) => void;
}

const StatusTypes = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  cancelled: "CANCELLED",
  delivered: "DELIVERED",
};

const OrdersForm = ({ mode = "create", initialData, setOpen }: Props) => {
  const pathname = usePathname();
  const { updateOrder, fetchOrder, loading } = useOrders(
    pathname.split("/")[1]
  );

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData
      ? {
          status: initialData.status,
          addressId: initialData.addressId,
        }
      : {
          status: "",
          addressId: "",
        },
  });

  const onSubmit = async (body: z.infer<typeof CategorySchema>) => {
    try {
      mode === "edit" && updateOrder(initialData.id, body);
      console.log("body: ", body);
      toast.success("Category created successfully");
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to create category");
    } finally {
      setOpen(false);
    }
  };
  
  return (
    <section className="py-5">
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger {...field}>
                      {field.value || "Select status"}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(StatusTypes).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">{mode === "create" ? "Create" : "Edit"}</Button>
        </form>
      </Form>
    </section>
  );
};

export default OrdersForm;
