"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import { z } from "zod";
import { addStore, getStore, updateStore } from "@/actions/store";
import { StoreForm } from "@/components/StoreDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStores } from "@/hooks/use-store";
import { usePathname } from "next/navigation";
import { LucideLoader } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const SettingsForm = () => {
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const { isLoading, stores, refetch } = useStores();
  const { user } = useUser();

  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && stores.length > 0) {
      form.setValue("label", stores[0].label);
    }
  }, [stores]);

  const fetchStore = async () => {
    if (pathname.split("/").length < 2) {
      return;
    }
    const storeId = pathname.split("/")[1];
    const store = await getStore(storeId);
    form.setValue("label", store.label);
  };

  useEffect(() => {
    fetchStore();
  }, []);

  const form = useForm<z.infer<typeof StoreForm>>({
    resolver: zodResolver(StoreForm),
    defaultValues: {
      label:
        stores.find((store) => store.value === pathname.split("/")[1])
          ?.label! || "",
      value: "",
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LucideLoader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const onSubmit = async (data: z.infer<typeof StoreForm>) => {
    setLoading(true);
    try {
      const updatedData = {
        ...data,
        value: v4(),
        id:
          stores.find((store) => store.value === pathname.split("/")[1])?.id! ||
          "",
        userId: user.id,
      };
      await updateStore(updatedData);
      await queryClient.invalidateQueries({ queryKey: ["stores"] });
      refetch();
      toast("Store updated successfully.");
      form.reset();
    } catch (error) {
      toast("Failed to update store.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-1/2 py-5"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormControl>
                <Input {...field} placeholder="Store name" className="w-full" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {loading ? (
            <div className="flex items-center gap-2">
              <LucideLoader className="animate-spin" size={20} />
              Updating
            </div>
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SettingsForm;
