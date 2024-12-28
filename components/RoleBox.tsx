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
import { Check, ChevronsUpDown, LucideLoader, Store, User } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getUsers } from "@/hooks/get-users";
import { UserType } from "@prisma/client";

const FormSchema = z.object({
  role: z.string(),
});

interface Props {
  id: string;
  user_role: UserType;
}

const RoleBox = ({ id, user_role }: Props) => {
  const { isLoading, users, updateUser } = getUsers();
  const { user } = useUser();
  const pathname = usePathname();

  const roles: UserType[] = ["ADMIN", "USER"];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: user_role || "",
    },
  });

  useEffect(() => {
    form.setValue("role", user_role);
  }, [pathname, form.setValue]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    try {
      updateUser(id, data.role as UserType);
      toast.success("Role changed.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to change role.");
    }
  };

  if (isLoading || !user) {
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
        className="space-y-6 w-full pt-1"
      >
        <FormField
          control={form.control}
          name="role"
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
                          <User />
                          {roles.find((role) => role === field.value)}
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <User />
                          Select role
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
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup>
                        {roles.map((role) => (
                          <CommandItem
                            value={role}
                            key={role}
                            onSelect={() => {
                              form.setValue("role", role);
                              onSubmit(form.getValues());
                            }}
                          >
                            {role}
                            <Check
                              className={cn(
                                "ml-auto",
                                role === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
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

export default RoleBox;
