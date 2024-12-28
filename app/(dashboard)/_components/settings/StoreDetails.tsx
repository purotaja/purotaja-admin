"use client";

import { Button } from "@/components/ui/button";
import { useStores } from "@/hooks/use-store";
import { Copy, LucideLoader, SquareStackIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const StoreDetails = () => {
  const { isLoading, stores } = useStores();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LucideLoader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-5 py-5">
      <div className="col-span-2 flex flex-col border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <SquareStackIcon className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Base Url</h1>
          </div>
          <Button
            size={"sm"}
            variant={"ghost"}
            onClick={() => {
              window.navigator.clipboard.writeText(
                process.env.NEXT_PUBLIC_API_URL!
              );
              toast("Copied to clipboard");
            }}
          >
            <Copy />
          </Button>
        </div>
        <code className="text-sm font-norma bg-gray-100 px-2 py-1 rounded-md mt-2">
          {process.env.NEXT_PUBLIC_API_URL!}
        </code>
      </div>
      <div className="col-span-2 flex flex-col border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <SquareStackIcon className="w-5 h-5" />
            <h1 className="text-xl font-semibold">Store Id</h1>
          </div>
          <Button
            size={"sm"}
            variant={"ghost"}
            onClick={() => {
              window.navigator.clipboard.writeText(pathname.split("/")[1]);
              toast("Copied to clipboard");
            }}
          >
            <Copy />
          </Button>
        </div>
        <code className="text-sm font-norma bg-gray-100 px-2 py-1 rounded-md mt-2">
          {pathname.split("/")[1]}
        </code>
      </div>
    </div>
  );
};

export default StoreDetails;
