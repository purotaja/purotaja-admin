"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Form, FormControl, FormItem, FormField } from "./ui/form";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronsUpDown, LucideLoader, Store } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { useStores } from "@/hooks/use-store";
import { usePathname } from "next/navigation";
import Link from "next/link";

const FormSchema = z.object({
  store: z.string({
    required_error: "Please select a store.",
  }),
});

const ProfileBox = () => {
  const { isLoading, error, stores } = useStores();
  const { user } = useUser();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      store: "",
    },
  });

  useEffect(() => {
    const storeFromPath = pathname.split("/")[1];
    if (storeFromPath) {
      form.setValue("store", storeFromPath);
    }
  }, [pathname, form.setValue]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    toast("Store changed.");
  };

  if (isLoading || !stores || !user) {
    return (
      <div className="flex justify-center items-center mb-5">
        <LucideLoader className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full mb-5"
      >
        <FormField
          control={form.control}
          name="store"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <div className="flex gap-2 items-center">
                          <Store />
                          {
                            stores.find((store) => store.value === field.value)
                              ?.label
                          }
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <Store />
                          Select store
                        </div>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search store..." />
                    <CommandList>
                      <CommandEmpty>No store found.</CommandEmpty>
                      <CommandGroup>
                        {stores
                          .sort((a, b) => a.label.localeCompare(b.label))
                          .map((store) => (
                            <Link
                              key={store.value}
                              href={`/${store.value}/${pathname
                                .split("/")
                                .slice(2)
                                .join("/")}`}
                            >
                              <CommandItem
                                value={store.label}
                                onSelect={() => {
                                  form.setValue("store", store.value);
                                  onSubmit(form.getValues());
                                }}
                              >
                                {store.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    store.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            </Link>
                          ))}
                        <Separator />
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ProfileBox;
