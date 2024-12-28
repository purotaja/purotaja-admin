"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Form, FormControl, FormItem, FormField, FormLabel } from "./ui/form";
import { LucideLoader, Plus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { addStore } from "@/actions/store";
import { useQueryClient } from "@tanstack/react-query";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const StoreForm = z.object({
  label: z.string().min(1, "Store name is required"),
  value: z.string().optional(),
});

const StoreDialog = ({ open, setOpen }: props) => {
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { user } = useUser();

  const form = useForm<z.infer<typeof StoreForm>>({
    resolver: zodResolver(StoreForm),
    defaultValues: {
      label: "",
      value: "",
    },
  });

  if (!user) {
    return null;
  }

  const onSubmit = async (data: z.infer<typeof StoreForm>) => {
    setLoading(true);
    try {
      const updatedData = { ...data, value: v4(), id: "", userId: user.id };
      const storeId = await addStore(updatedData);
      await queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast("Store created successfully.");
      router.push(`/${storeId.value}`);
      form.reset();
      setOpen(false);
    } catch (error) {
      toast("Failed to create store.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>
          Create Store
          <p className="text-sm text-gray-600 font-light mt-1">
            Add a new store to add your products
          </p>
        </DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Store name"
                      className="w-full"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {loading ? (
                <div className="flex items-center gap-2">
                  <LucideLoader className="animate-spin" size={20} />
                  Creating
                </div>
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StoreDialog;
