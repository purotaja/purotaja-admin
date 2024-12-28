"use client";

import React, { useEffect, useState } from "react";
import StoreDialog from "@/components/StoreDialog";
import { useStores } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import { LucideLoader } from "lucide-react";

const Page = () => {
  const [open, setOpen] = useState(false);
  const { isLoading, error, stores } = useStores();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && stores.length === 0) {
      setOpen(true);
    } else if (!isLoading && stores.length > 0) {
      router.push(`/${stores[0]?.value}`);
    }
  }, [isLoading, stores, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LucideLoader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <StoreDialog open={open} setOpen={setOpen} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <LucideLoader className="animate-spin w-6 h-6" />
    </div>
  );
};

export default Page;
